export const isInAppBrowser = () => {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /(FBAN|FBAV|Instagram|Line|Twitter|TikTok|LinkedInApp|wv|WebView)/i.test(ua);
};

export const cameFromLinktree = () => {
  if (typeof document === "undefined") return false;
  return /linktr\.ee/i.test(document.referrer || "");
};

export const shouldUseSafeMode = () => {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  if (params.get("safeMode") === "1") return true;
  return isInAppBrowser() || cameFromLinktree();
};
