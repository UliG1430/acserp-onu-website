import createDOMPurify from "dompurify";

const SAFE_PROTOCOLS = new Set(["http:", "https:"]);
const YOUTUBE_ID_PATTERN = /^[a-zA-Z0-9_-]{6,20}$/;

export const sanitizeRichHtml = (html = "") => {
  if (typeof window === "undefined") return "";
  const sanitized = createDOMPurify(window).sanitize(String(html), {
    USE_PROFILES: { html: true },
    ADD_ATTR: ["target"],
    FORBID_TAGS: ["form", "iframe", "object", "embed", "script", "style"],
    FORBID_ATTR: ["style"],
  });

  const template = window.document.createElement("template");
  template.innerHTML = sanitized;
  template.content.querySelectorAll("a").forEach((link) => {
    const href = link.getAttribute("href") || "";
    if (!isSafeExternalUrl(href, { allowRelative: true })) {
      link.removeAttribute("href");
      link.removeAttribute("target");
      return;
    }
    if (link.target === "_blank") link.rel = "noopener noreferrer";
  });
  return template.innerHTML;
};

export const isSafeExternalUrl = (value, { allowRelative = false, allowedHosts } = {}) => {
  const candidate = String(value || "").trim();
  if (!candidate) return true;
  if (allowRelative && (candidate.startsWith("/") || candidate.startsWith("#"))) return true;

  try {
    const url = new URL(candidate);
    if (!SAFE_PROTOCOLS.has(url.protocol) || url.username || url.password) return false;
    if (allowedHosts?.length && !allowedHosts.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`))) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

export const openExternalUrl = (value) => {
  if (!isSafeExternalUrl(value)) return false;
  window.open(value, "_blank", "noopener,noreferrer");
  return true;
};

export const safeExternalHref = (value) => isSafeExternalUrl(value) ? value : undefined;

export const normalizeYouTubeId = (value = "") => {
  const candidate = String(value).trim();
  return YOUTUBE_ID_PATTERN.test(candidate) ? candidate : "";
};

const assertSafeUrl = (value, label, options) => {
  if (!isSafeExternalUrl(value, options)) throw new Error(`${label} debe usar una URL http o https válida.`);
};

export const validateSiteContentUrls = (content) => {
  assertSafeUrl(content.links?.joinForm, "El formulario Sumate");
  assertSafeUrl(content.links?.resourcesDrive, "El Drive de recursos");
  (content.links?.additionalResources || []).forEach((resource) => assertSafeUrl(resource.url, `El recurso “${resource.title || "sin título"}”`));

  const donations = content.donations || {};
  assertSafeUrl(donations.heroButtonUrl, "El botón principal de donaciones");
  assertSafeUrl(donations.homeCtaButtonUrl, "El botón de donaciones de inicio");
  assertSafeUrl(donations.popup?.buttonUrl, "El botón del popup de donaciones");

  (content.organs || []).forEach((organ) => {
    if (organ.topicLink && organ.topicLink !== "#") assertSafeUrl(organ.topicLink, `El tópico de ${organ.shortName || organ.name}`);
  });
  (content.photos?.carouselSections || []).forEach((section) => assertSafeUrl(section.folderUrl, `La carpeta de ${section.title}`));
  (content.photos?.driveFolders || []).forEach((folder) => {
    assertSafeUrl(folder.previewUrl, `El preview de ${folder.title}`);
    assertSafeUrl(folder.folderUrl, `La carpeta de ${folder.title}`);
  });
  assertSafeUrl(content.photos?.popup?.buttonUrl, "El botón del popup de fotos");

  (content.socialPosts?.instagram || []).forEach((url) => assertSafeUrl(url, "Instagram", { allowedHosts: ["instagram.com"] }));
  (content.socialPosts?.tiktok || []).forEach((url) => assertSafeUrl(url, "TikTok", { allowedHosts: ["tiktok.com"] }));
  (content.socialPosts?.linkedin || []).forEach((post) => {
    assertSafeUrl(post.embedUrl, "LinkedIn", { allowedHosts: ["linkedin.com"] });
    assertSafeUrl(post.postUrl, "LinkedIn", { allowedHosts: ["linkedin.com"] });
  });
  (content.socialPosts?.youtube || []).forEach((video) => {
    if (!normalizeYouTubeId(video.id)) throw new Error("Cada video de YouTube debe tener una URL o ID válido.");
    assertSafeUrl(video.url, "YouTube", { allowedHosts: ["youtube.com", "youtu.be"] });
  });
  return content;
};
