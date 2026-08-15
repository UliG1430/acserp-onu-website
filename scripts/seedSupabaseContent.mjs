import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { createServer } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const bucket = "site-assets";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const adminEmail = process.env.ACSERP_ADMIN_EMAIL;
const adminPassword = process.env.ACSERP_ADMIN_PASSWORD;

if (!supabaseUrl || !supabaseKey || !adminEmail || !adminPassword) {
  throw new Error("Faltan VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY, ACSERP_ADMIN_EMAIL o ACSERP_ADMIN_PASSWORD.");
}

const mimeByExt = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

const supabase = createClient(supabaseUrl, supabaseKey);

const splitTopicText = (topicText = "") => {
  const [title = "", ...subtitleLines] = String(topicText).split(/\r?\n/);
  return {
    topicTitle: title.trim(),
    topicSubtitle: subtitleLines.join("\n").trim(),
  };
};

const { error: loginError } = await supabase.auth.signInWithPassword({
  email: adminEmail,
  password: adminPassword,
});

if (loginError) throw loginError;

const vite = await createServer({
  root: projectRoot,
  server: { middlewareMode: true },
  appType: "custom",
});

try {
  const { defaultSiteContent } = await vite.ssrLoadModule("/src/data/siteContent.js");
  const { default: newsData } = await vite.ssrLoadModule("/src/assets/noticias/newsData.js");
  const content = structuredClone(defaultSiteContent);

  const uploadAssetPath = async (assetPath, storagePath) => {
    if (!assetPath?.startsWith("/src/")) return assetPath;

    const absolutePath = path.join(projectRoot, assetPath.slice(1));
    const ext = path.extname(absolutePath).toLowerCase();
    const bytes = await readFile(absolutePath);

    const { error } = await supabase.storage
      .from(bucket)
      .upload(storagePath, bytes, {
        cacheControl: "31536000",
        contentType: mimeByExt[ext] || "application/octet-stream",
        upsert: true,
      });

    if (error) throw error;

    const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);
    return data.publicUrl;
  };

  content.organs = await Promise.all(content.organs.map(async (organ) => {
    const basePath = `organs/${organ.id.toLowerCase()}`;
    const logoExt = path.extname(organ.logoUrl || ".png") || ".png";
    const blankExt = path.extname(organ.blankLogoUrl || ".png") || ".png";
    const splitTopic = splitTopicText(organ.topicText || "");

    return {
      ...organ,
      topicTitle: organ.topicTitle ?? splitTopic.topicTitle,
      topicSubtitle: organ.topicSubtitle ?? splitTopic.topicSubtitle,
      logoUrl: await uploadAssetPath(organ.logoUrl, `${basePath}/logo${logoExt}`),
      blankLogoUrl: await uploadAssetPath(organ.blankLogoUrl, `${basePath}/blank-logo${blankExt}`),
    };
  }));

  content.photos.carouselSections = await Promise.all(content.photos.carouselSections.map(async (section) => {
    const images = await Promise.all((section.images || []).map(async (image, index) => {
      const imageExt = path.extname(image.src || ".webp") || ".webp";
      return {
        ...image,
        src: await uploadAssetPath(image.src, `photos/carousel/${section.id}/image-${index + 1}${imageExt}`),
      };
    }));

    return { ...section, images };
  }));

  content.adminNews = await Promise.all(newsData.map(async (newsItem) => {
    const basePath = `news/${newsItem.id}`;
    const imgExt = path.extname(newsItem.img || ".webp") || ".webp";
    const additionalImages = await Promise.all((newsItem.additionalImages || []).map(async (image, index) => {
      const imageExt = path.extname(image.url || ".webp") || ".webp";
      return {
        ...image,
        url: await uploadAssetPath(image.url, `${basePath}/additional-${index + 1}${imageExt}`),
      };
    }));

    return {
      ...newsItem,
      hidden: false,
      img: await uploadAssetPath(newsItem.img, `${basePath}/cover${imgExt}`),
      carouselImg: await uploadAssetPath(newsItem.carouselImg, `${basePath}/carousel${path.extname(newsItem.carouselImg || ".webp") || ".webp"}`),
      additionalImages,
    };
  }));

  const { error: saveError } = await supabase
    .from("site_content")
    .upsert({
      id: "main",
      content,
      updated_at: new Date().toISOString(),
    });

  if (saveError) throw saveError;

  console.log(`Contenido migrado a Supabase con ${content.organs.length} órganos, ${content.adminNews.length} noticias y ${content.photos.driveFolders.length} carpetas de fotos.`);
} finally {
  await vite.close();
}
