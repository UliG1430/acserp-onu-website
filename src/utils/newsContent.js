import parseDate from "./parseDate";

export const mergeManagedNews = (baseNews = [], managedNews = []) => {
  const merged = new Map(baseNews.map((item) => [String(item.id), item]));

  managedNews.forEach((item) => {
    if (!item?.id) return;
    merged.set(String(item.id), {
      ...(merged.get(String(item.id)) || {}),
      ...item,
    });
  });

  return [...merged.values()];
};

export const getVisibleSortedNews = (baseNews = [], managedNews = []) =>
  mergeManagedNews(baseNews, managedNews)
    .filter((item) => !item.hidden)
    .sort((a, b) => parseDate(b.date) - parseDate(a.date));

export const getNewsDateInputValue = (dateValue = "") => {
  const parsedDate = parseDate(dateValue);
  if (Number.isNaN(parsedDate.getTime()) || parsedDate.getTime() === 0) {
    return new Date().toISOString().slice(0, 10);
  }

  return parsedDate.toISOString().slice(0, 10);
};
