// src/pages/api/decap-cms-github.js
export const prerender = false;

export async function GET({ request }) {
  // 1. 动态获取当前请求的 Origin
  const reqUrl = new URL(request.url);
  const BASE_URL = reqUrl.origin;
  const AUTH_ENDPOINT = `${BASE_URL}/api/decap-cms-github`;

  // 🔴 关键修改：使用 'repo' 权限
  // 'public_repo' 可能导致 CMS 无法正确读取仓库信息，从而导致登录后卡死
  const SCOPE = 'repo';

  const CLIENT_ID = import.meta.env.GITHUB_CLIENT_ID;
  const CLIENT_SECRET = import.meta.env.GITHUB_CLIENT_SECRET;

  if (!CLIENT_ID || !CLIENT_SECRET) {
    return new Response('Server config error: Missing Client ID/Secret', { status: 500 });
  }

  const code = reqUrl.searchParams.get('code');

  // === 阶段一：重定向到 GitHub ===
  if (!code) {
    const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
    githubAuthUrl.searchParams.set('client_id', CLIENT_ID);
    githubAuthUrl.searchParams.set('redirect_uri', AUTH_ENDPOINT);
    githubAuthUrl.searchParams.set('scope', SCOPE);

    return new Response(null, {
      status: 302,
      headers: {
        Location: githubAuthUrl.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }

  // === 阶段二：换取 Token ===
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
      return new Response(`Error: ${JSON.stringify(tokenData)}`, { status: 403 });
    }

    // === 阶段三：返回标准握手脚本 ===
    const token = tokenData.access_token;
    const provider = 'github';

    // ✅ 标准通信脚本
    const responseHtml = `
      <!DOCTYPE html>
      <html>
      <body>
      <script>
        (function() {
          const msg = JSON.stringify({
            token: "${token}",
            provider: "${provider}"
          });
          // 使用 "*" 确保消息能跨子域发送 (如 www -> non-www)
          if (window.opener) {
            window.opener.postMessage("authorization:${provider}:success:" + msg, "*");
            window.close();
          }
        })();
      </script>
      </body>
      </html>
    `;

    return new Response(responseHtml, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  } catch (err) {
    console.error(err);
    return new Response('Internal Server Error', { status: 500 });
  }
}
