export { renderers } from '../../renderers.mjs';

const prerender = false;
async function GET({ request }) {
  const BASE_URL = "https://explorechina.travel";
  {
    console.error("FATAL: GITHUB_CLIENT_ID 或 GITHUB_CLIENT_SECRET 未设置。");
    return new Response(null, {
      status: 302,
      headers: {
        Location: `${BASE_URL}/admin#error=Server+configuration+error`,
        "Cache-Control": "no-cache, no-store, must-revalidate"
      }
    });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
