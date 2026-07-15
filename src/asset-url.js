const rawBase = import.meta.env.BASE_URL;
const BASE = rawBase.endsWith("/") ? rawBase : `${rawBase}/`;

/** Resolve a path under `public/` against the Vite base URL. */
export function assetUrl(path) {
  return `${BASE}${String(path).replace(/^\//, "")}`;
}
