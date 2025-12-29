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
    return new Response('Server configuration error', { status: 500 });
  }

  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  // ✅ 获取 URL 中的所有参数，其中包含了 GitHub 传回来的 state
  const originalParams = new URLSearchParams(url.search);

  // === 阶段一：无 code，重定向到 GitHub 授权页 ===
  if (!code) {
    const redirectUrl = new URL(AUTH_ENDPOINT);
    for (const [key, value] of originalParams) {
      redirectUrl.searchParams.set(key, value);
    }

    const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
    githubAuthUrl.searchParams.set('client_id', CLIENT_ID);
    githubAuthUrl.searchParams.set('redirect_uri', redirectUrl.toString());
    githubAuthUrl.searchParams.set('scope', SCOPE);
    // ✅ 这里的 state 会被 GitHub 原样带回到回调 URL 中

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
    // ✅ 关键修复：从查询参数中提取 state
    const state = originalParams.get('state') || '';

    // 如果没有 state，可以在控制台报个警，但为了兼容性还是继续发送
    if (!state) {
      console.warn('Warning: No state parameter found in callback URL');
    }

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
            // ✅ 将 state 加入到返回的数据包中
            const data = JSON.stringify({
              token: "${token}",
              provider: "${provider}",
              state: "${state}"
            });

            // 构建标准消息格式
            const message = "authorization:${provider}:success:" + data;

            if (window.opener) {
              console.log("Sending message to opener with state...");
              // 发送消息
              window.opener.postMessage(message, "*");

              // 延时关闭
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
