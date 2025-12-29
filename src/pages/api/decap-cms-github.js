// src/pages/api/decap-cms-github.js
export const prerender = false;

export async function GET({ request }) {
  // ✅ 基础配置
  const BASE_URL = 'https://explorechina.travel';
  const AUTH_ENDPOINT = `${BASE_URL}/api/decap-cms-github`;
  const SCOPE = 'public_repo'; // 如果是私有库请改用 'repo'

  const CLIENT_ID = import.meta.env.GITHUB_CLIENT_ID;
  const CLIENT_SECRET = import.meta.env.GITHUB_CLIENT_SECRET;

  // 1. 检查环境变量
  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error('FATAL: GITHUB_CLIENT_ID 或 GITHUB_CLIENT_SECRET 未设置。');
    return new Response('Server configuration error', { status: 500 });
  }

  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  // === 阶段一：无 code，重定向到 GitHub 授权页 ===
  if (!code) {
    const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
    githubAuthUrl.searchParams.set('client_id', CLIENT_ID);
    githubAuthUrl.searchParams.set('redirect_uri', AUTH_ENDPOINT);
    githubAuthUrl.searchParams.set('scope', SCOPE);
    // 注意：这里不再传递 state 参数，因为 config.ts 中已禁用 use_state

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
      console.error('GitHub Token Exchange Error:', tokenData);
      return new Response(`Authentication Failed: ${JSON.stringify(tokenData)}`, {
        status: 403,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    // === 阶段三：返回 HTML 进行跨窗口通信 ===

    const token = tokenData.access_token;
    const provider = 'github';

    // 构建 HTML 响应
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
            // 构建消息数据，不包含 state
            const data = JSON.stringify({
              token: "${token}",
              provider: "${provider}"
            });

            // Decap CMS 监听的消息格式: "authorization:provider:success:data"
            const message = "authorization:${provider}:success:" + data;

            if (window.opener) {
              console.log("Sending authentication message to opener...");

              // 使用 "*" 允许发送给任意源，解决 www 和非 www 的匹配问题
              window.opener.postMessage(message, "*");

              // 稍微延时后关闭窗口，确保消息已成功发出
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
