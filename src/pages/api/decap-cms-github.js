// src/pages/api/decap-cms-github.js
export const prerender = false; // 必须：声明为动态API路由

export async function GET({ request }) {
  // === 核心配置（硬编码确保绝对一致） ===
  const BASE_URL = 'https://explorechina.travel';
  const AUTH_ENDPOINT = `${BASE_URL}/api/decap-cms-github`;
  const SCOPE = 'public_repo'; // 公开仓库。私有仓库请改为 'repo'

  // === 从Vercel环境变量读取密钥 ===
  const CLIENT_ID = import.meta.env.GITHUB_CLIENT_ID;
  const CLIENT_SECRET = import.meta.env.GITHUB_CLIENT_SECRET;

  // 1. 安全检查（在函数内进行，符合Serverless最佳实践）
  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error('FATAL: GITHUB_CLIENT_ID 或 GITHUB_CLIENT_SECRET 未设置。');
    return new Response(null, {
      status: 302,
      headers: {
        Location: `${BASE_URL}/admin#error=Server+configuration+error`,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }

  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state'); // ✅ 新增：读取 state 参数

  // === 阶段一：无code，重定向至GitHub授权页面 ===
  if (!code) {
    // 构造 GitHub 授权 URL，透传 state（如果存在）
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: AUTH_ENDPOINT,
      scope: SCOPE
    });
    if (state) {
      params.append('state', state); // ✅ 将 CMS 提供的 state 传给 GitHub（推荐，虽非强制）
    }

    const githubAuthUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;
    return new Response(null, {
      status: 302,
      headers: {
        Location: githubAuthUrl,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }

  // === 阶段二：有code，向GitHub交换access_token ===
  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        redirect_uri: AUTH_ENDPOINT
        // 注意：GitHub 不要求回传 state，但有些 provider 要求，这里可选
      })
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error('GitHub令牌交换错误:', tokenData);
      return new Response(null, {
        status: 302,
        headers: {
          Location: `${BASE_URL}/admin#error=Authentication+failed`,
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    }

    // ✅ 关键修改：构建包含 token 和 state 的 hash
    const hashParams = new URLSearchParams();
    hashParams.append('token', tokenData.access_token);
    if (state) {
      hashParams.append('state', state); // ✅ 必须：将原始 state 透传回 CMS
    }

    return new Response(null, {
      status: 302,
      headers: {
        Location: `${BASE_URL}/admin#${hashParams.toString()}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (err) {
    console.error('认证代理函数异常:', err);
    return new Response(null, {
      status: 302,
      headers: {
        Location: `${BASE_URL}/admin#error=Internal+server+error`,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }
}
