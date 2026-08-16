import React, { useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogleDrive } from '@fortawesome/free-brands-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { AnimatePresence, motion } from 'framer-motion';
import VerticalCarousel from '../components/VerticalCarousel';
import SEOHelmet from '../components/SEOHelmet';
import PhotoAnnouncementModal from '../components/PhotoAnnouncementModal';
import { useSiteContent } from '../context/SiteContentContext';
import { buildGoogleDriveEmbedUrl, buildGoogleDriveFolderUrl } from '../utils/googleDrive';

const Photos = () => {
  const { content, loading } = useSiteContent();
  const { ref: googleDriveRef, inView: googleDriveInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const [showModal, setShowModal] = useState(true);
  const [isFolderMenuOpen, setIsFolderMenuOpen] = useState(false);
  const visibleDriveFolders = useMemo(
    () => (content.photos.driveFolders || []).filter((folder) => !folder.hidden),
    [content.photos.driveFolders]
  );
  const [selectedFolderId, setSelectedFolderId] = useState("");
  const selectedFolder = visibleDriveFolders.find((folder) => folder.id === selectedFolderId) || visibleDriveFolders[0];
  const googleDriveLink = buildGoogleDriveEmbedUrl(selectedFolder?.previewUrl || selectedFolder?.folderUrl || content.photos.embedUrl);
  const googleDriveGeneralLink = buildGoogleDriveFolderUrl(selectedFolder?.folderUrl || content.photos.galleryUrl);

  useEffect(() => {
    if (!visibleDriveFolders.length) {
      setSelectedFolderId("");
      return;
    }

    if (!visibleDriveFolders.some((folder) => folder.id === selectedFolderId)) {
      setSelectedFolderId(visibleDriveFolders[0].id);
    }
  }, [selectedFolderId, visibleDriveFolders]);

  return (
    <div className="min-h-screen bg-white">
      <SEOHelmet 
        title="Galería de Fotos - Modelo ONU La Plata" 
        description="Explora los momentos destacados de nuestros simulacros educativos en la galería de fotos del Modelo ONU La Plata."
        url="https://acserp.org.ar/fotos"
        image="https://acserp.org.ar/og-image.png"
      />

      <PhotoAnnouncementModal
        isOpen={!loading && showModal && content.photos.popup?.enabled}
        onClose={() => setShowModal(false)}
        title={content.photos.popup?.title}
        subtitle={content.photos.popup?.subtitle}
        buttonUrl={content.photos.popup?.buttonUrl}
      />

      <div className="text-center py-12 bg-indigo-950">
        <h1 className="text-white text-4xl font-bold">Galería de Fotos</h1>
        <p className="text-indigo-300 text-lg mt-2">Momentos destacados de nuestros simulacros educativos</p>
      </div>

      <VerticalCarousel sections={content.photos.carouselSections || []} />

      <div
        ref={googleDriveRef}
        className={`w-full px-4 py-12 text-center transition-opacity duration-1000 ${googleDriveInView ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="mb-6 flex flex-col items-center gap-4">
          <h2 className="flex flex-row items-center justify-center text-3xl font-bold text-blue-950">
            <FontAwesomeIcon icon={faGoogleDrive} className="mr-3 text-blue-600" style={{ fontSize: '32px' }} />
            Galería de fotos
          </h2>

          {visibleDriveFolders.length > 0 && (
            <div className="relative w-full max-w-xl">
              <button
                type="button"
                onClick={() => setIsFolderMenuOpen((current) => !current)}
                className="flex w-full items-center justify-between gap-4 rounded-lg border-2 border-indigo-200 bg-white px-5 py-3 text-left text-lg font-semibold text-blue-950 shadow-md transition duration-300 hover:border-indigo-400 focus:border-blue-950 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                aria-haspopup="listbox"
                aria-expanded={isFolderMenuOpen}
              >
                <span className="min-w-0 flex-1 truncate text-center">{selectedFolder?.title}</span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`flex-shrink-0 text-indigo-500 transition-transform duration-300 ${isFolderMenuOpen ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {isFolderMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 8, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute left-0 right-0 top-full z-20 overflow-hidden rounded-lg border border-indigo-100 bg-white text-left shadow-2xl ring-1 ring-blue-950/5"
                    role="listbox"
                  >
                    {visibleDriveFolders.map((folder) => {
                      const isSelected = selectedFolder?.id === folder.id;

                      return (
                        <button
                          key={folder.id}
                          type="button"
                          onClick={() => {
                            setSelectedFolderId(folder.id);
                            setIsFolderMenuOpen(false);
                          }}
                          className={`block w-full px-5 py-3 text-left font-semibold transition duration-200 ${
                            isSelected
                              ? "bg-blue-950 text-white"
                              : "text-blue-950 hover:bg-indigo-50"
                          }`}
                          role="option"
                          aria-selected={isSelected}
                        >
                          {folder.title}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {visibleDriveFolders.length > 0 ? (
          <>
            <div className="bg-[#e0e0f8] rounded-lg shadow-lg p-4 mb-4 transition duration-300">
              <iframe
                src={googleDriveLink}
                title={selectedFolder?.title || "Google Drive Photos"}
                width="100%"
                height="300"
                className="rounded-lg"
                frameBorder="0"
              />
            </div>

            <div className="mt-8 flex justify-center">
              <a
                href={googleDriveGeneralLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 text-lg font-semibold text-white bg-[#787ac1] rounded-md transition duration-300 ease-in-out transform hover:bg-blue-950 hover:scale-105 hover:shadow-xl"
              >
                <FontAwesomeIcon icon={faGoogleDrive} className="mr-2" style={{ fontSize: '24px' }} />
                Acceder a la galería completa
              </a>
            </div>
          </>
        ) : (
          <p className="rounded-lg bg-indigo-50 px-4 py-6 text-blue-950">No hay carpetas de fotos visibles.</p>
        )}
      </div>
    </div>
  );
};

export default Photos;
