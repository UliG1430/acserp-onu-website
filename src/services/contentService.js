import { defaultSiteContent } from "../data/siteContent";
import { getCapturedPasswordRecoverySession, isSupabaseConfigured, supabase, supabaseProjectOrigin } from "../lib/supabaseClient";
import { sanitizeRichHtml, validateSiteContentUrls } from "../utils/contentSecurity";
import { collectAssetUrls, mergeSiteContent, toPublishedSiteContent } from "../utils/siteContent";
import { buildPasswordResetRedirect } from "../utils/authSecurity";
import { optimizeImageFile } from "../utils/imageOptimization";
import { mapAssetDelivery } from "../utils/assetDelivery";

const LOCAL_DRAFT_KEY = "acserp_admin_content";
const LOCAL_PUBLIC_KEY = "acserp_public_content";
const LOCAL_REVISION_KEY = "acserp_admin_content_revision";
const STORAGE_BUCKET = "site-assets";
const allowedImageTypes = new Map([
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
  ["image/svg+xml", "svg"],
  ["image/avif", "avif"],
  ["image/heic", "heic"],
  ["image/heif", "heif"],
]);
const pendingUploads = new Map();
const pendingRemovals = new Map();

export const isAdminDemoEnabled = !isSupabaseConfigured
  && import.meta.env.DEV
  && import.meta.env.VITE_ENABLE_ADMIN_DEMO === "true";

const isAdminUser = (user) => user?.app_metadata?.role === "admin";

const readLocalJson = (key) => {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const sanitizeContent = (content) => {
  validateSiteContentUrls(content);
  const { rules: _legacyRules, countriesByOrgan: _legacyCountries, ...links } = content.links || {};
  return {
    ...content,
    links,
    organs: (content.organs || []).map(({ topicText: _legacyTopicText, ...organ }) => organ),
    adminNews: (content.adminNews || []).map(({ videoUrl: _legacyVideoUrl, ...news }) => ({
      ...news,
      content: news.content?.includes("<") ? sanitizeRichHtml(news.content) : news.content,
    })),
  };
};

const sanitizeStorageFolder = (folder) => String(folder || "uploads")
  .split("/")
  .map((segment) => segment.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "") || "uploads")
  .join("/");

const sanitizeSvg = async (file) => {
  const parser = new DOMParser();
  const documentNode = parser.parseFromString(await file.text(), "image/svg+xml");
  if (documentNode.querySelector("parsererror") || documentNode.documentElement.nodeName.toLowerCase() !== "svg") {
    throw new Error("El archivo SVG no es válido.");
  }

  documentNode.querySelectorAll("script, foreignObject, iframe, object, embed").forEach((node) => node.remove());
  documentNode.querySelectorAll("*").forEach((node) => {
    [...node.attributes].forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim().toLowerCase();
      if (name.startsWith("on") || ((name === "href" || name.endsWith(":href")) && value.startsWith("javascript:"))) {
        node.removeAttribute(attribute.name);
      }
    });
  });

  const serialized = new XMLSerializer().serializeToString(documentNode.documentElement);
  return new File([serialized], file.name, { type: "image/svg+xml", lastModified: file.lastModified });
};

const validateAsset = async (file) => {
  const extension = file?.name?.match(/\.([a-z0-9]+)$/i)?.[1]?.toLowerCase();
  const knownImageExtension = ["avif", "bmp", "gif", "heic", "heif", "jpeg", "jpg", "png", "svg", "webp"].includes(extension);
  if (!file?.type?.startsWith("image/") && !knownImageExtension) throw new Error("Seleccioná un archivo de imagen.");
  return file.type === "image/svg+xml" ? sanitizeSvg(file) : file;
};

const getFileExtension = (file) => {
  const knownExtension = allowedImageTypes.get(file.type);
  if (knownExtension) return knownExtension;
  const fileExtension = file.name.match(/\.([a-z0-9]+)$/i)?.[1]?.toLowerCase();
  return fileExtension || "img";
};

const removeStoredPaths = async (paths) => {
  if (!isSupabaseConfigured || paths.length === 0) return;
  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove(paths);
  if (error) throw error;
};

const getManagedStoragePath = (value) => {
  if (typeof value !== "string") return "";
  try {
    const url = new URL(value);
    if (url.origin !== supabaseProjectOrigin) return "";
    const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
    const markerIndex = url.pathname.indexOf(marker);
    return markerIndex === -1 ? "" : decodeURIComponent(url.pathname.slice(markerIndex + marker.length));
  } catch {
    return "";
  }
};

const replaceAssetUrls = (value, replacements) => {
  if (typeof value === "string") return replacements.get(value) || value;
  if (Array.isArray(value)) return value.map((item) => replaceAssetUrls(item, replacements));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, replaceAssetUrls(item, replacements)]));
  }
  return value;
};

export const contentService = {
  async getContent() {
    if (!isSupabaseConfigured) {
      const localPublic = readLocalJson(LOCAL_PUBLIC_KEY);
      return mergeSiteContent(defaultSiteContent, localPublic || {});
    }

    const { data, error } = await supabase.from("site_content").select("content").eq("id", "main").single();
    if (error && error.code !== "PGRST116") throw error;
    const content = mergeSiteContent(defaultSiteContent, data?.content || {});
    return import.meta.env.PROD ? mapAssetDelivery(content, supabaseProjectOrigin) : content;
  },

  async getAdminContent() {
    if (!isSupabaseConfigured) {
      if (!isAdminDemoEnabled) throw new Error("El panel admin no está configurado.");
      const localDraft = readLocalJson(LOCAL_DRAFT_KEY);
      return {
        content: mergeSiteContent(defaultSiteContent, localDraft || {}),
        updatedAt: window.localStorage.getItem(LOCAL_REVISION_KEY) || "local-initial",
      };
    }

    const { data, error } = await supabase.rpc("get_site_content_draft");
    if (error) throw error;
    return { content: mergeSiteContent(defaultSiteContent, data.content || {}), updatedAt: data.updated_at };
  },

  async saveContent(content, expectedUpdatedAt) {
    const sanitizedContent = sanitizeContent(content);

    if (!isSupabaseConfigured) {
      if (!isAdminDemoEnabled) throw new Error("El guardado local del panel está deshabilitado.");
      const currentRevision = window.localStorage.getItem(LOCAL_REVISION_KEY) || "local-initial";
      if (currentRevision !== expectedUpdatedAt) throw new Error("El contenido cambió en otra sesión. Recargá antes de guardar.");
      const nextRevision = new Date().toISOString();
      window.localStorage.setItem(LOCAL_DRAFT_KEY, JSON.stringify(sanitizedContent));
      window.localStorage.setItem(LOCAL_PUBLIC_KEY, JSON.stringify(toPublishedSiteContent(sanitizedContent)));
      window.localStorage.setItem(LOCAL_REVISION_KEY, nextRevision);
      return { content: sanitizedContent, updatedAt: nextRevision };
    }

    const { data, error } = await supabase.rpc("save_site_content", {
      next_content: sanitizedContent,
      expected_updated_at: expectedUpdatedAt,
    });
    if (error) throw error;
    return { content: sanitizedContent, updatedAt: data };
  },

  async signIn(email, password) {
    if (!isSupabaseConfigured) {
      if (!isAdminDemoEnabled) throw new Error("Falta configurar Supabase; el acceso admin está bloqueado.");
      const user = { email: email || "demo@admin.local", app_metadata: { role: "admin" } };
      window.localStorage.setItem("acserp_demo_admin", user.email);
      return { user };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (!isAdminUser(data.user)) {
      await supabase.auth.signOut();
      throw new Error("Tu usuario no tiene permisos de administrador.");
    }
    return data;
  },

  async requestPasswordReset(email) {
    if (!isSupabaseConfigured) throw new Error("La recuperación de contraseña no está configurada.");
    const redirectTo = buildPasswordResetRedirect(window.location.origin);
    const { error } = await supabase.auth.resetPasswordForEmail(String(email || "").trim(), { redirectTo });
    if (error) throw error;
  },

  async getRecoverySession() {
    if (!isSupabaseConfigured) return null;
    const { error } = await supabase.auth.getSession();
    if (error) throw error;
    await new Promise((resolve) => setTimeout(resolve, 0));
    return getCapturedPasswordRecoverySession();
  },

  onRecoveryStateChange(callback) {
    if (!isSupabaseConfigured) return () => {};
    const { data } = supabase.auth.onAuthStateChange((event, session) => callback(event, session));
    return () => data.subscription.unsubscribe();
  },

  async updatePassword(password) {
    if (!isSupabaseConfigured) throw new Error("La recuperación de contraseña no está configurada.");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  },

  async signOut() {
    if (!isSupabaseConfigured) {
      window.localStorage.removeItem("acserp_demo_admin");
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    if (!isSupabaseConfigured) {
      if (!isAdminDemoEnabled) return null;
      const email = window.localStorage.getItem("acserp_demo_admin");
      return email ? { user: { email, app_metadata: { role: "admin" } } } : null;
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !isAdminUser(userData.user)) return null;
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  onAuthStateChange(callback) {
    if (!isSupabaseConfigured) return () => {};
    const { data } = supabase.auth.onAuthStateChange((event, session) => callback(isAdminUser(session?.user) ? session : null, event));
    return () => data.subscription.unsubscribe();
  },

  async uploadAsset(originalFile, folder = "uploads", { profile = "content" } = {}) {
    const validatedFile = await validateAsset(originalFile);
    const optimization = await optimizeImageFile(validatedFile, profile);
    const file = optimization.file;
    if (!isSupabaseConfigured) {
      if (!isAdminDemoEnabled) throw new Error("Los uploads locales están deshabilitados.");
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ publicUrl: reader.result, optimization });
        reader.onerror = () => reject(new Error("No se pudo leer el archivo."));
        reader.readAsDataURL(file);
      });
    }

    const extension = getFileExtension(file);
    const safeName = file.name.replace(/\.[^/.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48) || "asset";
    const uniqueId = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const sanitizedFolder = sanitizeStorageFolder(folder);
    const optimizedFolder = sanitizedFolder.startsWith("optimized/") ? sanitizedFolder : `optimized/${sanitizedFolder}`;
    const path = `${optimizedFolder}/${uniqueId}-${safeName}.${extension}`;

    const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
      cacheControl: "31536000",
      upsert: false,
      contentType: file.type || undefined,
    });
    if (error) throw error;

    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    pendingUploads.set(data.publicUrl, path);
    return { publicUrl: data.publicUrl, optimization };
  },

  async optimizeExistingAssets(content, onProgress = () => {}) {
    if (!isSupabaseConfigured) throw new Error("La optimización de archivos publicados requiere Supabase.");

    const urls = [...collectAssetUrls(content)].filter((url) => {
      const path = getManagedStoragePath(url);
      return path && !path.startsWith("optimized/");
    });
    const replacements = new Map();
    let originalBytes = 0;
    let outputBytes = 0;

    try {
      for (let index = 0; index < urls.length; index += 1) {
        const url = urls[index];
        const path = getManagedStoragePath(url);
        onProgress({ current: index + 1, total: urls.length, path });

        const response = await fetch(url, { cache: "no-store" });
        if (!response.ok) throw new Error(`No se pudo descargar ${path} para optimizarlo.`);
        const blob = await response.blob();
        const fileName = path.split("/").pop() || `imagen-${index + 1}`;
        const file = new File([blob], fileName, { type: blob.type || "image/jpeg" });
        const { publicUrl, optimization } = await this.uploadAsset(file, "optimized/migrated", { profile: "content" });
        replacements.set(url, publicUrl);
        pendingRemovals.set(url, path);
        originalBytes += optimization.originalSize;
        outputBytes += optimization.outputSize;
      }
    } catch (error) {
      const uploadedUrls = [...replacements.values()];
      const uploadedPaths = uploadedUrls.map((url) => pendingUploads.get(url)).filter(Boolean);
      await removeStoredPaths(uploadedPaths).catch(() => {});
      uploadedUrls.forEach((url) => pendingUploads.delete(url));
      replacements.forEach((_, originalUrl) => pendingRemovals.delete(originalUrl));
      throw error;
    }

    return {
      content: replaceAssetUrls(content, replacements),
      migrated: replacements.size,
      originalBytes,
      outputBytes,
    };
  },

  async commitPendingAssets(content) {
    const referencedUrls = collectAssetUrls(content);
    const orphanPaths = [...pendingUploads].filter(([url]) => !referencedUrls.has(url)).map(([, path]) => path);
    const replacedPaths = [...pendingRemovals].filter(([url]) => !referencedUrls.has(url)).map(([, path]) => path);
    await removeStoredPaths([...new Set([...orphanPaths, ...replacedPaths])]);
    pendingUploads.clear();
    pendingRemovals.clear();
  },

  async discardPendingAssets() {
    const paths = [...pendingUploads.values()];
    await removeStoredPaths(paths);
    pendingUploads.clear();
    pendingRemovals.clear();
  },
};
