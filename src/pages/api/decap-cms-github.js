// src/pages/api/decap-cms-github.js
export const prerender = false;

export async function GET({ request }) {
  // ✅ 确保这里与你的实际生产环境域名一致
  const BASE_URL = 'https://explorechina.travel';
  const AUTH_ENDPOINT = `${BASE_URL}/api/decap-cms-github`;
  const SCOPE = 'public_repo'; // 私有库请改用 'repo'

  const CLIENT_ID = import.meta.env.GITHUB_CLIENT_ID;
  const CLIENT_SECRET = import.meta.env.GITHUB_CLIENT_SECRET;

  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error('FATAL: GITHUB_CLIENT_ID 或 GITHUB_CLIENT_SECRET 未设置。');
    return new Response('Server configuration error', { status: 500 });
  }

  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const originalParams = new URLSearchParams(url.search);

  // === 阶段一：无 code，重定向到 GitHub 授权页 ===
  if (!code) {
    const redirectUrl = new URL(AUTH_ENDPOINT);
    // 透传 state 等参数
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
      return new Response(`Authentication Failed: ${JSON.stringify(tokenData)}`, {
        status: 403,
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    // === 阶段三：返回 HTML 进行跨窗口通信 (Headless Auth) ===
    // ✅ 修复核心：不重定向回 /admin，而是通过 postMessage 传递 token 并关闭窗口

    const token = tokenData.access_token;
    // provider 必须与 admin/config.yml 中的 backend.name 一致 ('github')
    const provider = 'github';

    const responseHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Authenticating...</title>
      </head>
      <body>
        <p>正在验证 GitHub 授权，窗口即将关闭...</p>
        <script>
          (function() {
            const data = JSON.stringify({
              token: "${token}",
              provider: "${provider}"
            });

            // 构建 Decap CMS 期望的消息格式: "authorization:provider:success:data"
            const message = "authorization:${provider}:success:" + data;

            // 向父窗口发送消息
            // 第二个参数 targetOrigin 必须匹配你的网站域名，确保安全
            if (window.opener) {
              window.opener.postMessage(message, "${BASE_URL}");
              console.log("Token sent to opener, closing...");
              window.close();
            } else {
              document.body.innerHTML += "<p style='color:red'>错误：无法连接到登录页面，请手动关闭此窗口并重试。</p>";
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
    console.error('认证代理函数异常:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}
