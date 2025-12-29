// src/pages/api/decap-cms-github.js
export const prerender = false;

export async function GET({ request }) {
  // 1. 动态获取当前请求的 Origin
  const reqUrl = new URL(request.url);
  const BASE_URL = reqUrl.origin;
  const AUTH_ENDPOINT = `${BASE_URL}/api/decap-cms-github`;

  const SCOPE = 'public_repo';
  const CLIENT_ID = import.meta.env.GITHUB_CLIENT_ID;
  const CLIENT_SECRET = import.meta.env.GITHUB_CLIENT_SECRET;

  if (!CLIENT_ID || !CLIENT_SECRET) {
    return new Response('Server config error', { status: 500 });
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
      return new Response(`Error: ${JSON.stringify(tokenData)}`, {
        status: 403,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    // === 阶段三：返回握手脚本 ===
    const token = tokenData.access_token;
    const provider = 'github';
    const data = JSON.stringify({ token: token, provider: provider });

    // ✅ 修复逻辑：使用正确的方式拼接字符串，确保变量被解析
    // 这里的 window.location.origin 确保消息发给当前域名
    const responseHtml = `
      <!DOCTYPE html>
      <html>
      <body>
      <script>
        (function() {
          // 构造消息：authorization:github:success:{...}
          const message = 'authorization:${provider}:success:${data}';

          if (window.opener) {
            // 发送消息给父窗口 (Admin页面)
            window.opener.postMessage(message, window.location.origin);
            window.close();
          } else {
            document.body.innerText = "Error: Cannot communicate with parent window.";
          }
        })();
      </script>
      </body>
      </html>
    `;

    return new Response(responseHtml, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (err) {
    console.error('Auth API Error:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}
