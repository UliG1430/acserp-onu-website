import { defaultSiteContent } from "../data/siteContent";
import { getCapturedPasswordRecoverySession, isSupabaseConfigured, supabase } from "../lib/supabaseClient";
import { sanitizeRichHtml, validateSiteContentUrls } from "../utils/contentSecurity";
import { collectAssetUrls, mergeSiteContent, toPublishedSiteContent } from "../utils/siteContent";
import { buildPasswordResetRedirect } from "../utils/authSecurity";

const LOCAL_DRAFT_KEY = "acserp_admin_content";
const LOCAL_PUBLIC_KEY = "acserp_public_content";
const LOCAL_REVISION_KEY = "acserp_admin_content_revision";
const STORAGE_BUCKET = "site-assets";
const MAX_ASSET_UPLOAD_SIZE = 15 * 1024 * 1024;
const allowedImageTypes = new Map([
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
  ["image/svg+xml", "svg"],
]);
const pendingUploads = new Map();

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
  if (file.size > MAX_ASSET_UPLOAD_SIZE) throw new Error("El archivo supera el máximo permitido de 15 MB.");
  if (!allowedImageTypes.has(file.type)) throw new Error("El formato debe ser PNG, JPG, WebP, GIF o SVG.");
  return file.type === "image/svg+xml" ? sanitizeSvg(file) : file;
};

const removeStoredPaths = async (paths) => {
  if (!isSupabaseConfigured || paths.length === 0) return;
  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove(paths);
  if (error) throw error;
};

export const contentService = {
  async getContent() {
    if (!isSupabaseConfigured) {
      const localPublic = readLocalJson(LOCAL_PUBLIC_KEY);
      return mergeSiteContent(defaultSiteContent, localPublic || {});
    }

    const { data, error } = await supabase.from("site_content").select("content").eq("id", "main").single();
    if (error && error.code !== "PGRST116") throw error;
    return mergeSiteContent(defaultSiteContent, data?.content || {});
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

  async uploadAsset(originalFile, folder = "uploads") {
    const file = await validateAsset(originalFile);
    if (!isSupabaseConfigured) {
      if (!isAdminDemoEnabled) throw new Error("Los uploads locales están deshabilitados.");
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("No se pudo leer el archivo."));
        reader.readAsDataURL(file);
      });
    }

    const extension = allowedImageTypes.get(file.type);
    const safeName = file.name.replace(/\.[^/.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48) || "asset";
    const uniqueId = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const path = `${sanitizeStorageFolder(folder)}/${uniqueId}-${safeName}.${extension}`;

    const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
      cacheControl: "31536000",
      upsert: false,
      contentType: file.type,
    });
    if (error) throw error;

    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    pendingUploads.set(data.publicUrl, path);
    return data.publicUrl;
  },

  async commitPendingAssets(content) {
    const referencedUrls = collectAssetUrls(content);
    const orphanPaths = [...pendingUploads].filter(([url]) => !referencedUrls.has(url)).map(([, path]) => path);
    await removeStoredPaths(orphanPaths);
    pendingUploads.clear();
  },

  async discardPendingAssets() {
    const paths = [...pendingUploads.values()];
    await removeStoredPaths(paths);
    pendingUploads.clear();
  },
};
