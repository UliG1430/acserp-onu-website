const PUBLIC_STORAGE_PREFIX = "/storage/v1/object/public/site-assets/";

export const getAssetDeliveryUrl = (value, projectOrigin) => {
  if (typeof value !== "string" || !projectOrigin) return value;

  try {
    const url = new URL(value);
    if (url.origin !== projectOrigin || !url.pathname.startsWith(PUBLIC_STORAGE_PREFIX)) return value;

    const assetPath = url.pathname.slice(PUBLIC_STORAGE_PREFIX.length);
    return assetPath ? `/media/${assetPath}` : value;
  } catch {
    return value;
  }
};

export const mapAssetDelivery = (value, projectOrigin) => {
  if (typeof value === "string") return getAssetDeliveryUrl(value, projectOrigin);
  if (Array.isArray(value)) return value.map((item) => mapAssetDelivery(item, projectOrigin));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, mapAssetDelivery(item, projectOrigin)])
    );
  }
  return value;
};
