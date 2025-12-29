// src/pages/api/decap-cms-github.js
import { AuthorizationCode } from 'simple-oauth2';

export const prerender = false;

export async function GET({ request }) {
  // 1. 动态获取当前域名
  const reqUrl = new URL(request.url);
  const BASE_URL = reqUrl.origin;
  const callbackUrl = `${BASE_URL}/api/decap-cms-github`;

  // 2. 初始化 OAuth2 客户端 (使用 simple-oauth2 库)
  const client = new AuthorizationCode({
    client: {
      id: import.meta.env.GITHUB_CLIENT_ID,
      secret: import.meta.env.GITHUB_CLIENT_SECRET
    },
    auth: {
      tokenHost: 'https://github.com',
      tokenPath: '/login/oauth/access_token',
      authorizePath: '/login/oauth/authorize'
    }
  });

  const code = reqUrl.searchParams.get('code');

  // === 阶段一：如果没有 Code，重定向去 GitHub 授权 ===
  if (!code) {
    const authorizationUri = client.authorizeURL({
      redirect_uri: callbackUrl,
      scope: 'repo', // 关键：给足权限
      state: 'no-state' // 配合 config 中 use_state: false
    });

    return new Response(null, {
      status: 302,
      headers: { Location: authorizationUri }
    });
  }

  // === 阶段二：有 Code，使用库换取 Token ===
  try {
    const tokenParams = {
      code,
      redirect_uri: callbackUrl
    };

    // 核心：库自动帮我们处理握手，如果有错它会抛出异常
    const accessToken = await client.getToken(tokenParams);
    const token = accessToken.token.access_token;

    // === 阶段三：返回通信脚本 ===
    // 这是一个标准的跨窗口通信脚本，兼容性最强
    const script = `
      <script>
        (function() {
          function receiveMessage(e) {
            console.log("Archive: Window loaded");
            // 发送消息给父窗口
            window.opener.postMessage("authorization:github:success:" + JSON.stringify({
              token: "${token}",
              provider: "github"
            }), "*");
            window.close();
          }
          receiveMessage();
        })();
      </script>
    `;

    return new Response(script, {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });
  } catch (error) {
    console.error('Access Token Error', error.message);
    return new Response('Authentication failed: ' + error.message, { status: 500 });
  }
}
