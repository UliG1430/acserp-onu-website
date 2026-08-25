import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { defaultSiteContent } from "../data/siteContent";
import { contentService } from "../services/contentService";

const SiteContentContext = createContext(null);

export const SiteContentProvider = ({ children }) => {
  const [content, setContent] = useState(defaultSiteContent);
  const [loading, setLoading] = useState(true);

  const refreshContent = useCallback(async () => {
    try {
      const nextContent = await contentService.getContent();
      setContent(nextContent);
    } catch (error) {
      console.error("No se pudo cargar el contenido publicado:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshContent();
  }, [refreshContent]);

  const value = useMemo(
    () => ({ content, loading, refreshContent }),
    [content, loading, refreshContent]
  );

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
};

export const useSiteContent = () => {
  const context = useContext(SiteContentContext);
  if (!context) throw new Error("useSiteContent debe usarse dentro de SiteContentProvider");
  return context;
};
