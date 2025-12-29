// src/pages/api/decap-cms-github.js
export const prerender = false;

export async function GET({ request }) {
  // ✅ 1. 动态获取当前请求的 Origin（协议+域名）
  // 无论用户访问的是 www.explorechina.travel 还是 explorechina.travel
  // 这里都会自动获取正确的域名，确保回调地址匹配
  const reqUrl = new URL(request.url);
  const BASE_URL = reqUrl.origin;
  const AUTH_ENDPOINT = `${BASE_URL}/api/decap-cms-github`;

  const SCOPE = 'public_repo'; // 私有库请改为 'repo'
  const CLIENT_ID = import.meta.env.GITHUB_CLIENT_ID;
  const CLIENT_SECRET = import.meta.env.GITHUB_CLIENT_SECRET;

  // 检查环境变量
  if (!CLIENT_ID || !CLIENT_SECRET) {
    return new Response('Server config error: Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET', { status: 500 });
  }

  const code = reqUrl.searchParams.get('code');

  // === 阶段一：无 code，重定向到 GitHub ===
  if (!code) {
    const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
    githubAuthUrl.searchParams.set('client_id', CLIENT_ID);
    githubAuthUrl.searchParams.set('redirect_uri', AUTH_ENDPOINT);
    githubAuthUrl.searchParams.set('scope', SCOPE);
    // 注意：我们依然不发送 state，配合 config 中的 use_state: false

    return new Response(null, {
      status: 302,
      headers: {
        Location: githubAuthUrl.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }

  // === 阶段二：有 code，换取 Token ===
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

    // === 阶段三：返回标准握手脚本 ===
    const token = tokenData.access_token;
    const provider = 'github';

    // ✅ 构建标准 postMessage 响应
    // 这里的 window.opener.postMessage 会将消息发回给主页面
    // window.location.origin 确保消息只发给当前域名（安全且动态）
    const responseHtml = `
      <!DOCTYPE html>
      <html>
      <body>
      <script>
        (function() {
          const message = 'authorization:${provider}:success:${JSON.stringify({ token: token, provider: provider })}';

          // 发送消息给父窗口
          if (window.opener) {
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
