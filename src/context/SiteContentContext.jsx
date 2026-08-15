import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { defaultSiteContent } from "../data/siteContent";
import { contentService } from "../services/contentService";

const SiteContentContext = createContext(null);

export const SiteContentProvider = ({ children }) => {
  const [content, setContent] = useState(defaultSiteContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshContent = useCallback(async () => {
    try {
      setError("");
      const nextContent = await contentService.getContent();
      setContent(nextContent);
    } catch (err) {
      setError(err.message || "No se pudo cargar el contenido editable.");
    } finally {
      setLoading(false);
    }
  }, []);

  const saveContent = useCallback(async (nextContent) => {
    const saved = await contentService.saveContent(nextContent);
    setContent(saved);
    return saved;
  }, []);

  useEffect(() => {
    refreshContent();
  }, [refreshContent]);

  const value = useMemo(
    () => ({ content, loading, error, refreshContent, saveContent }),
    [content, loading, error, refreshContent, saveContent]
  );

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
};

export const useSiteContent = () => {
  const context = useContext(SiteContentContext);
  if (!context) throw new Error("useSiteContent debe usarse dentro de SiteContentProvider");
  return context;
};
