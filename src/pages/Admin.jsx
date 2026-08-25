import React, { useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured } from "../lib/supabaseClient";
import { contentService, isAdminDemoEnabled } from "../services/contentService";
import { useSiteContent } from "../context/SiteContentContext";
import newsData from "../assets/noticias/newsData";
import { getNewsDateInputValue, mergeManagedNews } from "../utils/newsContent";
import FileUploadControl from "../components/admin/FileUploadControl";
import {
  MAX_ASSET_UPLOAD_SIZE,
  createEmptyNewsForm,
  extractImagePalette,
  extractYouTubeId,
  formatAdminDate,
  formatAssetName,
  formatFileSize,
  getVerticalDropIndex,
  hexToRgb,
  normalizeHex,
  prepareAdminDraft,
  readDraggedIndex,
  reorderItems,
  rgbToHex,
  sortNewsByDateDesc,
  splitLines,
} from "../utils/adminContent";

const tabs = [
  { id: "news", label: "Noticias" },
  { id: "stats", label: "Datos" },
  { id: "organs", label: "Órganos" },
  { id: "resources", label: "Recursos" },
  { id: "photos", label: "Fotos" },
  { id: "donations", label: "Donar" },
  { id: "social", label: "Redes" },
];

const Admin = () => {
  const { content, refreshContent } = useSiteContent();
  const [activeTab, setActiveTab] = useState("news");
  const [draft, setDraft] = useState(content);
  const [session, setSession] = useState(null);
  const [sessionResolved, setSessionResolved] = useState(false);
  const [draftRevision, setDraftRevision] = useState(null);
  const [draftLoading, setDraftLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [newsForm, setNewsForm] = useState(createEmptyNewsForm);
  const [editingNewsId, setEditingNewsId] = useState(null);
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
    if (!session) setDraft(prepareAdminDraft(content));
  }, [content, session]);

  useEffect(() => {
    let active = true;
    contentService.getSession()
      .then((nextSession) => { if (active) setSession(nextSession); })
      .catch(() => { if (active) setSession(null); })
      .finally(() => { if (active) setSessionResolved(true); });
    const unsubscribe = contentService.onAuthStateChange((nextSession) => {
      if (active) setSession(nextSession);
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session) return;
    let active = true;
    setDraftLoading(true);
    contentService.getAdminContent()
      .then(({ content: adminContent, updatedAt }) => {
        if (!active) return;
        setDraft(prepareAdminDraft(adminContent));
        setDraftRevision(updatedAt);
      })
      .catch((error) => { if (active) setStatus(error.message || "No se pudo cargar el borrador."); })
      .finally(() => { if (active) setDraftLoading(false); });
    return () => { active = false; };
  }, [session]);

  const socialText = useMemo(() => ({
    instagram: draft.socialPosts.instagram.join("\n"),
    tiktok: draft.socialPosts.tiktok.join("\n"),
    youtube: draft.socialPosts.youtube.map((video) => video.url || `https://www.youtube.com/watch?v=${video.id}`).join("\n"),
    linkedin: draft.socialPosts.linkedin.map((post) => post.postUrl || post.embedUrl).join("\n"),
  }), [draft.socialPosts]);
  const editableNews = useMemo(() => mergeManagedNews(newsData, draft.adminNews), [draft.adminNews]);

  const updateDraft = setDraft;

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
      const saved = await contentService.saveContent(draft, draftRevision);
      setDraft(prepareAdminDraft(saved.content));
      setDraftRevision(saved.updatedAt);
      await refreshContent().catch(() => {});
      const cleanupFailed = await contentService.commitPendingAssets(saved.content)
        .then(() => false)
        .catch(() => true);
      if (cleanupFailed) {
        setStatus("Cambios guardados. Algunos archivos temporales no pudieron limpiarse y se reintentará más adelante.");
        return;
      }
      setStatus(isSupabaseConfigured ? "Cambios guardados en Supabase." : "Cambios guardados localmente.");
    } catch (error) {
      setStatus(error.message || "No se pudieron guardar los cambios.");
    }
  };

  const handleLogout = async () => {
    await contentService.discardPendingAssets().catch(() => {});
    await contentService.signOut();
    setSession(null);
  };

  const handleDiscardChanges = async () => {
    const confirmed = window.confirm("¿Descartar los cambios no guardados y volver al contenido publicado actualmente?");
    if (!confirmed) return;

    setStatus("Descartando cambios...");
    await contentService.discardPendingAssets();
    const { content: adminContent, updatedAt } = await contentService.getAdminContent();
    setDraft(prepareAdminDraft(adminContent));
    setDraftRevision(updatedAt);
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

  const handleNewsImageFile = async (event, field = "img") => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingAsset(`news-${field}`);
    setStatus("Subiendo imagen de noticia...");
    try {
      const publicUrl = await contentService.uploadAsset(file, "news");
      setNewsForm((current) => ({ ...current, [field]: publicUrl }));
      setStatus("Imagen de noticia subida.");
    } catch (error) {
      setStatus(error.message || "No se pudo subir la imagen de noticia.");
    } finally {
      setUploadingAsset("");
      event.target.value = "";
    }
  };

  const handleAdditionalNewsImageFile = async (event, imageIndex) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingAsset(`news-additional-${imageIndex}`);
    setStatus("Subiendo imagen adicional...");
    try {
      const publicUrl = await contentService.uploadAsset(file, "news/additional");
      setNewsForm((current) => ({
        ...current,
        additionalImages: current.additionalImages.map((image, index) =>
          index === imageIndex ? { ...image, url: publicUrl } : image
        ),
      }));
      setStatus("Imagen adicional subida.");
    } catch (error) {
      setStatus(error.message || "No se pudo subir la imagen adicional.");
    } finally {
      setUploadingAsset("");
      event.target.value = "";
    }
  };

  const handleCarouselImageFiles = async (event, sectionIndex) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;
    const oversizedFiles = files.filter((file) => file.size > MAX_ASSET_UPLOAD_SIZE);

    if (oversizedFiles.length > 0) {
      setStatus(`No se subieron fotos. El máximo por archivo es ${formatFileSize(MAX_ASSET_UPLOAD_SIZE)}: ${oversizedFiles.map((file) => file.name).join(", ")}`);
      event.target.value = "";
      return;
    }

    setUploadingAsset(`carousel-images-${sectionIndex}`);
    setStatus("Subiendo fotos del carousel...");
    try {
      const section = draft.photos.carouselSections[sectionIndex];
      const uploadedImages = await Promise.all(files.map(async (file) => {
        const publicUrl = await contentService.uploadAsset(file, `photos/carousel/${section?.id || "section"}`);
        return {
          src: publicUrl,
          alt: file.name.replace(/\.[^/.]+$/, ""),
          fileName: file.name,
        };
      }));

      updateDraft((current) => ({
        ...current,
        photos: {
          ...current.photos,
          carouselSections: current.photos.carouselSections.map((currentSection, currentIndex) =>
            currentIndex === sectionIndex
              ? {
                  ...currentSection,
                  images: [...(currentSection.images || []), ...uploadedImages],
                }
              : currentSection
          ),
        },
      }));
      setStatus("Fotos subidas. Guardá los cambios para publicarlas.");
    } catch (error) {
      setStatus(error.message || "No se pudieron subir las fotos.");
    } finally {
      setUploadingAsset("");
      event.target.value = "";
    }
  };

  const deleteCarouselImage = (sectionIndex, imageIndex) => {
    const image = draft.photos.carouselSections[sectionIndex]?.images?.[imageIndex];
    const imageName = image?.fileName || image?.alt || formatAssetName(image?.src);
    const confirmed = window.confirm(`¿Eliminar la foto "${imageName || "seleccionada"}"? Esta acción se aplicará cuando guardes los cambios.`);
    if (!confirmed) return;

    updateDraft((current) => ({
      ...current,
      photos: {
        ...current.photos,
        carouselSections: current.photos.carouselSections.map((section, currentIndex) =>
          currentIndex === sectionIndex
            ? {
                ...section,
                images: (section.images || []).filter((_, currentImageIndex) => currentImageIndex !== imageIndex),
              }
            : section
        ),
      },
    }));
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

    updateDraft((current) => ({ ...current, organs: reorderItems(current.organs, fromIndex, toIndex) }));
    setDraggedOrganIndex(null);
    setDropIndicatorIndex(null);
  };

  const getDraggedIndex = (event) => {
    return readDraggedIndex(event, draggedOrganIndex);
  };

  const handleOrganDrop = (event, toIndex) => {
    event.preventDefault();
    event.stopPropagation();
    moveOrgan(getDraggedIndex(event), toIndex);
  };

  const updateDropIndicator = (event, index) => {
    if (draggedOrganIndex === null) return;
    setDropIndicatorIndex(getVerticalDropIndex(event, index));
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
    const isLegacyNews = newsData.some((news) => String(news.id) === String(newsItem.id));

    updateDraft((current) => ({
      ...current,
      adminNews: isLegacyNews
        ? [
            { ...newsItem, hidden: true },
            ...current.adminNews.filter((news) => String(news.id) !== String(newsItem.id)),
          ]
        : current.adminNews.filter((news) => String(news.id) !== String(newsItem.id)),
    }));
  };

  const toggleNewsVisibility = (newsItem) => {
    updateDraft((current) => ({
      ...current,
      adminNews: [
        { ...newsItem, hidden: !newsItem.hidden },
        ...current.adminNews.filter((news) => String(news.id) !== String(newsItem.id)),
      ],
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

    updateDraft((current) => ({
      ...current,
      photos: { ...current.photos, carouselSections: reorderItems(current.photos.carouselSections, fromIndex, toIndex) },
    }));
    setDraggedCarouselSectionIndex(null);
    setCarouselSectionDropIndex(null);
  };

  const getDraggedCarouselSectionIndex = (event) => {
    return readDraggedIndex(event, draggedCarouselSectionIndex);
  };

  const handleCarouselSectionDrop = (event, toIndex) => {
    event.preventDefault();
    event.stopPropagation();
    moveCarouselSection(getDraggedCarouselSectionIndex(event), toIndex);
  };

  const updateCarouselSectionDropIndicator = (event, index) => {
    if (draggedCarouselSectionIndex === null) return;
    setCarouselSectionDropIndex(getVerticalDropIndex(event, index));
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

    updateDraft((current) => ({
      ...current,
      photos: { ...current.photos, driveFolders: reorderItems(current.photos.driveFolders, fromIndex, toIndex) },
    }));
    setDraggedPhotoFolderIndex(null);
    setPhotoFolderDropIndex(null);
  };

  const getDraggedPhotoFolderIndex = (event) => {
    return readDraggedIndex(event, draggedPhotoFolderIndex);
  };

  const handlePhotoFolderDrop = (event, toIndex) => {
    event.preventDefault();
    event.stopPropagation();
    moveDriveFolder(getDraggedPhotoFolderIndex(event), toIndex);
  };

  const updatePhotoFolderDropIndicator = (event, index) => {
    if (draggedPhotoFolderIndex === null) return;
    setPhotoFolderDropIndex(getVerticalDropIndex(event, index));
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

    updateDraft((current) => ({
      ...current,
      links: { ...current.links, additionalResources: reorderItems(current.links.additionalResources, fromIndex, toIndex) },
    }));
    setDraggedResourceIndex(null);
    setResourceDropIndex(null);
  };

  const getDraggedResourceIndex = (event) => {
    return readDraggedIndex(event, draggedResourceIndex);
  };

  const handleResourceDrop = (event, toIndex) => {
    event.preventDefault();
    event.stopPropagation();
    moveResource(getDraggedResourceIndex(event), toIndex);
  };

  const updateResourceDropIndicator = (event, index) => {
    if (draggedResourceIndex === null) return;
    setResourceDropIndex(getVerticalDropIndex(event, index));
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
          topicLink: "#",
          hidden: false,
        },
      ],
    }));
    setStatus("Órgano agregado al borrador. Editalo y guardá los cambios.");
  };

  const resetNewsForm = () => {
    setNewsForm(createEmptyNewsForm());
    setEditingNewsId(null);
  };

  const startEditingNews = (newsItem) => {
    setEditingNewsId(newsItem.id);
    setNewsForm({
      title: newsItem.title || "",
      summary: newsItem.summary || "",
      content: newsItem.content || "",
      date: getNewsDateInputValue(newsItem.date),
      img: newsItem.img || "",
      headerImg: newsItem.headerImg || "",
      headerImgDescription: newsItem.headerImgDescription || "",
      carouselImg: newsItem.carouselImg || "",
      additionalImages: (newsItem.additionalImages || []).map((image, index) => ({
        url: image.url || "",
        description: image.description || "",
        insertAfterParagraph: image.insertAfterParagraph || index + 2,
      })),
      videoUrl: newsItem.videoUrl || (newsItem.youtubeId ? `https://www.youtube.com/watch?v=${newsItem.youtubeId}` : ""),
      youtubeId: newsItem.youtubeId || extractYouTubeId(newsItem.videoUrl || ""),
      hidden: Boolean(newsItem.hidden),
    });
    setStatus(`Editando noticia "${newsItem.title}".`);
  };

  const updateAdditionalNewsImage = (index, field, value) => {
    setNewsForm((current) => ({
      ...current,
      additionalImages: current.additionalImages.map((image, imageIndex) =>
        imageIndex === index ? { ...image, [field]: value } : image
      ),
    }));
  };

  const addAdditionalNewsImage = () => {
    setNewsForm((current) => ({
      ...current,
      additionalImages: [
        ...current.additionalImages,
        { url: "", description: "", insertAfterParagraph: current.additionalImages.length + 2 },
      ],
    }));
  };

  const deleteAdditionalNewsImage = (index) => {
    const confirmed = window.confirm("¿Eliminar esta imagen adicional de la noticia?");
    if (!confirmed) return;

    setNewsForm((current) => ({
      ...current,
      additionalImages: current.additionalImages.filter((_, imageIndex) => imageIndex !== index),
    }));
  };

  const saveNews = () => {
    if (!newsForm.title || !newsForm.summary || !newsForm.content || !newsForm.img) {
      setStatus("Completá título, bajada, contenido y miniatura.");
      return;
    }

    const id = editingNewsId || `admin-${Date.now()}`;
    const nextNews = {
      id,
      title: newsForm.title,
      summary: newsForm.summary,
      content: newsForm.content,
      date: formatAdminDate(newsForm.date),
      img: newsForm.img,
      headerImg: newsForm.headerImg || newsForm.img,
      headerImgDescription: newsForm.headerImgDescription,
      carouselImg: newsForm.carouselImg || newsForm.img,
      additionalImages: newsForm.additionalImages
        .filter((image) => image.url)
        .map((image, index) => ({
          ...image,
          insertAfterParagraph: Number(image.insertAfterParagraph) || index + 2,
        })),
      youtubeId: newsForm.youtubeId || extractYouTubeId(newsForm.videoUrl || ""),
      hidden: newsForm.hidden,
    };

    updateDraft((current) => ({
      ...current,
      adminNews: [
        nextNews,
        ...current.adminNews.filter((news) => String(news.id) !== String(id)),
      ],
    }));

    resetNewsForm();
    setStatus(editingNewsId ? "Noticia editada en el borrador. Guardá para publicarla." : "Noticia agregada al borrador. Guardá para publicarla.");
  };

  if (!sessionResolved) {
    return <main className="min-h-screen bg-slate-100" aria-label="Verificando sesión de administrador" />;
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-16">
        <section className="mx-auto max-w-md rounded-lg bg-white p-8 shadow">
          <h1 className="mb-2 text-3xl font-bold text-blue-950">Admin ACSERP</h1>
          <p className="mb-6 text-sm text-gray-600">
            {isSupabaseConfigured
              ? "Ingresá con un usuario administrador de Supabase."
              : isAdminDemoEnabled
                ? "Modo demo local habilitado: ingresá cualquier email para probar el panel."
                : "El panel está bloqueado hasta configurar Supabase."}
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
              disabled={!isSupabaseConfigured && !isAdminDemoEnabled}
            />
            <button disabled={!isSupabaseConfigured && !isAdminDemoEnabled} className="w-full rounded-md bg-blue-950 px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
              Entrar
            </button>
          </form>
          {status && <p className="mt-4 text-sm text-blue-900">{status}</p>}
        </section>
      </main>
    );
  }

  if (draftLoading) {
    return <main className="min-h-screen bg-slate-100" aria-label="Cargando contenido administrativo" />;
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
                        <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div className="flex min-w-0 flex-1 items-center gap-3">
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
                            <div className="min-w-0">
                              <h3 className="break-words text-sm font-bold text-blue-950">{resource.title || "Sin título"}</h3>
                              {resource.hidden && <span className="mt-1 inline-block rounded bg-amber-200 px-2 py-0.5 text-xs font-semibold text-amber-900">Oculto</span>}
                            </div>
                          </div>
                          <div className="flex flex-shrink-0 flex-wrap gap-2 md:max-w-[430px] md:justify-end">
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
                                <h3 className="break-words text-sm font-bold text-blue-950">{section.title || "Sin título"}</h3>
                                <p className="text-xs text-gray-500">
                                  {(section.images || []).length} foto{(section.images || []).length === 1 ? "" : "s"} cargada{(section.images || []).length === 1 ? "" : "s"}
                                </p>
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
                              <label className="block md:col-span-2">
                                <span className="text-sm font-semibold text-gray-700">Fotos del carousel</span>
                                <FileUploadControl
                                  id={`carousel-images-${section.id || index}`}
                                  multiple
                                  onChange={(event) => handleCarouselImageFiles(event, index)}
                                  buttonText="Agregar fotos"
                                  currentText={`${(section.images || []).length} foto${(section.images || []).length === 1 ? "" : "s"} cargada${(section.images || []).length === 1 ? "" : "s"}`}
                                  helpText={`Subí una selección de fotos. La página las mostrará de a una, alternando automáticamente. Máximo ${formatFileSize(MAX_ASSET_UPLOAD_SIZE)} por foto.`}
                                  isUploading={uploadingAsset === `carousel-images-${index}`}
                                />
                              </label>
                              {(section.images || []).length > 0 && (
                                <div className="md:col-span-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                  {(section.images || []).map((image, imageIndex) => (
                                    <div key={`${image.src}-${imageIndex}`} className="rounded-md border border-gray-200 bg-white p-3">
                                      <img
                                        src={image.src}
                                        alt={image.alt || section.title}
                                        className="h-28 w-full rounded-md object-cover"
                                      />
                                      <div className="mt-2 flex items-start justify-between gap-2">
                                        <p className="min-w-0 break-words text-xs text-gray-600">
                                          {image.fileName || image.alt || formatAssetName(image.src)}
                                        </p>
                                        <button
                                          type="button"
                                          onClick={() => deleteCarouselImage(index, imageIndex)}
                                          className="flex-shrink-0 rounded-md border border-red-200 px-2 py-1 text-xs text-red-700"
                                        >
                                          Eliminar foto
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
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
                                <h3 className="break-words text-sm font-bold text-blue-950">{folder.title || "Sin título"}</h3>
                                {folder.hidden && <span className="mt-1 inline-block rounded bg-amber-200 px-2 py-0.5 text-xs font-semibold text-amber-900">Oculta</span>}
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
                        <h3 className="break-words text-sm font-bold text-blue-950">{organ.shortName || organ.name || "Sin nombre"}</h3>
                        <p className="text-xs text-gray-500">{organ.id || "Sin abreviación"}</p>
                        {organ.hidden && <span className="mt-1 inline-block rounded bg-amber-200 px-2 py-0.5 text-xs font-semibold text-amber-900">Oculto</span>}
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
                      <FileUploadControl
                        id={`organ-logo-${organ.id || index}`}
                        onChange={(event) => handleLogoFile(event, index, "logoUrl")}
                        buttonText={organ.logoUrl ? "Cambiar logo" : "Subir logo"}
                        currentText={organ.logoUrl ? `Archivo actual: ${formatAssetName(organ.logoUrl)}` : "Sin archivo cargado"}
                        isUploading={uploadingAsset === `logoUrl-${index}`}
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-gray-700">Logo para tópicos ampliados</span>
                      <FileUploadControl
                        id={`organ-blank-logo-${organ.id || index}`}
                        onChange={(event) => handleLogoFile(event, index, "blankLogoUrl")}
                        buttonText={organ.blankLogoUrl ? "Cambiar logo" : "Subir logo"}
                        currentText={organ.blankLogoUrl ? `Archivo actual: ${formatAssetName(organ.blankLogoUrl)}` : "Sin archivo cargado"}
                        isUploading={uploadingAsset === `blankLogoUrl-${index}`}
                      />
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
              <article className="rounded-lg border border-gray-200 p-4">
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-blue-950">{editingNewsId ? "Editar noticia" : "Crear noticia"}</h2>
                    <p className="text-sm text-gray-600">El contenido acepta texto plano o HTML para formatos especiales.</p>
                  </div>
                  {editingNewsId && (
                    <button type="button" onClick={resetNewsForm} className="w-fit rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700">
                      Cancelar edición
                    </button>
                  )}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-gray-700">Título</span>
                    <input value={newsForm.title} onChange={(event) => setNewsForm({ ...newsForm, title: event.target.value })} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-gray-700">Fecha</span>
                    <input type="date" value={newsForm.date} onChange={(event) => setNewsForm({ ...newsForm, date: event.target.value })} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-gray-700">Imagen para carousel principal</span>
                    <input value={newsForm.carouselImg} onChange={(event) => setNewsForm({ ...newsForm, carouselImg: event.target.value })} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" placeholder="Si se deja vacío, usa la miniatura" />
                    <FileUploadControl
                      id="news-carousel-upload"
                      onChange={(event) => handleNewsImageFile(event, "carouselImg")}
                      buttonText={newsForm.carouselImg ? "Cambiar imagen" : "Subir imagen"}
                      currentText={newsForm.carouselImg ? `Archivo actual: ${formatAssetName(newsForm.carouselImg)}` : "Usa la miniatura si queda vacío"}
                      isUploading={uploadingAsset === "news-carouselImg"}
                    />
                  </label>
                  <label className="block md:col-span-2">
                    <span className="text-sm font-semibold text-gray-700">Bajada / resumen</span>
                    <textarea value={newsForm.summary} onChange={(event) => setNewsForm({ ...newsForm, summary: event.target.value })} rows={3} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-gray-700">Miniatura</span>
                    <input value={newsForm.img} onChange={(event) => setNewsForm({ ...newsForm, img: event.target.value })} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" placeholder="URL de imagen para cards/listados" />
                    <FileUploadControl
                      id="news-thumbnail-upload"
                      onChange={(event) => handleNewsImageFile(event, "img")}
                      buttonText={newsForm.img ? "Cambiar miniatura" : "Subir miniatura"}
                      currentText={newsForm.img ? `Archivo actual: ${formatAssetName(newsForm.img)}` : "Sin archivo cargado"}
                      isUploading={uploadingAsset === "news-img"}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-gray-700">Imagen de encabezado</span>
                    <input value={newsForm.headerImg} onChange={(event) => setNewsForm({ ...newsForm, headerImg: event.target.value })} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" placeholder="Si se deja vacío, usa la miniatura" />
                    <FileUploadControl
                      id="news-header-upload"
                      onChange={(event) => handleNewsImageFile(event, "headerImg")}
                      buttonText={newsForm.headerImg ? "Cambiar encabezado" : "Subir encabezado"}
                      currentText={newsForm.headerImg ? `Archivo actual: ${formatAssetName(newsForm.headerImg)}` : "Usa la miniatura si queda vacío"}
                      isUploading={uploadingAsset === "news-headerImg"}
                    />
                  </label>
                  <label className="block md:col-span-2">
                    <span className="text-sm font-semibold text-gray-700">Descripción / epígrafe de la imagen de encabezado</span>
                    <input
                      value={newsForm.headerImgDescription}
                      onChange={(event) => setNewsForm({ ...newsForm, headerImgDescription: event.target.value })}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="Opcional"
                    />
                  </label>
                  <label className="block md:col-span-2">
                    <span className="text-sm font-semibold text-gray-700">Contenido</span>
                    <textarea value={newsForm.content} onChange={(event) => setNewsForm({ ...newsForm, content: event.target.value })} rows={12} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm" placeholder="Texto plano o HTML" />
                    <span className="mt-1 block text-xs text-gray-500">En texto plano, cada Enter con texto crea un párrafo nuevo y la página agrega el espacio automáticamente. También podés pegar HTML para formatos especiales.</span>
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-gray-700">Video de YouTube</span>
                    <input
                      value={newsForm.videoUrl}
                      onChange={(event) => setNewsForm({ ...newsForm, videoUrl: event.target.value, youtubeId: extractYouTubeId(event.target.value) })}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="URL o ID del video"
                    />
                  </label>
                  <div className="md:col-span-2 rounded-md border border-gray-200 p-4">
                    <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="font-bold text-blue-950">Imágenes adicionales</h3>
                        <p className="text-sm text-gray-600">En texto plano se intercalan después del párrafo que indiques. En HTML se muestran al final.</p>
                      </div>
                      <button type="button" onClick={addAdditionalNewsImage} className="w-fit rounded-md bg-blue-950 px-3 py-1 text-sm font-semibold text-white">
                        Agregar imagen
                      </button>
                    </div>
                    <div className="grid gap-3">
                      {newsForm.additionalImages.map((image, index) => (
                        <article key={index} className="rounded-md border border-gray-200 p-3">
                          <div className="grid gap-3 md:grid-cols-2">
                            <label className="block">
                              <span className="text-sm font-semibold text-gray-700">URL de imagen</span>
                              <input value={image.url || ""} onChange={(event) => updateAdditionalNewsImage(index, "url", event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
                              <FileUploadControl
                                id={`news-additional-upload-${index}`}
                                onChange={(event) => handleAdditionalNewsImageFile(event, index)}
                                buttonText={image.url ? "Cambiar imagen" : "Subir imagen"}
                                currentText={image.url ? `Archivo actual: ${formatAssetName(image.url)}` : "Sin archivo cargado"}
                                isUploading={uploadingAsset === `news-additional-${index}`}
                              />
                            </label>
                            <label className="block">
                              <span className="text-sm font-semibold text-gray-700">Insertar después del párrafo</span>
                              <input
                                type="number"
                                min="1"
                                value={image.insertAfterParagraph || ""}
                                onChange={(event) => updateAdditionalNewsImage(index, "insertAfterParagraph", event.target.value)}
                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                              />
                              <span className="mt-1 block text-xs text-gray-500">Ejemplo: 2 muestra la imagen después del segundo párrafo.</span>
                            </label>
                            <label className="block md:col-span-2">
                              <span className="text-sm font-semibold text-gray-700">Descripción / epígrafe</span>
                              <input value={image.description || ""} onChange={(event) => updateAdditionalNewsImage(index, "description", event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
                            </label>
                          </div>
                          {image.url && <img src={image.url} alt="" className="mt-3 h-32 w-full rounded-md object-cover" />}
                          <button type="button" onClick={() => deleteAdditionalNewsImage(index)} className="mt-3 rounded-md border border-red-200 px-3 py-1 text-sm text-red-700">
                            Eliminar imagen
                          </button>
                        </article>
                      ))}
                    </div>
                  </div>
                  <label className="flex items-center gap-3 rounded-md bg-slate-50 px-3 py-2 md:col-span-2">
                    <input type="checkbox" checked={Boolean(newsForm.hidden)} onChange={(event) => setNewsForm({ ...newsForm, hidden: event.target.checked })} className="h-4 w-4" />
                    <span className="text-sm font-semibold text-gray-700">Ocultar noticia</span>
                  </label>
                  <button onClick={saveNews} className="w-fit rounded-md bg-blue-950 px-4 py-2 font-semibold text-white">
                    {editingNewsId ? "Guardar edición" : "Agregar noticia"}
                  </button>
                </div>
              </article>
              <div className="space-y-3">
                {sortNewsByDateDesc(editableNews).map((item) => (
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
                        onClick={() => startEditingNews(item)}
                        className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => toggleNewsVisibility(item)}
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
