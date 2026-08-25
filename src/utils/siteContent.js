const splitTopicText = (topicText = "") => {
  const [title = "", ...subtitleLines] = String(topicText).split(/\r?\n/);
  return { topicTitle: title.trim(), topicSubtitle: subtitleLines.join("\n").trim() };
};

const normalizeOrgan = (organ) => {
  const legacyTopic = splitTopicText(organ.topicText);
  return {
    ...organ,
    topicTitle: organ.topicTitle ?? legacyTopic.topicTitle,
    topicSubtitle: organ.topicSubtitle ?? legacyTopic.topicSubtitle,
  };
};

const visibleItems = (items = []) => items.filter((item) => !item?.hidden);

export const mergeSiteContent = (base, overrides = {}) => {
  const photos = overrides.photos || {};
  const overrideLinks = overrides.links || {};

  return {
    ...base,
    ...overrides,
    stats: overrides.stats || base.stats,
    links: {
      ...base.links,
      ...overrideLinks,
      additionalResources: Array.isArray(overrideLinks.additionalResources)
        ? overrideLinks.additionalResources
        : base.links.additionalResources,
    },
    photos: {
      ...base.photos,
      ...photos,
      popup: { ...base.photos.popup, ...photos.popup },
      carouselSections: Array.isArray(photos.carouselSections) ? photos.carouselSections : base.photos.carouselSections,
      driveFolders: (Array.isArray(photos.driveFolders) ? photos.driveFolders : base.photos.driveFolders)
        .map((folder) => ({ ...folder, previewUrl: folder.previewUrl || folder.folderUrl || "" })),
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
    organs: (Array.isArray(overrides.organs) ? overrides.organs : base.organs).map(normalizeOrgan),
    socialPosts: { ...base.socialPosts, ...overrides.socialPosts },
    adminNews: Array.isArray(overrides.adminNews) ? overrides.adminNews : base.adminNews,
  };
};

export const toPublishedSiteContent = (content) => ({
  ...content,
  organs: visibleItems(content.organs),
  links: { ...content.links, additionalResources: visibleItems(content.links?.additionalResources) },
  photos: {
    ...content.photos,
    carouselSections: visibleItems(content.photos?.carouselSections),
    driveFolders: visibleItems(content.photos?.driveFolders),
  },
  donations: {
    ...content.donations,
    allocationItems: visibleItems(content.donations?.allocationItems),
    faqs: visibleItems(content.donations?.faqs),
  },
  adminNews: (content.adminNews || []).map((news) => (
    news.hidden ? { id: news.id, hidden: true } : news
  )),
});

export const collectAssetUrls = (value, urls = new Set()) => {
  if (typeof value === "string") {
    if (/^https?:\/\//i.test(value)) urls.add(value);
    return urls;
  }
  if (Array.isArray(value)) value.forEach((item) => collectAssetUrls(item, urls));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => collectAssetUrls(item, urls));
  return urls;
};
