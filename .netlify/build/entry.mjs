import { renderers } from './renderers.mjs';
import { s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CvSoi7hX.mjs';
import { manifest } from './manifest_6Sl7iEZQ.mjs';
import { createExports } from '@astrojs/netlify/ssr-function.js';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/admin.astro.mjs');
const _page2 = () => import('./pages/destinations/_city_.astro.mjs');
const _page3 = () => import('./pages/destinations.astro.mjs');
const _page4 = () => import('./pages/destinations/_---slug_.astro.mjs');
const _page5 = () => import('./pages/in-season.astro.mjs');
const _page6 = () => import('./pages/in-season/_---slug_.astro.mjs');
const _page7 = () => import('./pages/resorts.astro.mjs');
const _page8 = () => import('./pages/resorts/_---slug_.astro.mjs');
const _page9 = () => import('./pages/stories/_city_.astro.mjs');
const _page10 = () => import('./pages/stories.astro.mjs');
const _page11 = () => import('./pages/stories/_---slug_.astro.mjs');
const _page12 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/admin.astro", _page1],
    ["src/pages/destinations/[city].astro", _page2],
    ["src/pages/destinations/index.astro", _page3],
    ["src/pages/destinations/[...slug].astro", _page4],
    ["src/pages/in-season/index.astro", _page5],
    ["src/pages/in-season/[...slug].astro", _page6],
    ["src/pages/resorts/index.astro", _page7],
    ["src/pages/resorts/[...slug].astro", _page8],
    ["src/pages/stories/[city].astro", _page9],
    ["src/pages/stories/index.astro", _page10],
    ["src/pages/stories/[...slug].astro", _page11],
    ["src/pages/index.astro", _page12]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "cd9153ad-1284-4e92-bfa9-571ed4f08bc7"
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (_start in serverEntrypointModule) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
