import { defaultSiteContent } from "../data/siteContent";
import { isSupabaseConfigured, supabase } from "../lib/supabaseClient";

const LOCAL_STORAGE_KEY = "acserp_admin_content";
const STORAGE_BUCKET = "site-assets";

const mergeContent = (base, overrides = {}) => {
  const photos = overrides.photos || {};

  return {
    ...base,
    ...overrides,
    stats: overrides.stats || base.stats,
    links: { ...base.links, ...overrides.links },
    photos: {
      ...base.photos,
      ...photos,
      popup: { ...base.photos.popup, ...photos.popup },
      carouselSections: Array.isArray(photos.carouselSections)
        ? photos.carouselSections
        : base.photos.carouselSections,
      driveFolders: Array.isArray(photos.driveFolders)
        ? photos.driveFolders
        : base.photos.driveFolders,
    },
    modelPage: { ...base.modelPage, ...overrides.modelPage },
    donations: {
      ...base.donations,
      ...overrides.donations,
      popup: { ...base.donations.popup, ...overrides.donations?.popup },
      allocationItems: Array.isArray(overrides.donations?.allocationItems)
        ? overrides.donations.allocationItems
        : base.donations.allocationItems,
      faqs: Array.isArray(overrides.donations?.faqs) ? overrides.donations.faqs : base.donations.faqs,
    },
    organs: Array.isArray(overrides.organs) ? overrides.organs : base.organs,
    socialPosts: { ...base.socialPosts, ...overrides.socialPosts },
    adminNews: overrides.adminNews || base.adminNews,
  };
};

const readLocalContent = () => {
  try {
    const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? mergeContent(defaultSiteContent, JSON.parse(stored)) : defaultSiteContent;
  } catch {
    return defaultSiteContent;
  }
};

const writeLocalContent = (content) => {
  window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(content));
  return content;
};

export const contentService = {
  async getContent() {
    if (!isSupabaseConfigured) return readLocalContent();

    const { data, error } = await supabase
      .from("site_content")
      .select("content")
      .eq("id", "main")
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return mergeContent(defaultSiteContent, data?.content || {});
  },

  async saveContent(content) {
    if (!isSupabaseConfigured) return writeLocalContent(content);

    const { error } = await supabase
      .from("site_content")
      .upsert({ id: "main", content, updated_at: new Date().toISOString() });

    if (error) throw error;
    return content;
  },

  async signIn(email, password) {
    if (!isSupabaseConfigured) {
      window.localStorage.setItem("acserp_demo_admin", email || "demo@admin.local");
      return { user: { email: email || "demo@admin.local" } };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
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
      const email = window.localStorage.getItem("acserp_demo_admin");
      return email ? { user: { email } } : null;
    }
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  async uploadAsset(file, folder = "uploads") {
    if (!isSupabaseConfigured) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("No se pudo leer el archivo."));
        reader.readAsDataURL(file);
      });
    }

    const extension = file.name.split(".").pop() || "bin";
    const safeName = file.name
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "asset";
    const path = `${folder}/${Date.now()}-${safeName}.${extension}`;

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, file, {
        cacheControl: "31536000",
        upsert: true,
        contentType: file.type || undefined,
      });

    if (error) throw error;

    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    return data.publicUrl;
  },
};
