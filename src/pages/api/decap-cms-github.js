// src/pages/api/decap-cms-github.js
export const prerender = false;

export async function GET({ request }) {
  const BASE_URL = 'https://explorechina.travel';
  const AUTH_ENDPOINT = `${BASE_URL}/api/decap-cms-github`;
  const SCOPE = 'public_repo';

  const CLIENT_ID = import.meta.env.GITHUB_CLIENT_ID;
  const CLIENT_SECRET = import.meta.env.GITHUB_CLIENT_SECRET;

  if (!CLIENT_ID || !CLIENT_SECRET) {
    return new Response('Server config error', { status: 500 });
  }

  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    // 1. 重定向到 GitHub
    const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
    githubAuthUrl.searchParams.set('client_id', CLIENT_ID);
    githubAuthUrl.searchParams.set('redirect_uri', AUTH_ENDPOINT);
    githubAuthUrl.searchParams.set('scope', SCOPE);
    // ❌ 不发送 state，因为 config 中 use_state: false

    return new Response(null, {
      status: 302,
      headers: { Location: githubAuthUrl.toString() }
    });
  }

  try {
    // 2. 换取 Token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
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

    // 3. 返回 HTML
    const token = tokenData.access_token;
    const provider = 'github';

    const responseHtml = `
      <!DOCTYPE html>
      <html>
      <head><title>Auth Success</title></head>
      <body style="background:#f0f0f0; font-family:sans-serif; text-align:center; padding-top:50px;">
        <h2 style="color:green;">登录成功!</h2>
        <p>正在与主窗口通信...</p>
        <p style="font-size:12px; color:#999;">Token: ${token.substring(0, 5)}... (Hidden)</p>
        <script>
          (function() {
            const data = JSON.stringify({ token: "${token}", provider: "${provider}" });
            const message = "authorization:${provider}:success:" + data;

            console.log("📤 [Popup] 准备发送消息:", message);

            if (window.opener) {
              // 发送消息
              window.opener.postMessage(message, "*");
              console.log("📤 [Popup] 消息已发送!");

              // ⏳ 保持窗口打开 2 秒，让用户能看清，也确保消息送达
              setTimeout(() => {
                console.log("👋 [Popup] 关闭窗口");
                window.close();
              }, 2000);
            } else {
              document.body.innerHTML += "<p style='color:red'>错误：找不到父窗口 (window.opener is null)。请确保您是从 admin 页面点击打开的。</p>";
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
    return new Response('Internal Server Error', { status: 500 });
  }
}
