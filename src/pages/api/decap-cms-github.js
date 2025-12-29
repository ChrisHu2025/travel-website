// src/pages/api/decap-cms-github.js
export const prerender = false;

export async function GET({ request }) {
  // 基础配置
  const BASE_URL = 'https://explorechina.travel';
  const AUTH_ENDPOINT = `${BASE_URL}/api/decap-cms-github`;
  const SCOPE = 'public_repo'; // 私有库请改用 'repo'

  const CLIENT_ID = import.meta.env.GITHUB_CLIENT_ID;
  const CLIENT_SECRET = import.meta.env.GITHUB_CLIENT_SECRET;

  // 1. 检查环境变量
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
      return new Response(`Authentication Failed: ${JSON.stringify(tokenData)}`, {
        status: 403,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    // === 阶段三：返回 HTML 进行跨窗口通信 ===

    const token = tokenData.access_token;
    const provider = 'github';

    // ✅ 关键修改 1: 使用 targetOrigin = "*"
    // 这解决了 www vs non-www 或 http vs https 导致的“父页面没反应”问题。
    // ✅ 关键修改 2: 增加 setTimeout
    // 确保消息发送后再关闭窗口。

    const responseHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Authorized</title>
      </head>
      <body>
        <p>登录成功！正在跳转...</p>
        <script>
          (function() {
            const data = JSON.stringify({
              token: "${token}",
              provider: "${provider}"
            });

            const message = "authorization:${provider}:success:" + data;

            if (window.opener) {
              // 1. 发送消息到父窗口
              // 使用 "*" 允许发送给任意源（解决域名不匹配问题）
              window.opener.postMessage(message, "*");

              // 2. 稍等片刻再关闭，确保消息已发出
              setTimeout(function() {
                window.close();
              }, 500);
            } else {
              document.body.innerText = "错误：无法连接到主页面。请手动关闭此窗口并刷新主页面。";
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
