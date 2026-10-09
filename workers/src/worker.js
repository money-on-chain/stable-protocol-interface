// Static asset extensions — 404s on these are real errors, not SPA routes
const STATIC_ASSET_RE = /\.(?:js|mjs|css|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|eot|webp|avif|json|map|txt|xml)(\?.*)?$/i;

// Unversioned PWA files must not be cached — browsers use them to detect SW updates
const NO_CACHE_RE = /^\/(sw\.js|service-worker\.js|manifest\.webmanifest|manifest\.json)([\?#].*)?$/i;

export default {
  async fetch(request, env) {
    const cid = await env.DAPP_KV.get("current_cid");
    if (!cid) {
      return new Response("No version deployed yet.", { status: 503 });
    }

    const url = new URL(request.url);

    if (url.pathname === "/_version") {
      return new Response(JSON.stringify({ cid }), {
        headers: { "content-type": "application/json", "cache-control": "no-cache" },
      });
    }

    let servedCid = cid;
    let response = await fetchFromGateway(env.PINATA_GATEWAY, cid, url.pathname + url.search);

    // Clients running an older build (e.g. index.html served by a previously
    // installed service worker) request hashed chunks that no longer exist in
    // the current CID. Workbox only precaches files <5MB, so the large vendor
    // chunk always comes from the network — a 404 there means a blank page.
    // Look the asset up in recent previous deploys before giving up.
    if (response.status === 404 && STATIC_ASSET_RE.test(url.pathname)) {
      const fallback = await fetchFromPreviousCids(env, cid, url.pathname + url.search);
      if (fallback) {
        ({ response, cid: servedCid } = fallback);
      }
    }

    // SPA fallback: unknown paths that aren't static assets get index.html
    if (response.status === 404 && !STATIC_ASSET_RE.test(url.pathname)) {
      response = await fetchFromGateway(env.PINATA_GATEWAY, cid, "/index.html");
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("text/html")) {
      const html = await response.text();
      // Vite builds with base:"" use relative ./assets/ paths. Without <base href="/">,
      // those paths break when index.html is served for a deep SPA route like /governance.
      const patched = html.includes("<base ")
        ? html
        : html.replace("<head>", '<head><base href="/">');
      const headers = new Headers(response.headers);
      headers.delete("content-encoding"); // body is now raw (decompressed) text
      headers.delete("content-length");   // length changed after patching
      headers.set("content-type", "text/html; charset=utf-8");
      // HTML must never be served from browser cache — the CID can change on next deploy
      headers.set("cache-control", "no-cache");
      headers.set("x-ipfs-cid", cid);
      return new Response(patched, { status: response.status, headers });
    }

    const headers = new Headers(response.headers);
    headers.delete("location"); // strip upstream redirect hints so the hash never leaks
    if (NO_CACHE_RE.test(url.pathname)) {
      headers.set("cache-control", "no-cache");
    }
    headers.set("x-ipfs-cid", servedCid);
    return new Response(response.body, { status: response.status, headers });
  },
};

// previous_cids is a JSON array of earlier deploys, newest first, maintained
// by the release workflows when they update current_cid.
async function fetchFromPreviousCids(env, currentCid, path) {
  const previous = (await env.DAPP_KV.get("previous_cids", { type: "json" })) ?? [];
  for (const cid of previous) {
    if (cid === currentCid) continue;
    const response = await fetchFromGateway(env.PINATA_GATEWAY, cid, path);
    if (response.ok) return { response, cid };
  }
  return null;
}

function fetchFromGateway(gateway, cid, path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return fetch(`${gateway}/ipfs/${cid}${normalizedPath}`, { redirect: "follow" });
}
