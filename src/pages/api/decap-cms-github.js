// src/pages/api/decap-cms-github.js
export const prerender = false;

export async function GET({ request }) {
  const BASE_URL = 'https://explorechina.travel';
  const AUTH_ENDPOINT = `${BASE_URL}/api/decap-cms-github`;
  const SCOPE = 'public_repo';

  const CLIENT_ID = import.meta.env.GITHUB_CLIENT_ID;
  const CLIENT_SECRET = import.meta.env.GITHUB_CLIENT_SECRET;

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

  // ✅ 获取原始查询参数（包括 state、以及其他可能的参数）
  const originalParams = new URLSearchParams(url.search);

  // === 阶段一：无 code，重定向到 GitHub 授权页 ===
  if (!code) {
    // 构造授权 URL，将原始查询参数（如 ?state=...）附加到 redirect_uri
    const redirectUrl = new URL(AUTH_ENDPOINT);
    for (const [key, value] of originalParams) {
      redirectUrl.searchParams.set(key, value);
    }

    const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
    githubAuthUrl.searchParams.set('client_id', CLIENT_ID);
    githubAuthUrl.searchParams.set('redirect_uri', redirectUrl.toString());
    githubAuthUrl.searchParams.set('scope', SCOPE);

    return new Response(null, {
      status: 302,
      headers: {
        Location: githubAuthUrl.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }

  // === 阶段二：有 code，换取 access_token ===
  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        redirect_uri: AUTH_ENDPOINT // 注意：这里不能带 state，否则 GitHub 会报错
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

    // ✅ 构建 hash：包含 token + 所有原始查询参数（主要是 state）
    const hashParams = new URLSearchParams();
    hashParams.append('token', tokenData.access_token);
    for (const [key, value] of originalParams) {
      if (key !== 'code') {
        hashParams.append(key, value); // 透传 state 等参数
      }
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
