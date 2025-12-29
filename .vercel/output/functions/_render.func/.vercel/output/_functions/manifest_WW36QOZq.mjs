import 'cookie';
import 'kleur/colors';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_mYdLwHxk.mjs';
import 'es-module-lexer';
import { g as decodeKey } from './chunks/astro/server_C2PqY4r8.mjs';
import 'clsx';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///D:/Document/China%20travel/travel-website_trae/","adapterName":"@astrojs/vercel/serverless","routes":[{"file":"admin/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/admin","isIndex":false,"type":"page","pattern":"^\\/admin\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin.astro","pathname":"/admin","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"destinations/beijing/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/destinations/beijing","isIndex":true,"type":"page","pattern":"^\\/destinations\\/beijing\\/?$","segments":[[{"content":"destinations","dynamic":false,"spread":false}],[{"content":"beijing","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/destinations/beijing/index.astro","pathname":"/destinations/beijing","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"destinations/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/destinations","isIndex":true,"type":"page","pattern":"^\\/destinations\\/?$","segments":[[{"content":"destinations","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/destinations/index.astro","pathname":"/destinations","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"in-season/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/in-season","isIndex":true,"type":"page","pattern":"^\\/in-season\\/?$","segments":[[{"content":"in-season","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/in-season/index.astro","pathname":"/in-season","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"resorts/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/resorts","isIndex":true,"type":"page","pattern":"^\\/resorts\\/?$","segments":[[{"content":"resorts","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/resorts/index.astro","pathname":"/resorts","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"stories/beijing/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/stories/beijing","isIndex":true,"type":"page","pattern":"^\\/stories\\/beijing\\/?$","segments":[[{"content":"stories","dynamic":false,"spread":false}],[{"content":"beijing","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/stories/beijing/index.astro","pathname":"/stories/beijing","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"stories/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/stories","isIndex":true,"type":"page","pattern":"^\\/stories\\/?$","segments":[[{"content":"stories","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/stories/index.astro","pathname":"/stories","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/decap-cms-github","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/decap-cms-github\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"decap-cms-github","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/decap-cms-github.js","pathname":"/api/decap-cms-github","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"site":"https://explorechina.travel","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["D:/Document/China travel/travel-website_trae/src/pages/admin.astro",{"propagation":"none","containsHead":true}],["D:/Document/China travel/travel-website_trae/src/pages/[category]/[...slug].astro",{"propagation":"in-tree","containsHead":true}],["D:/Document/China travel/travel-website_trae/src/pages/destinations/beijing/index.astro",{"propagation":"in-tree","containsHead":true}],["D:/Document/China travel/travel-website_trae/src/pages/destinations/index.astro",{"propagation":"none","containsHead":true}],["D:/Document/China travel/travel-website_trae/src/pages/in-season/index.astro",{"propagation":"none","containsHead":true}],["D:/Document/China travel/travel-website_trae/src/pages/index.astro",{"propagation":"in-tree","containsHead":true}],["D:/Document/China travel/travel-website_trae/src/pages/resorts/index.astro",{"propagation":"none","containsHead":true}],["D:/Document/China travel/travel-website_trae/src/pages/stories/beijing/index.astro",{"propagation":"in-tree","containsHead":true}],["D:/Document/China travel/travel-website_trae/src/pages/stories/index.astro",{"propagation":"none","containsHead":true}],["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/[category]/[...slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/destinations/beijing/index@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/index@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/stories/beijing/index@_@astro",{"propagation":"in-tree","containsHead":false}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(o,t)=>{let i=async()=>{await(await o())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:src/pages/api/decap-cms-github@_@js":"pages/api/decap-cms-github.astro.mjs","\u0000@astro-page:src/pages/destinations/beijing/index@_@astro":"pages/destinations/beijing.astro.mjs","\u0000@astro-page:src/pages/destinations/index@_@astro":"pages/destinations.astro.mjs","\u0000@astro-page:src/pages/in-season/index@_@astro":"pages/in-season.astro.mjs","\u0000@astro-page:src/pages/resorts/index@_@astro":"pages/resorts.astro.mjs","\u0000@astro-page:src/pages/stories/beijing/index@_@astro":"pages/stories/beijing.astro.mjs","\u0000@astro-page:src/pages/stories/index@_@astro":"pages/stories.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astro-page:src/pages/admin@_@astro":"pages/admin.astro.mjs","\u0000@astro-page:src/pages/[category]/[...slug]@_@astro":"pages/_category_/_---slug_.astro.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","D:/Document/China travel/travel-website_trae/node_modules/astro/dist/env/setup.js":"chunks/astro/env-setup_Cr6XTFvb.mjs","D:/Document/China travel/travel-website_trae/src/content/destinations/beijing/forbidden-city/index.md?astroContentCollectionEntry=true":"chunks/index_CH-UoYOf.mjs","D:/Document/China travel/travel-website_trae/src/content/destinations/beijing/yonghe-temple/detail.md?astroContentCollectionEntry=true":"chunks/detail_CmV9uutd.mjs","D:/Document/China travel/travel-website_trae/src/content/in-season/jiuzhaigou-autumn/test.md?astroContentCollectionEntry=true":"chunks/test_C8m2TrJj.mjs","D:/Document/China travel/travel-website_trae/src/content/resorts/sanya-yalong-bay/test.md?astroContentCollectionEntry=true":"chunks/test_C_dZBIv4.mjs","D:/Document/China travel/travel-website_trae/src/content/stories/beijing/great-wall/test.md?astroContentCollectionEntry=true":"chunks/test_BBqhcMW7.mjs","D:/Document/China travel/travel-website_trae/src/content/homepage/current-display.yaml?astroDataCollectionEntry=true":"chunks/current-display_BDy3_-4R.mjs","D:/Document/China travel/travel-website_trae/src/content/homepage/hero.yaml?astroDataCollectionEntry=true":"chunks/hero_BZ-n_pKE.mjs","D:/Document/China travel/travel-website_trae/src/content/destinations/beijing/forbidden-city/index.md?astroPropagatedAssets":"chunks/index_BssV2FMf.mjs","D:/Document/China travel/travel-website_trae/src/content/destinations/beijing/yonghe-temple/detail.md?astroPropagatedAssets":"chunks/detail_CfgENFt_.mjs","D:/Document/China travel/travel-website_trae/src/content/in-season/jiuzhaigou-autumn/test.md?astroPropagatedAssets":"chunks/test_Byi60i97.mjs","D:/Document/China travel/travel-website_trae/src/content/resorts/sanya-yalong-bay/test.md?astroPropagatedAssets":"chunks/test_C9bYj0pI.mjs","D:/Document/China travel/travel-website_trae/src/content/stories/beijing/great-wall/test.md?astroPropagatedAssets":"chunks/test_DBh2YVE9.mjs","D:\\Document\\China travel\\travel-website_trae\\.astro\\assets.mjs":"chunks/assets_BwNa1IAe.mjs","\u0000astro:data-layer-content":"chunks/_astro_data-layer-content_DiLryTC6.mjs","D:/Document/China travel/travel-website_trae/src/content/destinations/beijing/forbidden-city/index.md":"chunks/index_TthFTSwV.mjs","D:/Document/China travel/travel-website_trae/src/content/destinations/beijing/yonghe-temple/detail.md":"chunks/detail_CU8pC9a3.mjs","D:/Document/China travel/travel-website_trae/src/content/in-season/jiuzhaigou-autumn/test.md":"chunks/test_DOfuiYz5.mjs","D:/Document/China travel/travel-website_trae/src/content/resorts/sanya-yalong-bay/test.md":"chunks/test_B3GO6WU6.mjs","D:/Document/China travel/travel-website_trae/src/content/stories/beijing/great-wall/test.md":"chunks/test_C3mhWnog.mjs","\u0000@astrojs-manifest":"manifest_WW36QOZq.mjs","/astro/hoisted.js?q=0":"_astro/hoisted.D5IDRxW3.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/_slug_.2eiJCVx7.css","/_astro/_slug_.f9y8JPyt.css","/favicon.svg","/css/cms-preview.css","/_astro/hoisted.D5IDRxW3.js","/admin/index.html","/destinations/beijing/index.html","/destinations/index.html","/in-season/index.html","/resorts/index.html","/stories/beijing/index.html","/stories/index.html","/index.html"],"buildFormat":"directory","checkOrigin":false,"serverIslandNameMap":[],"key":"9Bjde3anGilndDAyLmNv70cj5d+fVf7uulx30FYceYs=","experimentalEnvGetSecretEnabled":false});

export { manifest };
