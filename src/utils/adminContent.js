import parseDate from "./parseDate";
import { normalizeYouTubeId } from "./contentSecurity";

export const MAX_ASSET_UPLOAD_SIZE = 15 * 1024 * 1024;
export const formatFileSize = (bytes) => `${Math.round((bytes / 1024 / 1024) * 10) / 10} MB`;
export const splitLines = (value) => value.split("\n").map((item) => item.trim()).filter(Boolean);

export const reorderItems = (items, fromIndex, toIndex) => {
  if (fromIndex === null || fromIndex === toIndex || toIndex < 0 || toIndex > items.length) return items;
  const reordered = [...items];
  const [movedItem] = reordered.splice(fromIndex, 1);
  reordered.splice(fromIndex < toIndex ? toIndex - 1 : toIndex, 0, movedItem);
  return reordered;
};

export const readDraggedIndex = (event, fallbackIndex) => {
  const index = Number(event.dataTransfer.getData("text/plain"));
  return Number.isNaN(index) ? fallbackIndex : index;
};

export const getVerticalDropIndex = (event, index) => {
  const rect = event.currentTarget.getBoundingClientRect();
  return index + (event.clientY > rect.top + rect.height / 2 ? 1 : 0);
};

export const formatAdminDate = (value) => {
  if (!value) return "";
  return new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
};

export const normalizeHex = (value) => {
  const cleanValue = value.trim().replace(/^#/, "");
  return /^[0-9a-fA-F]{6}$/.test(cleanValue) ? `#${cleanValue.toUpperCase()}` : "";
};

export const hexToRgb = (hex) => {
  const normalized = normalizeHex(hex) || "#3B82F6";
  return {
    r: parseInt(normalized.slice(1, 3), 16),
    g: parseInt(normalized.slice(3, 5), 16),
    b: parseInt(normalized.slice(5, 7), 16),
  };
};

export const rgbToHex = ({ r, g, b }) => {
  const toHex = (value) => Math.max(0, Math.min(255, Number(value) || 0)).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
};

export const createEmptyNewsForm = () => ({
  title: "",
  summary: "",
  content: "",
  date: new Date().toISOString().slice(0, 10),
  img: "",
  headerImg: "",
  headerImgDescription: "",
  carouselImg: "",
  additionalImages: [],
  videoUrl: "",
  youtubeId: "",
  hidden: false,
});

export const extractImagePalette = (file) => new Promise((resolve) => {
  const reader = new FileReader();
  reader.onload = () => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 96;
      canvas.height = 96;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) return resolve([]);
      context.drawImage(image, 0, 0, 96, 96);
      const { data } = context.getImageData(0, 0, 96, 96);
      const counts = new Map();

      for (let index = 0; index < data.length; index += 16) {
        const [r, g, b, a] = data.slice(index, index + 4);
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        if (a < 128 || (max > 245 && min > 235) || (max < 35 && min < 35) || max - min < 18) continue;
        const hex = rgbToHex({ r: Math.round(r / 16) * 16, g: Math.round(g / 16) * 16, b: Math.round(b / 16) * 16 });
        counts.set(hex, (counts.get(hex) || 0) + 1);
      }
      resolve([...counts.entries()].sort((a, b) => b[1] - a[1]).map(([hex]) => hex).slice(0, 6));
    };
    image.onerror = () => resolve([]);
    image.src = reader.result;
  };
  reader.onerror = () => resolve([]);
  reader.readAsDataURL(file);
});

export const sortNewsByDateDesc = (items) => [...items].sort((a, b) => parseDate(b.date) - parseDate(a.date));

export const extractYouTubeId = (value = "") => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^?&/]+)/);
  return normalizeYouTubeId(match?.[1] || trimmed);
};

export const prepareAdminDraft = (content) => ({
  ...content,
  organs: content.organs.map((organ) => ({ hidden: false, ...organ, suggestedColors: organ.suggestedColors || [organ.color || "#3B82F6"] })),
  adminNews: content.adminNews.map((news) => ({ hidden: false, ...news })),
  photos: {
    ...content.photos,
    popup: { enabled: true, ...content.photos.popup },
    carouselSections: (content.photos.carouselSections || []).map((section) => ({ hidden: false, ...section })),
    driveFolders: (content.photos.driveFolders || []).map((folder) => ({ hidden: false, ...folder })),
  },
  donations: {
    ...content.donations,
    popup: { enabled: true, ...content.donations.popup },
    allocationItems: (content.donations.allocationItems || []).map((item) => ({ hidden: false, ...item })),
    faqs: (content.donations.faqs || []).map((faq) => ({ hidden: false, ...faq })),
  },
});

export const formatAssetName = (value = "") => {
  if (!value) return "";
  if (value.startsWith("data:")) return "Archivo local cargado";
  try {
    const pathname = new URL(value, "https://acserp.local").pathname;
    return decodeURIComponent(pathname.split("/").filter(Boolean).pop() || value);
  } catch {
    return value.split("/").filter(Boolean).pop() || value;
  }
};
