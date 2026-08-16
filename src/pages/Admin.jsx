import React, { useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured } from "../lib/supabaseClient";
import { contentService } from "../services/contentService";
import { useSiteContent } from "../context/SiteContentContext";
import parseDate from "../utils/parseDate";

const tabs = [
  { id: "news", label: "Noticias" },
  { id: "stats", label: "Datos" },
  { id: "organs", label: "Órganos" },
  { id: "resources", label: "Recursos" },
  { id: "photos", label: "Fotos" },
  { id: "donations", label: "Donar" },
  { id: "social", label: "Redes" },
];

const formatAdminDate = (value) => {
  if (!value) return "";
  const date = new Date(`${value}T12:00:00`);
  return new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const splitLines = (value) => value.split("\n").map((item) => item.trim()).filter(Boolean);

const normalizeHex = (value) => {
  const cleanValue = value.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{6}$/.test(cleanValue)) return "";
  return `#${cleanValue.toUpperCase()}`;
};

const hexToRgb = (hex) => {
  const normalized = normalizeHex(hex) || "#3B82F6";
  return {
    r: parseInt(normalized.slice(1, 3), 16),
    g: parseInt(normalized.slice(3, 5), 16),
    b: parseInt(normalized.slice(5, 7), 16),
  };
};

const rgbToHex = ({ r, g, b }) => {
  const toHex = (value) => Math.max(0, Math.min(255, Number(value) || 0)).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
};

const extractImagePalette = (file) => new Promise((resolve) => {
  const reader = new FileReader();
  reader.onload = () => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const size = 96;
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      context.drawImage(image, 0, 0, size, size);
      const { data } = context.getImageData(0, 0, size, size);
      const counts = new Map();

      for (let index = 0; index < data.length; index += 16) {
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        const a = data[index + 3];
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);

        if (a < 128 || (max > 245 && min > 235) || (max < 35 && min < 35) || max - min < 18) continue;

        const hex = rgbToHex({
          r: Math.round(r / 16) * 16,
          g: Math.round(g / 16) * 16,
          b: Math.round(b / 16) * 16,
        });
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

const sortNewsByDateDesc = (items) => [...items].sort((a, b) => parseDate(b.date) - parseDate(a.date));

const extractYouTubeId = (value = "") => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const patterns = [
    /youtu\.be\/([^?&/]+)/,
    /youtube\.com\/watch\?v=([^?&/]+)/,
    /youtube\.com\/embed\/([^?&/]+)/,
    /youtube\.com\/shorts\/([^?&/]+)/,
  ];
  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match) return match[1];
  }
  return trimmed;
};

const Admin = () => {
  const { content, saveContent, refreshContent } = useSiteContent();
  const [activeTab, setActiveTab] = useState("news");
  const [draft, setDraft] = useState(content);
  const [session, setSession] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [newsForm, setNewsForm] = useState({
    title: "",
    summary: "",
    content: "",
    date: new Date().toISOString().slice(0, 10),
    img: "",
  });
  const [status, setStatus] = useState("");
  const [uploadingAsset, setUploadingAsset] = useState("");
  const [colorModes, setColorModes] = useState({});
  const [collapsedOrgans, setCollapsedOrgans] = useState({});
  const [isModelHeaderCollapsed, setIsModelHeaderCollapsed] = useState(false);
  const [draggedOrganIndex, setDraggedOrganIndex] = useState(null);
  const [dropIndicatorIndex, setDropIndicatorIndex] = useState(null);
  const [collapsedPhotoGroups, setCollapsedPhotoGroups] = useState({});
  const [collapsedCarouselSections, setCollapsedCarouselSections] = useState({});
  const [draggedCarouselSectionIndex, setDraggedCarouselSectionIndex] = useState(null);
  const [carouselSectionDropIndex, setCarouselSectionDropIndex] = useState(null);
  const [collapsedDriveFolders, setCollapsedDriveFolders] = useState({});
  const [draggedPhotoFolderIndex, setDraggedPhotoFolderIndex] = useState(null);
  const [photoFolderDropIndex, setPhotoFolderDropIndex] = useState(null);
  const [draggedResourceIndex, setDraggedResourceIndex] = useState(null);
  const [resourceDropIndex, setResourceDropIndex] = useState(null);
  const [collapsedResources, setCollapsedResources] = useState({});
  const [collapsedDonationGroups, setCollapsedDonationGroups] = useState({});
  const [collapsedDonationFaqs, setCollapsedDonationFaqs] = useState({});
  const [collapsedDonationItems, setCollapsedDonationItems] = useState({});

  useEffect(() => {
    setDraft({
      ...content,
      organs: content.organs.map((organ) => ({
        hidden: false,
        ...organ,
        suggestedColors: organ.suggestedColors || [organ.color || "#3B82F6"],
      })),
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
  }, [content]);

  useEffect(() => {
    contentService.getSession().then(setSession).catch(() => setSession(null));
  }, []);

  const socialText = useMemo(() => ({
    instagram: draft.socialPosts.instagram.join("\n"),
    tiktok: draft.socialPosts.tiktok.join("\n"),
    youtube: draft.socialPosts.youtube.map((video) => video.url || `https://www.youtube.com/watch?v=${video.id}`).join("\n"),
    linkedin: draft.socialPosts.linkedin.map((post) => post.postUrl || post.embedUrl).join("\n"),
  }), [draft.socialPosts]);

  const updateDraft = (updater) => {
    setDraft((current) => {
      const next = typeof updater === "function" ? updater(current) : updater;
      return next;
    });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setStatus("");
    try {
      const data = await contentService.signIn(loginForm.email, loginForm.password);
      setSession(data.session || data);
      setStatus(isSupabaseConfigured ? "Sesión iniciada." : "Modo demo local activo.");
    } catch (error) {
      setStatus(error.message || "No se pudo iniciar sesión.");
    }
  };

  const handleSave = async () => {
    setStatus("Guardando...");
    try {
      await saveContent(draft);
      setStatus(isSupabaseConfigured ? "Cambios guardados en Supabase." : "Cambios guardados localmente.");
    } catch (error) {
      setStatus(error.message || "No se pudieron guardar los cambios.");
    }
  };

  const handleLogout = async () => {
    await contentService.signOut();
    setSession(null);
  };

  const handleDiscardChanges = async () => {
    const confirmed = window.confirm("¿Descartar los cambios no guardados y volver al contenido publicado actualmente?");
    if (!confirmed) return;

    setStatus("Descartando cambios...");
    await refreshContent();
    setStatus("Cambios no guardados descartados.");
  };

  const handleLogoFile = async (event, organIndex, field) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingAsset(`${field}-${organIndex}`);
    setStatus("Subiendo imagen...");
    try {
      const publicUrl = await contentService.uploadAsset(file, `organs/${draft.organs[organIndex]?.id || "organ"}`);
      const palette = field === "logoUrl" ? await extractImagePalette(file) : [];
      updateDraft((current) => ({
        ...current,
        organs: current.organs.map((organ, index) =>
          index === organIndex
            ? {
                ...organ,
                [field]: publicUrl,
                suggestedColors: palette.length > 0 ? palette : organ.suggestedColors,
                color: field === "logoUrl" && palette[0] ? palette[0] : organ.color,
              }
            : organ
        ),
      }));
      setStatus("Imagen subida. Guardá los cambios para publicarla.");
    } catch (error) {
      setStatus(error.message || "No se pudo subir la imagen.");
    } finally {
      setUploadingAsset("");
      event.target.value = "";
    }
  };

  const handleNewsImageFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingAsset("news-image");
    setStatus("Subiendo imagen de noticia...");
    try {
      const publicUrl = await contentService.uploadAsset(file, "news");
      setNewsForm((current) => ({ ...current, img: publicUrl }));
      setStatus("Imagen de noticia subida.");
    } catch (error) {
      setStatus(error.message || "No se pudo subir la imagen de noticia.");
    } finally {
      setUploadingAsset("");
      event.target.value = "";
    }
  };

  const updateOrgan = (index, field, value) => {
    updateDraft((current) => ({
      ...current,
      organs: current.organs.map((organ, organIndex) =>
        organIndex === index ? { ...organ, [field]: value } : organ
      ),
    }));
  };

  const toggleOrganCollapsed = (organId) => {
    setCollapsedOrgans((current) => ({ ...current, [organId]: !current[organId] }));
  };

  const setAllOrgansCollapsed = (collapsed) => {
    setCollapsedOrgans(Object.fromEntries(draft.organs.map((organ) => [organ.id, collapsed])));
  };

  const moveOrgan = (fromIndex, toIndex) => {
    if (fromIndex === null || fromIndex === toIndex || toIndex < 0 || toIndex > draft.organs.length) return;

    updateDraft((current) => {
      const organs = [...current.organs];
      const [movedOrgan] = organs.splice(fromIndex, 1);
      const adjustedToIndex = fromIndex < toIndex ? toIndex - 1 : toIndex;
      organs.splice(adjustedToIndex, 0, movedOrgan);
      return { ...current, organs };
    });
    setDraggedOrganIndex(null);
    setDropIndicatorIndex(null);
  };

  const getDraggedIndex = (event) => {
    const fromIndex = Number(event.dataTransfer.getData("text/plain"));
    return Number.isNaN(fromIndex) ? draggedOrganIndex : fromIndex;
  };

  const handleOrganDrop = (event, toIndex) => {
    event.preventDefault();
    event.stopPropagation();
    moveOrgan(getDraggedIndex(event), toIndex);
  };

  const updateDropIndicator = (event, index) => {
    if (draggedOrganIndex === null) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const isAfter = event.clientY > rect.top + rect.height / 2;
    setDropIndicatorIndex(index + (isAfter ? 1 : 0));
  };

  const deleteOrgan = (index) => {
    const organ = draft.organs[index];
    const confirmed = window.confirm(`¿Eliminar el órgano "${organ.name}"? Esta acción se aplicará cuando guardes los cambios.`);
    if (!confirmed) return;

    updateDraft((current) => ({
      ...current,
      organs: current.organs.filter((_, organIndex) => organIndex !== index),
    }));
  };

  const deleteNews = (newsItem) => {
    const confirmed = window.confirm(`¿Eliminar la noticia "${newsItem.title}"? Esta acción se aplicará cuando guardes los cambios.`);
    if (!confirmed) return;

    updateDraft((current) => ({
      ...current,
      adminNews: current.adminNews.filter((news) => news.id !== newsItem.id),
    }));
  };

  const togglePhotoGroupCollapsed = (groupId) => {
    setCollapsedPhotoGroups((current) => ({ ...current, [groupId]: !current[groupId] }));
  };

  const updatePhotoPopup = (field, value) => {
    updateDraft((current) => ({
      ...current,
      photos: {
        ...current.photos,
        popup: { ...current.photos.popup, [field]: value },
      },
    }));
  };

  const updateCarouselSection = (index, field, value) => {
    updateDraft((current) => ({
      ...current,
      photos: {
        ...current.photos,
        carouselSections: current.photos.carouselSections.map((section, sectionIndex) =>
          sectionIndex === index ? { ...section, [field]: value } : section
        ),
      },
    }));
  };

  const addCarouselSection = () => {
    const id = `carousel-${Date.now()}`;
    updateDraft((current) => ({
      ...current,
      photos: {
        ...current.photos,
        carouselSections: [
          ...current.photos.carouselSections,
          {
            id,
            title: "Nueva sección",
            subtitle: "Descripción de la sección.",
            folderUrl: "",
            hidden: false,
            images: [],
          },
        ],
      },
    }));
    setStatus("Sección de carousel agregada al borrador.");
  };

  const deleteCarouselSection = (index) => {
    const section = draft.photos.carouselSections[index];
    const confirmed = window.confirm(`¿Eliminar la sección "${section.title}"? Esta acción se aplicará cuando guardes los cambios.`);
    if (!confirmed) return;

    updateDraft((current) => ({
      ...current,
      photos: {
        ...current.photos,
        carouselSections: current.photos.carouselSections.filter((_, sectionIndex) => sectionIndex !== index),
      },
    }));
  };

  const moveCarouselSection = (fromIndex, toIndex) => {
    if (fromIndex === null || fromIndex === toIndex || toIndex < 0 || toIndex > draft.photos.carouselSections.length) return;

    updateDraft((current) => {
      const carouselSections = [...current.photos.carouselSections];
      const [movedSection] = carouselSections.splice(fromIndex, 1);
      const adjustedToIndex = fromIndex < toIndex ? toIndex - 1 : toIndex;
      carouselSections.splice(adjustedToIndex, 0, movedSection);
      return { ...current, photos: { ...current.photos, carouselSections } };
    });
    setDraggedCarouselSectionIndex(null);
    setCarouselSectionDropIndex(null);
  };

  const getDraggedCarouselSectionIndex = (event) => {
    const fromIndex = Number(event.dataTransfer.getData("text/plain"));
    return Number.isNaN(fromIndex) ? draggedCarouselSectionIndex : fromIndex;
  };

  const handleCarouselSectionDrop = (event, toIndex) => {
    event.preventDefault();
    event.stopPropagation();
    moveCarouselSection(getDraggedCarouselSectionIndex(event), toIndex);
  };

  const updateCarouselSectionDropIndicator = (event, index) => {
    if (draggedCarouselSectionIndex === null) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const isAfter = event.clientY > rect.top + rect.height / 2;
    setCarouselSectionDropIndex(index + (isAfter ? 1 : 0));
  };

  const updateDriveFolder = (index, field, value) => {
    updateDraft((current) => ({
      ...current,
      photos: {
        ...current.photos,
        driveFolders: current.photos.driveFolders.map((folder, folderIndex) =>
          folderIndex === index ? { ...folder, [field]: value } : folder
        ),
      },
    }));
  };

  const addDriveFolder = () => {
    const id = `drive-folder-${Date.now()}`;
    updateDraft((current) => ({
      ...current,
      photos: {
        ...current.photos,
        driveFolders: [
          ...current.photos.driveFolders,
          {
            id,
            title: "Nueva carpeta",
            previewUrl: "",
            folderUrl: "",
            hidden: false,
          },
        ],
      },
    }));
    setStatus("Carpeta de fotos agregada al borrador.");
  };

  const deleteDriveFolder = (index) => {
    const folder = draft.photos.driveFolders[index];
    const confirmed = window.confirm(`¿Eliminar la carpeta "${folder.title}"? Esta acción se aplicará cuando guardes los cambios.`);
    if (!confirmed) return;

    updateDraft((current) => ({
      ...current,
      photos: {
        ...current.photos,
        driveFolders: current.photos.driveFolders.filter((_, folderIndex) => folderIndex !== index),
      },
    }));
  };

  const moveDriveFolder = (fromIndex, toIndex) => {
    if (fromIndex === null || fromIndex === toIndex || toIndex < 0 || toIndex > draft.photos.driveFolders.length) return;

    updateDraft((current) => {
      const driveFolders = [...current.photos.driveFolders];
      const [movedFolder] = driveFolders.splice(fromIndex, 1);
      const adjustedToIndex = fromIndex < toIndex ? toIndex - 1 : toIndex;
      driveFolders.splice(adjustedToIndex, 0, movedFolder);
      return { ...current, photos: { ...current.photos, driveFolders } };
    });
    setDraggedPhotoFolderIndex(null);
    setPhotoFolderDropIndex(null);
  };

  const getDraggedPhotoFolderIndex = (event) => {
    const fromIndex = Number(event.dataTransfer.getData("text/plain"));
    return Number.isNaN(fromIndex) ? draggedPhotoFolderIndex : fromIndex;
  };

  const handlePhotoFolderDrop = (event, toIndex) => {
    event.preventDefault();
    event.stopPropagation();
    moveDriveFolder(getDraggedPhotoFolderIndex(event), toIndex);
  };

  const updatePhotoFolderDropIndicator = (event, index) => {
    if (draggedPhotoFolderIndex === null) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const isAfter = event.clientY > rect.top + rect.height / 2;
    setPhotoFolderDropIndex(index + (isAfter ? 1 : 0));
  };

  const updateResource = (index, field, value) => {
    updateDraft((current) => ({
      ...current,
      links: {
        ...current.links,
        additionalResources: current.links.additionalResources.map((resource, resourceIndex) =>
          resourceIndex === index ? { ...resource, [field]: value } : resource
        ),
      },
    }));
  };

  const addResource = () => {
    const id = `resource-${Date.now()}`;
    updateDraft((current) => ({
      ...current,
      links: {
        ...current.links,
        additionalResources: [
          ...current.links.additionalResources,
          { id, title: "", description: "", buttonText: "Abrir recurso", url: "", hidden: false },
        ],
      },
    }));
  };

  const deleteResource = (index) => {
    const resource = draft.links.additionalResources[index];
    const confirmed = window.confirm(`¿Eliminar el recurso "${resource.title || "sin título"}"? Esta acción se aplicará cuando guardes los cambios.`);
    if (!confirmed) return;

    updateDraft((current) => ({
      ...current,
      links: {
        ...current.links,
        additionalResources: current.links.additionalResources.filter((_, resourceIndex) => resourceIndex !== index),
      },
    }));
  };

  const moveResource = (fromIndex, toIndex) => {
    if (fromIndex === null || fromIndex === toIndex || toIndex < 0 || toIndex > draft.links.additionalResources.length) return;

    updateDraft((current) => {
      const additionalResources = [...current.links.additionalResources];
      const [movedResource] = additionalResources.splice(fromIndex, 1);
      const adjustedToIndex = fromIndex < toIndex ? toIndex - 1 : toIndex;
      additionalResources.splice(adjustedToIndex, 0, movedResource);
      return { ...current, links: { ...current.links, additionalResources } };
    });
    setDraggedResourceIndex(null);
    setResourceDropIndex(null);
  };

  const getDraggedResourceIndex = (event) => {
    const fromIndex = Number(event.dataTransfer.getData("text/plain"));
    return Number.isNaN(fromIndex) ? draggedResourceIndex : fromIndex;
  };

  const handleResourceDrop = (event, toIndex) => {
    event.preventDefault();
    event.stopPropagation();
    moveResource(getDraggedResourceIndex(event), toIndex);
  };

  const updateResourceDropIndicator = (event, index) => {
    if (draggedResourceIndex === null) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const isAfter = event.clientY > rect.top + rect.height / 2;
    setResourceDropIndex(index + (isAfter ? 1 : 0));
  };

  const updateDonation = (field, value) => {
    updateDraft((current) => ({
      ...current,
      donations: { ...current.donations, [field]: value },
    }));
  };

  const updateDonationPopup = (field, value) => {
    updateDraft((current) => ({
      ...current,
      donations: {
        ...current.donations,
        popup: { ...current.donations.popup, [field]: value },
      },
    }));
  };

  const updateDonationAllocationItem = (index, field, value) => {
    updateDraft((current) => ({
      ...current,
      donations: {
        ...current.donations,
        allocationItems: current.donations.allocationItems.map((item, itemIndex) =>
          itemIndex === index ? { ...item, [field]: value } : item
        ),
      },
    }));
  };

  const addDonationAllocationItem = () => {
    const id = `allocation-${Date.now()}`;
    updateDraft((current) => ({
      ...current,
      donations: {
        ...current.donations,
        allocationItems: [
          ...current.donations.allocationItems,
          { id, title: "Nuevo destino", text: "Descripción del destino.", hidden: false },
        ],
      },
    }));
  };

  const deleteDonationAllocationItem = (index) => {
    const item = draft.donations.allocationItems[index];
    const confirmed = window.confirm(`¿Eliminar el destino "${item.title}"? Esta acción se aplicará cuando guardes los cambios.`);
    if (!confirmed) return;

    updateDraft((current) => ({
      ...current,
      donations: {
        ...current.donations,
        allocationItems: current.donations.allocationItems.filter((_, itemIndex) => itemIndex !== index),
      },
    }));
  };

  const updateDonationFaq = (index, field, value) => {
    updateDraft((current) => ({
      ...current,
      donations: {
        ...current.donations,
        faqs: current.donations.faqs.map((faq, faqIndex) =>
          faqIndex === index ? { ...faq, [field]: value } : faq
        ),
      },
    }));
  };

  const addDonationFaq = () => {
    const id = `faq-${Date.now()}`;
    updateDraft((current) => ({
      ...current,
      donations: {
        ...current.donations,
        faqs: [
          ...current.donations.faqs,
          { id, question: "Nueva pregunta", answer: "Respuesta.", hidden: false },
        ],
      },
    }));
  };

  const deleteDonationFaq = (index) => {
    const faq = draft.donations.faqs[index];
    const confirmed = window.confirm(`¿Eliminar la pregunta "${faq.question}"? Esta acción se aplicará cuando guardes los cambios.`);
    if (!confirmed) return;

    updateDraft((current) => ({
      ...current,
      donations: {
        ...current.donations,
        faqs: current.donations.faqs.filter((_, faqIndex) => faqIndex !== index),
      },
    }));
  };

  const addOrgan = () => {
    const id = `ORG-${Date.now()}`;
    updateDraft((current) => ({
      ...current,
      organs: [
        ...current.organs,
        {
          id,
          bodyId: Date.now(),
          name: "Nuevo órgano",
          shortName: "Nuevo órgano",
          description: "Descripción del órgano.",
          logoUrl: "",
          blankLogoUrl: "",
          color: "#3B82F6",
          suggestedColors: ["#3B82F6", "#2563EB", "#1D4ED8", "#60A5FA"],
          topicTitle: "Título del tópico.",
          topicSubtitle: "Subtítulo del tópico.",
          topicText: "Título del tópico.\nSubtítulo del tópico.",
          topicLink: "#",
          hidden: false,
        },
      ],
    }));
    setStatus("Órgano agregado al borrador. Editalo y guardá los cambios.");
  };

  const addNews = () => {
    if (!newsForm.title || !newsForm.summary || !newsForm.content || !newsForm.img) {
      setStatus("Completá título, bajada, contenido e imagen.");
      return;
    }

    const nextNews = {
      id: `admin-${Date.now()}`,
      title: newsForm.title,
      summary: newsForm.summary,
      content: newsForm.content,
      date: formatAdminDate(newsForm.date),
      img: newsForm.img,
      hidden: false,
    };

    updateDraft((current) => ({
      ...current,
      adminNews: [nextNews, ...current.adminNews],
    }));

    setNewsForm({
      title: "",
      summary: "",
      content: "",
      date: new Date().toISOString().slice(0, 10),
      img: "",
    });
    setStatus("Noticia agregada al borrador. Guardá para publicarla.");
  };

  if (!session) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-16">
        <section className="mx-auto max-w-md rounded-lg bg-white p-8 shadow">
          <h1 className="mb-2 text-3xl font-bold text-blue-950">Admin ACSERP</h1>
          <p className="mb-6 text-sm text-gray-600">
            {isSupabaseConfigured
              ? "Ingresá con un usuario administrador de Supabase."
              : "Modo demo local: ingresá cualquier email para probar el panel."}
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              value={loginForm.email}
              onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="admin@acserp.org.ar"
              required
            />
            <input
              type="password"
              value={loginForm.password}
              onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder={isSupabaseConfigured ? "Contraseña" : "Opcional en demo"}
              required={isSupabaseConfigured}
            />
            <button className="w-full rounded-md bg-blue-950 px-4 py-2 font-semibold text-white">
              Entrar
            </button>
          </form>
          {status && <p className="mt-4 text-sm text-blue-900">{status}</p>}
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 rounded-lg bg-white p-5 shadow md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-950">Panel admin</h1>
            <p className="text-sm text-gray-600">
              {isSupabaseConfigured ? "Conectado a Supabase." : "Modo demo local. Nada se sube a internet."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={handleSave} className="rounded-md bg-blue-950 px-4 py-2 font-semibold text-white">
              Guardar cambios
            </button>
            <button onClick={handleDiscardChanges} className="rounded-md border border-gray-300 px-4 py-2 text-gray-700">
              Descartar cambios
            </button>
            <button onClick={handleLogout} className="rounded-md border border-gray-300 px-4 py-2 text-gray-700">
              Salir
            </button>
          </div>
        </div>

        {status && <p className="mb-4 rounded-md bg-blue-50 px-4 py-3 text-sm text-blue-950">{status}</p>}

        <div className="mb-6 flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-md px-4 py-2 text-sm font-semibold ${
                activeTab === tab.id ? "bg-blue-950 text-white" : "bg-white text-blue-950"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <section className="rounded-lg bg-white p-6 shadow">
          {activeTab === "stats" && (
            <div className="grid gap-4 md:grid-cols-2">
              {draft.stats.map((stat, index) => (
                <label key={stat.id} className="block">
                  <span className="text-sm font-semibold text-gray-700">{stat.label}</span>
                  <input
                    type="number"
                    value={stat.value}
                    onChange={(event) => updateDraft((current) => {
                      const stats = [...current.stats];
                      stats[index] = { ...stats[index], value: Number(event.target.value) };
                      return { ...current, stats };
                    })}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </label>
              ))}
            </div>
          )}

          {activeTab === "resources" && (
            <div className="grid gap-6">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  ["joinForm", "Formulario Sumate"],
                  ["resourcesDrive", "Drive general de recursos"],
                ].map(([key, label]) => (
                  <label key={key} className="block">
                    <span className="text-sm font-semibold text-gray-700">{label}</span>
                    <input
                      value={draft.links[key]}
                      onChange={(event) => updateDraft((current) => ({
                        ...current,
                        links: { ...current.links, [key]: event.target.value },
                      }))}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </label>
                ))}
              </div>

              <article className="rounded-lg border border-gray-200 p-4">
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-blue-950">Recursos adicionales</h2>
                    <p className="text-sm text-gray-600">Cards adicionales de la página Recursos.</p>
                  </div>
                  <button type="button" onClick={addResource} className="w-fit rounded-md bg-blue-950 px-3 py-1 text-sm font-semibold text-white">
                    Agregar recurso
                  </button>
                </div>
                <div className="grid gap-3">
                  {draft.links.additionalResources.map((resource, index) => (
                    <React.Fragment key={resource.id || index}>
                      {resourceDropIndex === index && draggedResourceIndex !== null && draggedResourceIndex !== index && (
                        <div className="relative -my-3 h-6" onDragOver={(event) => { event.preventDefault(); event.stopPropagation(); setResourceDropIndex(index); }} onDrop={(event) => handleResourceDrop(event, index)}>
                          <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.16)] transition-all" />
                        </div>
                      )}
                      <article
                        onDragOver={(event) => {
                          event.preventDefault();
                          event.dataTransfer.dropEffect = "move";
                          updateResourceDropIndicator(event, index);
                        }}
                        onDrop={(event) => handleResourceDrop(event, resourceDropIndex ?? index)}
                        className={`rounded-md border p-4 transition ${draggedResourceIndex === index ? "scale-[0.99] border-blue-300 bg-blue-50 opacity-70" : resource.hidden ? "border-amber-200 bg-amber-50" : "border-gray-200"}`}
                      >
                        <div className="mb-3 flex flex-wrap justify-between gap-2">
                          <div
                            draggable
                            onDragStart={(event) => {
                              setDraggedResourceIndex(index);
                              event.dataTransfer.effectAllowed = "move";
                              event.dataTransfer.setData("text/plain", String(index));
                            }}
                            onDragEnd={() => setDraggedResourceIndex(null)}
                            onDragEndCapture={() => setResourceDropIndex(null)}
                            className="flex h-10 w-10 cursor-grab items-center justify-center rounded-md border border-gray-300 bg-white text-lg font-bold text-gray-500 active:cursor-grabbing"
                            title="Arrastrar para ordenar"
                            aria-label="Arrastrar para ordenar"
                          >
                            ≡
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button type="button" onClick={() => moveResource(index, index - 1)} disabled={index === 0} className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 disabled:opacity-40">Subir</button>
                            <button type="button" onClick={() => moveResource(index, index + 2)} disabled={index === draft.links.additionalResources.length - 1} className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 disabled:opacity-40">Bajar</button>
                            <button type="button" onClick={() => setCollapsedResources((current) => ({ ...current, [resource.id]: !current[resource.id] }))} className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700">
                              {collapsedResources[resource.id] ? "Expandir" : "Colapsar"}
                            </button>
                            <button type="button" onClick={() => updateResource(index, "hidden", !resource.hidden)} className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700">
                              {resource.hidden ? "Mostrar" : "Ocultar"}
                            </button>
                            <button type="button" onClick={() => deleteResource(index)} className="rounded-md border border-red-200 px-3 py-1 text-sm text-red-700">Eliminar</button>
                          </div>
                        </div>
                        {!collapsedResources[resource.id] && (
                          <div className="grid gap-4 md:grid-cols-2">
                            <label className="block">
                              <span className="text-sm font-semibold text-gray-700">Título</span>
                              <input value={resource.title || ""} onChange={(event) => updateResource(index, "title", event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
                            </label>
                            <label className="block">
                              <span className="text-sm font-semibold text-gray-700">Texto botón</span>
                              <input value={resource.buttonText || ""} onChange={(event) => updateResource(index, "buttonText", event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
                            </label>
                            <label className="block md:col-span-2">
                              <span className="text-sm font-semibold text-gray-700">Descripción</span>
                              <textarea value={resource.description || ""} onChange={(event) => updateResource(index, "description", event.target.value)} rows={2} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
                            </label>
                            <label className="block md:col-span-2">
                              <span className="text-sm font-semibold text-gray-700">Enlace</span>
                              <input value={resource.url || ""} onChange={(event) => updateResource(index, "url", event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
                            </label>
                          </div>
                        )}
                      </article>
                      {index === draft.links.additionalResources.length - 1 && resourceDropIndex === draft.links.additionalResources.length && draggedResourceIndex !== null && draggedResourceIndex !== index && (
                        <div className="relative -my-3 h-6" onDragOver={(event) => { event.preventDefault(); event.stopPropagation(); setResourceDropIndex(draft.links.additionalResources.length); }} onDrop={(event) => handleResourceDrop(event, draft.links.additionalResources.length)}>
                          <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.16)] transition-all" />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </article>
            </div>
          )}

          {activeTab === "photos" && (
            <div className="grid gap-6">
              <article className="rounded-lg border border-gray-200 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-blue-950">Pop-up de fotos</h2>
                    <p className="text-sm text-gray-600">
                      {draft.photos.popup?.enabled ? "Visible para usuarios." : "Desactivado."}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => togglePhotoGroupCollapsed("popup")}
                    className="w-fit rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700"
                  >
                    {collapsedPhotoGroups.popup ? "Expandir" : "Colapsar"}
                  </button>
                </div>

                {!collapsedPhotoGroups.popup && (
                  <div className="mt-4 grid gap-4">
                    <label className="flex items-center gap-3 rounded-md bg-slate-50 px-3 py-2">
                      <input
                        type="checkbox"
                        checked={Boolean(draft.photos.popup?.enabled)}
                        onChange={(event) => updatePhotoPopup("enabled", event.target.checked)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm font-semibold text-gray-700">Activar pop-up</span>
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-gray-700">Título</span>
                      <input
                        value={draft.photos.popup?.title || ""}
                        onChange={(event) => updatePhotoPopup("title", event.target.value)}
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-gray-700">Subtítulo</span>
                      <textarea
                        value={draft.photos.popup?.subtitle || ""}
                        onChange={(event) => updatePhotoPopup("subtitle", event.target.value)}
                        rows={3}
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-gray-700">Link del botón Ir a las fotos</span>
                      <input
                        value={draft.photos.popup?.buttonUrl || ""}
                        onChange={(event) => updatePhotoPopup("buttonUrl", event.target.value)}
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                    </label>
                  </div>
                )}
              </article>

              <article className="rounded-lg border border-gray-200 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-blue-950">Secciones del carousel vertical</h2>
                    <p className="text-sm text-gray-600">Agregá, ocultá o eliminá secciones de la primera parte de Fotos.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={addCarouselSection}
                      className="rounded-md bg-blue-950 px-3 py-1 text-sm font-semibold text-white"
                    >
                      Agregar sección
                    </button>
                    <button
                      type="button"
                      onClick={() => togglePhotoGroupCollapsed("carousel")}
                      className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700"
                    >
                      {collapsedPhotoGroups.carousel ? "Expandir" : "Colapsar"}
                    </button>
                  </div>
                </div>

                {!collapsedPhotoGroups.carousel && (
                  <div className="mt-4 grid gap-3">
                    {draft.photos.carouselSections.map((section, index) => (
                      <React.Fragment key={section.id || index}>
                        {carouselSectionDropIndex === index && draggedCarouselSectionIndex !== null && draggedCarouselSectionIndex !== index && (
                          <div
                            className="relative -my-3 h-6"
                            onDragOver={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              setCarouselSectionDropIndex(index);
                            }}
                            onDrop={(event) => handleCarouselSectionDrop(event, index)}
                          >
                            <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.16)] transition-all" />
                          </div>
                        )}
                        <article
                          onDragOver={(event) => {
                            event.preventDefault();
                            event.dataTransfer.dropEffect = "move";
                            updateCarouselSectionDropIndicator(event, index);
                          }}
                          onDrop={(event) => handleCarouselSectionDrop(event, carouselSectionDropIndex ?? index)}
                          className={`rounded-md border p-4 transition ${
                            draggedCarouselSectionIndex === index ? "scale-[0.99] border-blue-300 bg-blue-50 opacity-70" : section.hidden ? "border-amber-200 bg-amber-50" : "border-gray-200"
                          }`}
                        >
                          <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div className="flex min-w-0 flex-1 items-center gap-3">
                              <div
                                draggable
                                onDragStart={(event) => {
                                  setDraggedCarouselSectionIndex(index);
                                  event.dataTransfer.effectAllowed = "move";
                                  event.dataTransfer.setData("text/plain", String(index));
                                }}
                                onDragEnd={() => setDraggedCarouselSectionIndex(null)}
                                onDragEndCapture={() => setCarouselSectionDropIndex(null)}
                                className="flex h-10 w-10 cursor-grab items-center justify-center rounded-md border border-gray-300 bg-white text-lg font-bold text-gray-500 active:cursor-grabbing"
                                title="Arrastrar para ordenar"
                                aria-label="Arrastrar para ordenar"
                              >
                                ≡
                              </div>
                              <div className="min-w-0">
                                {section.hidden && <span className="rounded bg-amber-200 px-2 py-0.5 text-xs font-semibold text-amber-900">Oculta</span>}
                              </div>
                            </div>
                            <div className="flex flex-shrink-0 flex-wrap gap-2 md:max-w-[430px] md:justify-end">
                              <button type="button" onClick={() => moveCarouselSection(index, index - 1)} disabled={index === 0} className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 disabled:opacity-40">
                                Subir
                              </button>
                              <button type="button" onClick={() => moveCarouselSection(index, index + 2)} disabled={index === draft.photos.carouselSections.length - 1} className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 disabled:opacity-40">
                                Bajar
                              </button>
                              <button
                                type="button"
                                onClick={() => setCollapsedCarouselSections((current) => ({ ...current, [section.id]: !current[section.id] }))}
                                className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700"
                              >
                                {collapsedCarouselSections[section.id] ? "Expandir" : "Colapsar"}
                              </button>
                              <button
                                type="button"
                                onClick={() => updateCarouselSection(index, "hidden", !section.hidden)}
                                className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700"
                              >
                                {section.hidden ? "Mostrar" : "Ocultar"}
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteCarouselSection(index)}
                                className="rounded-md border border-red-200 px-3 py-1 text-sm text-red-700"
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>

                          {!collapsedCarouselSections[section.id] && (
                            <div className="grid gap-4 md:grid-cols-2">
                              <label className="block">
                                <span className="text-sm font-semibold text-gray-700">Título</span>
                                <input
                                  value={section.title || ""}
                                  onChange={(event) => updateCarouselSection(index, "title", event.target.value)}
                                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                                />
                              </label>
                              <label className="block md:col-span-2">
                                <span className="text-sm font-semibold text-gray-700">Subtítulo</span>
                                <textarea
                                  value={section.subtitle || ""}
                                  onChange={(event) => updateCarouselSection(index, "subtitle", event.target.value)}
                                  rows={3}
                                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                                />
                              </label>
                              <label className="block md:col-span-2">
                                <span className="text-sm font-semibold text-gray-700">Link de carpeta de fotos</span>
                                <input
                                  value={section.folderUrl || ""}
                                  onChange={(event) => updateCarouselSection(index, "folderUrl", event.target.value)}
                                  placeholder="https://drive.google.com/drive/folders/..."
                                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                                />
                              </label>
                            </div>
                          )}
                        </article>
                        {index === draft.photos.carouselSections.length - 1 && carouselSectionDropIndex === draft.photos.carouselSections.length && draggedCarouselSectionIndex !== null && draggedCarouselSectionIndex !== index && (
                          <div
                            className="relative -my-3 h-6"
                            onDragOver={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              setCarouselSectionDropIndex(draft.photos.carouselSections.length);
                            }}
                            onDrop={(event) => handleCarouselSectionDrop(event, draft.photos.carouselSections.length)}
                          >
                            <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.16)] transition-all" />
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </article>

              <article className="rounded-lg border border-gray-200 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-blue-950">Carpetas de Google Drive</h2>
                    <p className="text-sm text-gray-600">Estas carpetas alimentan el selector que ve el usuario.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={addDriveFolder}
                      className="rounded-md bg-blue-950 px-3 py-1 text-sm font-semibold text-white"
                    >
                      Agregar carpeta
                    </button>
                    <button
                      type="button"
                      onClick={() => togglePhotoGroupCollapsed("driveFolders")}
                      className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700"
                    >
                      {collapsedPhotoGroups.driveFolders ? "Expandir" : "Colapsar"}
                    </button>
                  </div>
                </div>

                {!collapsedPhotoGroups.driveFolders && (
                  <div className="mt-4 grid gap-3">
                    {draft.photos.driveFolders.map((folder, index) => (
                      <React.Fragment key={folder.id || index}>
                        {photoFolderDropIndex === index && draggedPhotoFolderIndex !== null && draggedPhotoFolderIndex !== index && (
                          <div
                            className="relative -my-3 h-6"
                            onDragOver={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              setPhotoFolderDropIndex(index);
                            }}
                            onDrop={(event) => handlePhotoFolderDrop(event, index)}
                          >
                            <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.16)] transition-all" />
                          </div>
                        )}
                        <article
                          onDragOver={(event) => {
                            event.preventDefault();
                            event.dataTransfer.dropEffect = "move";
                            updatePhotoFolderDropIndicator(event, index);
                          }}
                          onDrop={(event) => handlePhotoFolderDrop(event, photoFolderDropIndex ?? index)}
                          className={`rounded-md border p-4 transition ${
                            draggedPhotoFolderIndex === index ? "scale-[0.99] border-blue-300 bg-blue-50 opacity-70" : folder.hidden ? "border-amber-200 bg-amber-50" : "border-gray-200"
                          }`}
                        >
                          <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div className="flex min-w-0 flex-1 items-center gap-3">
                              <div
                                draggable
                                onDragStart={(event) => {
                                  setDraggedPhotoFolderIndex(index);
                                  event.dataTransfer.effectAllowed = "move";
                                  event.dataTransfer.setData("text/plain", String(index));
                                }}
                                onDragEnd={() => setDraggedPhotoFolderIndex(null)}
                                onDragEndCapture={() => setPhotoFolderDropIndex(null)}
                                className="flex h-10 w-10 cursor-grab items-center justify-center rounded-md border border-gray-300 bg-white text-lg font-bold text-gray-500 active:cursor-grabbing"
                                title="Arrastrar para ordenar"
                                aria-label="Arrastrar para ordenar"
                              >
                                ≡
                              </div>
                              <div className="min-w-0">
                                {folder.hidden && <span className="rounded bg-amber-200 px-2 py-0.5 text-xs font-semibold text-amber-900">Oculta</span>}
                              </div>
                            </div>
                            <div className="flex flex-shrink-0 flex-wrap gap-2 md:max-w-[430px] md:justify-end">
                              <button type="button" onClick={() => moveDriveFolder(index, index - 1)} disabled={index === 0} className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 disabled:opacity-40">
                                Subir
                              </button>
                              <button type="button" onClick={() => moveDriveFolder(index, index + 2)} disabled={index === draft.photos.driveFolders.length - 1} className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 disabled:opacity-40">
                                Bajar
                              </button>
                              <button
                                type="button"
                                onClick={() => setCollapsedDriveFolders((current) => ({ ...current, [folder.id]: !current[folder.id] }))}
                                className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700"
                              >
                                {collapsedDriveFolders[folder.id] ? "Expandir" : "Colapsar"}
                              </button>
                              <button type="button" onClick={() => updateDriveFolder(index, "hidden", !folder.hidden)} className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700">
                                {folder.hidden ? "Mostrar" : "Ocultar"}
                              </button>
                              <button type="button" onClick={() => deleteDriveFolder(index)} className="rounded-md border border-red-200 px-3 py-1 text-sm text-red-700">
                                Eliminar
                              </button>
                            </div>
                          </div>

                          {!collapsedDriveFolders[folder.id] && (
                            <div className="grid gap-4 md:grid-cols-2">
                            <label className="block">
                              <span className="text-sm font-semibold text-gray-700">Título</span>
                              <input value={folder.title || ""} onChange={(event) => updateDriveFolder(index, "title", event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
                            </label>
                            <label className="block md:col-span-2">
                              <span className="text-sm font-semibold text-gray-700">Preview</span>
                              <input
                                value={folder.previewUrl || ""}
                                onChange={(event) => updateDriveFolder(index, "previewUrl", event.target.value)}
                                placeholder="https://drive.google.com/drive/folders/..."
                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                              />
                            </label>
                            <label className="block md:col-span-2">
                              <span className="text-sm font-semibold text-gray-700">Link de la carpeta de Drive</span>
                              <input
                                  value={folder.folderUrl || ""}
                                  onChange={(event) => updateDriveFolder(index, "folderUrl", event.target.value)}
                                  placeholder="https://drive.google.com/drive/folders/..."
                                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                                />
                              </label>
                            </div>
                          )}
                        </article>
                        {index === draft.photos.driveFolders.length - 1 && photoFolderDropIndex === draft.photos.driveFolders.length && draggedPhotoFolderIndex !== null && draggedPhotoFolderIndex !== index && (
                          <div
                            className="relative -my-3 h-6"
                            onDragOver={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              setPhotoFolderDropIndex(draft.photos.driveFolders.length);
                            }}
                            onDrop={(event) => handlePhotoFolderDrop(event, draft.photos.driveFolders.length)}
                          >
                            <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.16)] transition-all" />
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </article>
            </div>
          )}

          {activeTab === "donations" && (
            <div className="grid gap-6">
              <article className="order-3 rounded-lg border border-gray-200 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-blue-950">Encabezado - Página Donar</h2>
                    <p className="text-sm text-gray-600">Título de la pestaña, encabezado y botón principal de /donar.</p>
                  </div>
                  <button type="button" onClick={() => setCollapsedDonationGroups((current) => ({ ...current, hero: !current.hero }))} className="w-fit rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700">
                    {collapsedDonationGroups.hero ? "Expandir" : "Colapsar"}
                  </button>
                </div>
                {!collapsedDonationGroups.hero && (
                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <label className="block">
                      <span className="text-sm font-semibold text-gray-700">Título en el menú</span>
                      <input value={draft.donations.navTitle || ""} onChange={(event) => updateDonation("navTitle", event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
                    </label>
                    <label className="block md:col-span-2">
                      <span className="text-sm font-semibold text-gray-700">Título principal</span>
                      <input value={draft.donations.heroTitle || ""} onChange={(event) => updateDonation("heroTitle", event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-gray-700">Bajada superior</span>
                      <input value={draft.donations.heroKicker || ""} onChange={(event) => updateDonation("heroKicker", event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-gray-700">Texto botón</span>
                      <input value={draft.donations.heroButtonText || ""} onChange={(event) => updateDonation("heroButtonText", event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-gray-700">Bajada inferior</span>
                      <input value={draft.donations.securePaymentText || ""} onChange={(event) => updateDonation("securePaymentText", event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
                    </label>
                    <label className="block md:col-span-3">
                      <span className="text-sm font-semibold text-gray-700">Link botón</span>
                      <input value={draft.donations.heroButtonUrl || ""} onChange={(event) => updateDonation("heroButtonUrl", event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
                    </label>
                  </div>
                )}
              </article>

              <article className="order-4 rounded-lg border border-gray-200 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-blue-950">Textos de Impacto - Página Donar</h2>
                    <p className="text-sm text-gray-600">Campos visibles en el bloque de la captura.</p>
                  </div>
                  <button type="button" onClick={() => setCollapsedDonationGroups((current) => ({ ...current, impact: !current.impact }))} className="w-fit rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700">
                    {collapsedDonationGroups.impact ? "Expandir" : "Colapsar"}
                  </button>
                </div>
                {!collapsedDonationGroups.impact && (
                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <label className="block md:col-span-3">
                      <span className="text-sm font-semibold text-gray-700">Título General</span>
                      <input value={draft.donations.whyTitle || ""} onChange={(event) => updateDonation("whyTitle", event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
                    </label>
                    <label className="block md:col-span-3">
                      <span className="text-sm font-semibold text-gray-700">Texto introductorio</span>
                      <textarea value={draft.donations.whyText || ""} onChange={(event) => updateDonation("whyText", event.target.value)} rows={3} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
                    </label>
                    <label className="block md:col-span-3">
                      <span className="text-sm font-semibold text-gray-700">Título subsección</span>
                      <input value={draft.donations.allocationTitle || ""} onChange={(event) => updateDonation("allocationTitle", event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-gray-700">Etiqueta impacto</span>
                      <input value={draft.donations.impactKicker || ""} onChange={(event) => updateDonation("impactKicker", event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-gray-700">Número impacto</span>
                      <input value={draft.donations.impactNumber || ""} onChange={(event) => updateDonation("impactNumber", event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-gray-700">Texto secundario</span>
                      <input value={draft.donations.impactNumberText || ""} onChange={(event) => updateDonation("impactNumberText", event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-gray-700">Título impacto</span>
                      <input value={draft.donations.impactTitle || ""} onChange={(event) => updateDonation("impactTitle", event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
                    </label>
                    <label className="block md:col-span-2">
                      <span className="text-sm font-semibold text-gray-700">Texto impacto</span>
                      <input value={draft.donations.impactText || ""} onChange={(event) => updateDonation("impactText", event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
                    </label>
                    <label className="block md:col-span-2">
                      <span className="text-sm font-semibold text-gray-700">Cita</span>
                      <textarea value={draft.donations.quote || ""} onChange={(event) => updateDonation("quote", event.target.value)} rows={2} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-gray-700">Autor de la cita</span>
                      <input value={draft.donations.quoteAuthor || ""} onChange={(event) => updateDonation("quoteAuthor", event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
                    </label>

                    <div className="md:col-span-3">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <h3 className="font-semibold text-blue-950">Destinos del aporte</h3>
                        <button type="button" onClick={addDonationAllocationItem} className="rounded-md bg-blue-950 px-3 py-1 text-sm font-semibold text-white">
                          Agregar destino
                        </button>
                      </div>
                      <div className="grid gap-3">
                        {draft.donations.allocationItems.map((item, index) => (
                          <article key={item.id || index} className={`rounded-md border p-4 ${item.hidden ? "border-amber-200 bg-amber-50" : "border-gray-200"}`}>
                            <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                              {item.hidden && <span className="rounded bg-amber-200 px-2 py-0.5 text-xs font-semibold text-amber-900">Oculto</span>}
                              <div className="flex flex-wrap gap-2">
                                <button type="button" onClick={() => setCollapsedDonationItems((current) => ({ ...current, [item.id]: !current[item.id] }))} className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700">
                                  {collapsedDonationItems[item.id] ? "Expandir" : "Colapsar"}
                                </button>
                                <button type="button" onClick={() => updateDonationAllocationItem(index, "hidden", !item.hidden)} className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700">
                                  {item.hidden ? "Mostrar" : "Ocultar"}
                                </button>
                                <button type="button" onClick={() => deleteDonationAllocationItem(index)} className="rounded-md border border-red-200 px-3 py-1 text-sm text-red-700">
                                  Eliminar
                                </button>
                              </div>
                            </div>
                            {!collapsedDonationItems[item.id] && (
                              <div className="grid gap-4 md:grid-cols-2">
                                <label className="block">
                                  <span className="text-sm font-semibold text-gray-700">Título</span>
                                  <input value={item.title || ""} onChange={(event) => updateDonationAllocationItem(index, "title", event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
                                </label>
                                <label className="block">
                                  <span className="text-sm font-semibold text-gray-700">Texto</span>
                                  <input value={item.text || ""} onChange={(event) => updateDonationAllocationItem(index, "text", event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
                                </label>
                              </div>
                            )}
                          </article>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </article>

              <article className="order-2 rounded-lg border border-gray-200 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-blue-950">Landing</h2>
                    <p className="text-sm text-gray-600">CTA de donación que aparece en Home.</p>
                  </div>
                  <button type="button" onClick={() => setCollapsedDonationGroups((current) => ({ ...current, home: !current.home }))} className="w-fit rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700">
                    {collapsedDonationGroups.home ? "Expandir" : "Colapsar"}
                  </button>
                </div>
                {!collapsedDonationGroups.home && (
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <label className="block md:col-span-2">
                      <span className="text-sm font-semibold text-gray-700">Título</span>
                      <input value={draft.donations.homeCtaTitle || ""} onChange={(event) => updateDonation("homeCtaTitle", event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
                    </label>
                    <label className="block md:col-span-2">
                      <span className="text-sm font-semibold text-gray-700">Texto</span>
                      <textarea value={draft.donations.homeCtaText || ""} onChange={(event) => updateDonation("homeCtaText", event.target.value)} rows={2} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-gray-700">Texto botón</span>
                      <input value={draft.donations.homeCtaButtonText || ""} onChange={(event) => updateDonation("homeCtaButtonText", event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-gray-700">Link botón ¡Quiero donar!</span>
                      <input value={draft.donations.homeCtaButtonUrl || ""} onChange={(event) => updateDonation("homeCtaButtonUrl", event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
                    </label>
                  </div>
                )}
              </article>

              <article className="order-1 rounded-lg border border-gray-200 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-blue-950">Pop Up</h2>
                    <p className="text-sm text-gray-600">{draft.donations.popup?.enabled ? "Activo" : "Desactivado"}</p>
                  </div>
                  <button type="button" onClick={() => setCollapsedDonationGroups((current) => ({ ...current, popup: !current.popup }))} className="w-fit rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700">
                    {collapsedDonationGroups.popup ? "Expandir" : "Colapsar"}
                  </button>
                </div>
                {!collapsedDonationGroups.popup && (
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <label className="flex items-center gap-3 rounded-md bg-slate-50 px-3 py-2 md:col-span-2">
                      <input type="checkbox" checked={Boolean(draft.donations.popup?.enabled)} onChange={(event) => updateDonationPopup("enabled", event.target.checked)} className="h-4 w-4" />
                      <span className="text-sm font-semibold text-gray-700">Activar pop-up</span>
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-gray-700">Título</span>
                      <input value={draft.donations.popup?.title || ""} onChange={(event) => updateDonationPopup("title", event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-gray-700">Texto botón</span>
                      <input value={draft.donations.popup?.buttonText || ""} onChange={(event) => updateDonationPopup("buttonText", event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
                    </label>
                    <label className="block md:col-span-2">
                      <span className="text-sm font-semibold text-gray-700">Texto</span>
                      <textarea value={draft.donations.popup?.text || ""} onChange={(event) => updateDonationPopup("text", event.target.value)} rows={2} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-gray-700">Link botón pop-up</span>
                      <input value={draft.donations.popup?.buttonUrl || ""} onChange={(event) => updateDonationPopup("buttonUrl", event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-gray-700">Texto de ocultar</span>
                      <input value={draft.donations.popup?.dismissText || ""} onChange={(event) => updateDonationPopup("dismissText", event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
                    </label>
                  </div>
                )}
              </article>

              <article className="order-5 rounded-lg border border-gray-200 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-blue-950">Preguntas Frecuentes - Página Donar</h2>
                    <p className="text-sm text-gray-600">Agregá, ocultá o eliminá preguntas.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={addDonationFaq} className="rounded-md bg-blue-950 px-3 py-1 text-sm font-semibold text-white">
                      Agregar pregunta
                    </button>
                    <button type="button" onClick={() => setCollapsedDonationGroups((current) => ({ ...current, faqs: !current.faqs }))} className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700">
                      {collapsedDonationGroups.faqs ? "Expandir" : "Colapsar"}
                    </button>
                  </div>
                </div>
                {!collapsedDonationGroups.faqs && (
                  <div className="mt-4 grid gap-4">
                    <label className="block">
                      <span className="text-sm font-semibold text-gray-700">Título de la sección</span>
                      <input value={draft.donations.faqTitle || ""} onChange={(event) => updateDonation("faqTitle", event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
                    </label>
                    {draft.donations.faqs.map((faq, index) => (
                      <article key={faq.id || index} className={`rounded-md border p-4 ${faq.hidden ? "border-amber-200 bg-amber-50" : "border-gray-200"}`}>
                        <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          {faq.hidden && <span className="rounded bg-amber-200 px-2 py-0.5 text-xs font-semibold text-amber-900">Oculta</span>}
                          <div className="flex flex-wrap gap-2">
                            <button type="button" onClick={() => setCollapsedDonationFaqs((current) => ({ ...current, [faq.id]: !current[faq.id] }))} className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700">
                              {collapsedDonationFaqs[faq.id] ? "Expandir" : "Colapsar"}
                            </button>
                            <button type="button" onClick={() => updateDonationFaq(index, "hidden", !faq.hidden)} className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700">
                              {faq.hidden ? "Mostrar" : "Ocultar"}
                            </button>
                            <button type="button" onClick={() => deleteDonationFaq(index)} className="rounded-md border border-red-200 px-3 py-1 text-sm text-red-700">
                              Eliminar
                            </button>
                          </div>
                        </div>
                        {!collapsedDonationFaqs[faq.id] && (
                          <div className="grid gap-4">
                            <label className="block">
                              <span className="text-sm font-semibold text-gray-700">Pregunta</span>
                              <input value={faq.question || ""} onChange={(event) => updateDonationFaq(index, "question", event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
                            </label>
                            <label className="block">
                              <span className="text-sm font-semibold text-gray-700">Respuesta</span>
                              <textarea value={faq.answer || ""} onChange={(event) => updateDonationFaq(index, "answer", event.target.value)} rows={3} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
                            </label>
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                )}
              </article>
            </div>
          )}

          {activeTab === "organs" && (
            <div className="grid gap-6">
              <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-blue-950">Encabezado de la página Órganos</h2>
                    <p className="text-sm text-blue-900">{draft.modelPage.subtitle}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsModelHeaderCollapsed((current) => !current)}
                    className="w-fit rounded-md border border-blue-200 bg-white px-3 py-1 text-sm font-semibold text-blue-950"
                  >
                    {isModelHeaderCollapsed ? "Expandir" : "Colapsar"}
                  </button>
                </div>
                {!isModelHeaderCollapsed && (
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-semibold text-gray-700">Subtítulo de actividad</span>
                      <input
                        value={draft.modelPage.subtitle}
                        onChange={(event) => updateDraft((current) => ({
                          ...current,
                          modelPage: { ...current.modelPage, subtitle: event.target.value },
                        }))}
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-gray-700">Edición</span>
                      <input
                        value={draft.modelPage.topicEdition || ""}
                        onChange={(event) => updateDraft((current) => ({
                          ...current,
                          modelPage: { ...current.modelPage, topicEdition: event.target.value },
                        }))}
                        placeholder="VIII Edición"
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                    </label>
                    <label className="block md:col-span-2">
                      <span className="text-sm font-semibold text-gray-700">Texto introductorio</span>
                      <textarea
                        value={draft.modelPage.intro}
                        onChange={(event) => updateDraft((current) => ({
                          ...current,
                          modelPage: { ...current.modelPage, intro: event.target.value },
                        }))}
                        rows={4}
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                    </label>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <button onClick={addOrgan} className="w-fit rounded-md bg-blue-950 px-4 py-2 font-semibold text-white">
                  Crear órgano
                </button>
                <button onClick={() => setAllOrgansCollapsed(true)} className="w-fit rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700">
                  Colapsar todos
                </button>
                <button onClick={() => setAllOrgansCollapsed(false)} className="w-fit rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700">
                  Expandir todos
                </button>
              </div>
              {draft.organs.map((organ, index) => (
                <React.Fragment key={organ.id}>
                {dropIndicatorIndex === index && draggedOrganIndex !== null && draggedOrganIndex !== index && (
                  <div
                    className="relative -my-3 h-6"
                    onDragOver={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setDropIndicatorIndex(index);
                    }}
                    onDrop={(event) => handleOrganDrop(event, index)}
                  >
                    <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.16)] transition-all" />
                  </div>
                )}
                <article
                  onDragOver={(event) => {
                    event.preventDefault();
                    event.dataTransfer.dropEffect = "move";
                    updateDropIndicator(event, index);
                  }}
                  onDrop={(event) => {
                    handleOrganDrop(event, dropIndicatorIndex ?? index);
                  }}
                  className={`rounded-lg border p-4 transition ${
                    draggedOrganIndex === index ? "scale-[0.99] border-blue-300 bg-blue-50 opacity-70" : organ.hidden ? "border-amber-200 bg-amber-50" : "border-gray-200"
                  }`}
                >
                  <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <div
                        draggable
                        onDragStart={(event) => {
                          setDraggedOrganIndex(index);
                          event.dataTransfer.effectAllowed = "move";
                          event.dataTransfer.setData("text/plain", String(index));
                        }}
                        onDragEnd={() => setDraggedOrganIndex(null)}
                        onDragEndCapture={() => setDropIndicatorIndex(null)}
                        className="flex h-10 w-10 cursor-grab items-center justify-center rounded-md border border-gray-300 bg-white text-lg font-bold text-gray-500 active:cursor-grabbing"
                        title="Arrastrar para ordenar"
                        aria-label="Arrastrar para ordenar"
                      >
                        ≡
                      </div>
                      {organ.logoUrl && <img src={organ.logoUrl} alt="" className="h-12 w-20 flex-shrink-0 object-contain" />}
                      <div className="min-w-0 flex-1">
                        {organ.hidden && <span className="rounded bg-amber-200 px-2 py-0.5 text-xs font-semibold text-amber-900">Oculto</span>}
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 flex-wrap justify-start gap-2 md:max-w-[430px] md:justify-end">
                      <button
                        type="button"
                        onClick={() => moveOrgan(index, index - 1)}
                        disabled={index === 0}
                        className="w-fit rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 disabled:opacity-40"
                      >
                        Subir
                      </button>
                      <button
                        type="button"
                        onClick={() => moveOrgan(index, index + 2)}
                        disabled={index === draft.organs.length - 1}
                        className="w-fit rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 disabled:opacity-40"
                      >
                        Bajar
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleOrganCollapsed(organ.id)}
                        className="w-fit rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700"
                      >
                        {collapsedOrgans[organ.id] ? "Expandir" : "Colapsar"}
                      </button>
                      <button
                        onClick={() => updateOrgan(index, "hidden", !organ.hidden)}
                        className="w-fit rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700"
                      >
                        {organ.hidden ? "Mostrar órgano" : "Ocultar órgano"}
                      </button>
                      <button
                        onClick={() => deleteOrgan(index)}
                        className="w-fit rounded-md border border-red-200 px-3 py-1 text-sm text-red-700"
                      >
                        Eliminar órgano
                      </button>
                    </div>
                  </div>

                  {!collapsedOrgans[organ.id] && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-semibold text-gray-700">Nombre Completo</span>
                      <input
                        value={organ.shortName || organ.name || ""}
                        onChange={(event) => updateDraft((current) => ({
                          ...current,
                          organs: current.organs.map((currentOrgan, organIndex) =>
                            organIndex === index
                              ? { ...currentOrgan, shortName: event.target.value, name: event.target.value }
                              : currentOrgan
                          ),
                        }))}
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-gray-700">Abreviación</span>
                      <input value={organ.id} onChange={(event) => updateOrgan(index, "id", event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
                    </label>
                    <div className="block">
                      <span className="text-sm font-semibold text-gray-700">Color</span>
                      <div className="mt-1 grid gap-2">
                        <select
                          value={colorModes[organ.id] || "hex"}
                          onChange={(event) => setColorModes((current) => ({ ...current, [organ.id]: event.target.value }))}
                          className="w-full rounded-md border border-gray-300 px-3 py-2"
                        >
                          <option value="hex">Selector visual + HEX</option>
                          <option value="rgb">RGB</option>
                          <option value="suggested">Colores sugeridos</option>
                        </select>

                        {(colorModes[organ.id] || "hex") === "hex" && (
                          <div className="grid grid-cols-[56px_1fr] gap-2">
                            <input
                              type="color"
                              value={normalizeHex(organ.color || "") || "#3B82F6"}
                              onChange={(event) => updateOrgan(index, "color", event.target.value.toUpperCase())}
                              className="h-10 w-14 rounded-md border border-gray-300 px-1 py-1"
                            />
                            <input
                              value={organ.color || ""}
                              onChange={(event) => {
                                const normalized = normalizeHex(event.target.value);
                                updateOrgan(index, "color", normalized || event.target.value);
                              }}
                              onBlur={(event) => {
                                const normalized = normalizeHex(event.target.value);
                                if (normalized) updateOrgan(index, "color", normalized);
                              }}
                              className="w-full rounded-md border border-gray-300 px-3 py-2 font-mono"
                              placeholder="#3B82F6"
                            />
                          </div>
                        )}

                        {(colorModes[organ.id] || "hex") === "rgb" && (
                          <div className="grid grid-cols-3 gap-2">
                            {["r", "g", "b"].map((channel) => {
                              const rgb = hexToRgb(organ.color || "#3B82F6");
                              return (
                                <label key={channel} className="block">
                                  <span className="text-xs font-semibold uppercase text-gray-500">{channel}</span>
                                  <input
                                    type="number"
                                    min="0"
                                    max="255"
                                    value={rgb[channel]}
                                    onChange={(event) => updateOrgan(index, "color", rgbToHex({ ...rgb, [channel]: event.target.value }))}
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                                  />
                                </label>
                              );
                            })}
                          </div>
                        )}

                        {(colorModes[organ.id] || "hex") === "suggested" && (
                          <div className="flex flex-wrap gap-2">
                            {(organ.suggestedColors || [organ.color || "#3B82F6"]).map((color) => (
                              <button
                                key={color}
                                type="button"
                                onClick={() => updateOrgan(index, "color", color)}
                                className={`h-9 w-9 rounded-full border-2 ${organ.color === color ? "border-blue-950" : "border-white"} shadow`}
                                style={{ backgroundColor: color }}
                                title={color}
                                aria-label={`Usar color ${color}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <label className="block md:col-span-2">
                      <span className="text-sm font-semibold text-gray-700">Descripción</span>
                      <textarea value={organ.description} onChange={(event) => updateOrgan(index, "description", event.target.value)} rows={3} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-gray-700">Logo principal</span>
                      <input type="file" accept="image/*" onChange={(event) => handleLogoFile(event, index, "logoUrl")} className="mt-1 w-full" />
                      {uploadingAsset === `logoUrl-${index}` && <span className="text-xs text-blue-700">Subiendo...</span>}
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-gray-700">Logo para tópicos ampliados</span>
                      <input type="file" accept="image/*" onChange={(event) => handleLogoFile(event, index, "blankLogoUrl")} className="mt-1 w-full" />
                      {uploadingAsset === `blankLogoUrl-${index}` && <span className="text-xs text-blue-700">Subiendo...</span>}
                    </label>
                    <label className="block md:col-span-2">
                      <span className="text-sm font-semibold text-gray-700">Título de tópico</span>
                      <textarea
                        value={organ.topicTitle || ""}
                        onChange={(event) => updateOrgan(index, "topicTitle", event.target.value)}
                        rows={2}
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                    </label>
                    <label className="block md:col-span-2">
                      <span className="text-sm font-semibold text-gray-700">Subtítulo de tópico</span>
                      <textarea
                        value={organ.topicSubtitle || ""}
                        onChange={(event) => updateOrgan(index, "topicSubtitle", event.target.value)}
                        rows={3}
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                    </label>
                    <label className="block md:col-span-2">
                      <span className="text-sm font-semibold text-gray-700">Link al tópico ampliado</span>
                      <input value={organ.topicLink || ""} onChange={(event) => updateOrgan(index, "topicLink", event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
                    </label>
                  </div>
                  )}
                </article>
                {index === draft.organs.length - 1 && dropIndicatorIndex === draft.organs.length && draggedOrganIndex !== null && draggedOrganIndex !== index && (
                  <div
                    className="relative -my-3 h-6"
                    onDragOver={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setDropIndicatorIndex(draft.organs.length);
                    }}
                    onDrop={(event) => handleOrganDrop(event, draft.organs.length)}
                  >
                    <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.16)] transition-all" />
                  </div>
                )}
                </React.Fragment>
              ))}
            </div>
          )}

          {activeTab === "news" && (
            <div className="grid gap-6">
              <div className="grid gap-4">
                <input value={newsForm.title} onChange={(event) => setNewsForm({ ...newsForm, title: event.target.value })} className="rounded-md border border-gray-300 px-3 py-2" placeholder="Título" />
                <input value={newsForm.summary} onChange={(event) => setNewsForm({ ...newsForm, summary: event.target.value })} className="rounded-md border border-gray-300 px-3 py-2" placeholder="Bajada" />
                <input type="date" value={newsForm.date} onChange={(event) => setNewsForm({ ...newsForm, date: event.target.value })} className="rounded-md border border-gray-300 px-3 py-2" />
                <input value={newsForm.img} onChange={(event) => setNewsForm({ ...newsForm, img: event.target.value })} className="rounded-md border border-gray-300 px-3 py-2" placeholder="URL de imagen" />
                <label className="block rounded-md border border-dashed border-gray-300 px-3 py-3">
                  <span className="text-sm font-semibold text-gray-700">O subir imagen de noticia</span>
                  <input type="file" accept="image/*" onChange={handleNewsImageFile} className="mt-2 w-full" />
                  {uploadingAsset === "news-image" && <span className="text-xs text-blue-700">Subiendo...</span>}
                </label>
                <textarea value={newsForm.content} onChange={(event) => setNewsForm({ ...newsForm, content: event.target.value })} rows={8} className="rounded-md border border-gray-300 px-3 py-2" placeholder="Contenido" />
                <button onClick={addNews} className="w-fit rounded-md bg-blue-950 px-4 py-2 font-semibold text-white">
                  Agregar noticia
                </button>
              </div>
              <div className="space-y-3">
                {sortNewsByDateDesc(draft.adminNews).map((item) => (
                  <article key={item.id} className={`flex items-start justify-between gap-4 rounded-md border p-4 ${item.hidden ? "border-amber-200 bg-amber-50" : "border-gray-200"}`}>
                    <div>
                      <h3 className="font-semibold text-blue-950">
                        {item.title}
                        {item.hidden && <span className="ml-2 rounded bg-amber-200 px-2 py-0.5 text-xs text-amber-900">Oculta</span>}
                      </h3>
                      <p className="text-sm text-gray-600">{item.date}</p>
                    </div>
                    <div className="flex flex-wrap justify-end gap-2">
                      <button
                        onClick={() => updateDraft((current) => ({
                          ...current,
                          adminNews: current.adminNews.map((news) =>
                            news.id === item.id ? { ...news, hidden: !news.hidden } : news
                          ),
                        }))}
                        className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700"
                      >
                        {item.hidden ? "Mostrar" : "Ocultar"}
                      </button>
                      <button
                        onClick={() => deleteNews(item)}
                        className="rounded-md border border-red-200 px-3 py-1 text-sm text-red-700"
                      >
                        Eliminar
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {activeTab === "social" && (
            <div className="grid gap-4">
              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Instagram, una URL por línea</span>
                <textarea
                  value={socialText.instagram}
                  onChange={(event) => updateDraft((current) => ({
                    ...current,
                    socialPosts: { ...current.socialPosts, instagram: splitLines(event.target.value) },
                  }))}
                  rows={4}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-gray-700">TikTok, una URL por línea</span>
                <textarea
                  value={socialText.tiktok}
                  onChange={(event) => updateDraft((current) => ({
                    ...current,
                    socialPosts: { ...current.socialPosts, tiktok: splitLines(event.target.value) },
                  }))}
                  rows={4}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-gray-700">YouTube, una URL por línea</span>
                <textarea
                  value={socialText.youtube}
                  onChange={(event) => updateDraft((current) => ({
                    ...current,
                    socialPosts: {
                      ...current.socialPosts,
                      youtube: splitLines(event.target.value).map((line) => ({
                        id: extractYouTubeId(line),
                        title: extractYouTubeId(line),
                        url: line,
                      })),
                    },
                  }))}
                  rows={4}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-gray-700">LinkedIn, una URL por línea</span>
                <textarea
                  value={socialText.linkedin}
                  onChange={(event) => updateDraft((current) => ({
                    ...current,
                    socialPosts: {
                      ...current.socialPosts,
                      linkedin: splitLines(event.target.value).map((line) => ({ embedUrl: line, postUrl: line })),
                    },
                  }))}
                  rows={4}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </label>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Admin;
