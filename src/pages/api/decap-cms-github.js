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

  // === 阶段一：无code，重定向至GitHub授权页面 ===
  if (!code) {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      AUTH_ENDPOINT
    )}&scope=${SCOPE}`;
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
      })
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error('GitHub令牌交换错误:', tokenData);
      // 重定向回CMS前台并携带错误信息
      return new Response(null, {
        status: 302,
        headers: {
          Location: `${BASE_URL}/admin#error=Authentication+failed`,
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    }

    // ✅ 关键成功步骤：重定向回Decap CMS，并通过URL Hash传递token
    return new Response(null, {
      status: 302,
      headers: {
        Location: `${BASE_URL}/admin#token=${tokenData.access_token}`,
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
