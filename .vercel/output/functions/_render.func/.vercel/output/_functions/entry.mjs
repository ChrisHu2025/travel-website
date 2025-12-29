import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_DCEaD_m9.mjs';
import { manifest } from './manifest_WW36QOZq.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/admin.astro.mjs');
const _page2 = () => import('./pages/api/decap-cms-github.astro.mjs');
const _page3 = () => import('./pages/destinations/beijing.astro.mjs');
const _page4 = () => import('./pages/destinations.astro.mjs');
const _page5 = () => import('./pages/in-season.astro.mjs');
const _page6 = () => import('./pages/resorts.astro.mjs');
const _page7 = () => import('./pages/stories/beijing.astro.mjs');
const _page8 = () => import('./pages/stories.astro.mjs');
const _page9 = () => import('./pages/_category_/_---slug_.astro.mjs');
const _page10 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/admin.astro", _page1],
    ["src/pages/api/decap-cms-github.js", _page2],
    ["src/pages/destinations/beijing/index.astro", _page3],
    ["src/pages/destinations/index.astro", _page4],
    ["src/pages/in-season/index.astro", _page5],
    ["src/pages/resorts/index.astro", _page6],
    ["src/pages/stories/beijing/index.astro", _page7],
    ["src/pages/stories/index.astro", _page8],
    ["src/pages/[category]/[...slug].astro", _page9],
    ["src/pages/index.astro", _page10]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "4d0a362e-1849-4cd5-a655-551093a1f211",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
