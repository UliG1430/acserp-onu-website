const STORAGE_ORIGIN = "https://tfawyifptufbqaftnkpl.supabase.co";
const STORAGE_PREFIX = "/storage/v1/object/public/site-assets/";
const CACHE_SECONDS = 31_536_000;

const buildStorageUrl = (requestUrl) => {
  const { pathname } = new URL(requestUrl);
  const encodedPath = pathname.startsWith("/media/") ? pathname.slice("/media/".length) : "";

  let segments;
  try {
    segments = encodedPath.split("/").map((segment) => decodeURIComponent(segment));
  } catch {
    return null;
  }

  if (!segments.length || segments.some((segment) => !segment || segment === "." || segment === ".." || segment.includes("\\"))) {
    return null;
  }

  const safePath = segments.map((segment) => encodeURIComponent(segment)).join("/");
  return `${STORAGE_ORIGIN}${STORAGE_PREFIX}${safePath}`;
};

const copyHeader = (source, target, name) => {
  const value = source.get(name);
  if (value) target.set(name, value);
};

export default async (request) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
  }

  const storageUrl = buildStorageUrl(request.url);
  if (!storageUrl) return new Response("Invalid media path", { status: 400 });

  const upstreamHeaders = new Headers();
  copyHeader(request.headers, upstreamHeaders, "accept");
  copyHeader(request.headers, upstreamHeaders, "if-none-match");
  copyHeader(request.headers, upstreamHeaders, "if-modified-since");
  copyHeader(request.headers, upstreamHeaders, "range");

  let upstream;
  try {
    upstream = await fetch(storageUrl, { method: request.method, headers: upstreamHeaders });
  } catch {
    return new Response("Media origin unavailable", { status: 502 });
  }

  const headers = new Headers();
  [
    "accept-ranges",
    "content-length",
    "content-range",
    "content-type",
    "etag",
    "last-modified",
  ].forEach((name) => copyHeader(upstream.headers, headers, name));

  if (upstream.ok || upstream.status === 206 || upstream.status === 304) {
    headers.set("Cache-Control", `public, max-age=${CACHE_SECONDS}, immutable`);
    headers.set("Netlify-CDN-Cache-Control", `public, durable, s-maxage=${CACHE_SECONDS}`);
    headers.set("Netlify-Cache-ID", "acserp-public-media");
  } else {
    headers.set("Cache-Control", "no-store");
  }

  return new Response(request.method === "HEAD" || upstream.status === 304 ? null : upstream.body, {
    status: upstream.status,
    headers,
  });
};

export const config = {
  path: "/media/*",
};
