// src/pages/api/decap-cms-github.js
export const prerender = false;

// 硬编码 BASE_URL 以确保与 GitHub OAuth App 中注册的 Callback URL 完全一致
const BASE_URL = 'https://explorechina.travel';
const AUTH_ENDPOINT = `${BASE_URL}/api/decap-cms-github`;

// 从 Vercel 环境变量读取敏感凭据（仅在 Serverless Functions 中可用）
const CLIENT_ID = import.meta.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.GITHUB_CLIENT_SECRET;

// 启动时校验必要配置
if (!CLIENT_ID || !CLIENT_SECRET) {
  throw new Error('Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET in environment variables');
}

export async function GET({ request }) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  // === 阶段一：无有效授权码，重定向至 GitHub 授权页 ===
  if (!code || typeof code !== 'string' || code.trim().length === 0) {
    const scope = 'public_repo'; // 若管理私有仓库，改为 'repo'
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      AUTH_ENDPOINT
    )}&scope=${scope}`;

    return new Response(null, {
      status: 302,
      headers: {
        Location: githubAuthUrl,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }

  // === 阶段二：处理 GitHub 回调，用 code 换取 access_token ===
  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code.trim(),
        redirect_uri: AUTH_ENDPOINT
      })
    });

    const tokenData = await tokenRes.json();

    // 检查 GitHub 返回的错误
    if (tokenData.error) {
      console.error('GitHub OAuth error:', tokenData);
      throw new Error('github_auth_failed');
    }

    // 确保 access_token 存在
    if (!tokenData.access_token) {
      console.error('No access_token in GitHub response:', tokenData);
      throw new Error('invalid_token_response');
    }

    // ✅ 关键：使用 Decap CMS 能识别的 hash 格式
    return new Response(null, {
      status: 302,
      headers: {
        Location: `${BASE_URL}/admin/#token=${tokenData.access_token}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (err) {
    console.error('OAuth handler error:', err.message || err);
    // 返回通用错误，避免泄露内部细节
    return new Response(null, {
      status: 302,
      headers: {
        Location: `${BASE_URL}/admin/#error=authentication_failed`
      }
    });
  }
}
