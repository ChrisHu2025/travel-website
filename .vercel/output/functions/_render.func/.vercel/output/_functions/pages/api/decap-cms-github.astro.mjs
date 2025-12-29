import { AuthorizationCode } from 'simple-oauth2';
export { renderers } from '../../renderers.mjs';

const prerender = false;
async function GET({ request }) {
  const reqUrl = new URL(request.url);
  const BASE_URL = reqUrl.origin;
  const callbackUrl = `${BASE_URL}/api/decap-cms-github`;
  const client = new AuthorizationCode({
    client: {
      id: undefined                                ,
      secret: undefined                                    
    },
    auth: {
      tokenHost: "https://github.com",
      tokenPath: "/login/oauth/access_token",
      authorizePath: "/login/oauth/authorize"
    }
  });
  const code = reqUrl.searchParams.get("code");
  if (!code) {
    const authorizationUri = client.authorizeURL({
      redirect_uri: callbackUrl,
      scope: "repo",
      // 关键：给足权限
      state: "no-state"
      // 配合 config 中 use_state: false
    });
    return new Response(null, {
      status: 302,
      headers: { Location: authorizationUri }
    });
  }
  try {
    const tokenParams = {
      code,
      redirect_uri: callbackUrl
    };
    const accessToken = await client.getToken(tokenParams);
    const token = accessToken.token.access_token;
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
      headers: { "Content-Type": "text/html" }
    });
  } catch (error) {
    console.error("Access Token Error", error.message);
    return new Response("Authentication failed: " + error.message, { status: 500 });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
