import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogleDrive } from '@fortawesome/free-brands-svg-icons';
import VerticalCarousel from '../components/VerticalCarousel';
import SEOHelmet from '../components/SEOHelmet';
import PhotoAnnouncementModal from '../components/PhotoAnnouncementModal';

const Photos = () => {
  const { ref: googleDriveRef, inView: googleDriveInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const [showModal, setShowModal] = useState(true);
  const googleDriveLink = "https://drive.google.com/embeddedfolderview?id=1MBZn4nV7mB8i9KxA_Tiypgrsy9qXrkpk#grid";
  const googleDriveGeneralLink = "https://drive.google.com/drive/folders/1lUwofFDsJk68XDpKdA-3HrZAPSjKmOa6";
  const preparatoryLink = "https://drive.google.com/drive/folders/1-1_qQ-c_0ZBps9Sf1Fw-R_W7aDHM0hfr";

  return (
    <div className="min-h-screen bg-white">
      <SEOHelmet 
        title="Galería de Fotos - Modelo ONU La Plata" 
        description="Explora los momentos destacados de nuestros simulacros educativos en la galería de fotos del Modelo ONU La Plata."
        url="https://acserp.org.ar/fotos"
        image="https://acserp.org.ar/og-image.png"
      />

      <PhotoAnnouncementModal isOpen={showModal} onClose={() => setShowModal(false)} />

      <div className="text-center py-12 bg-indigo-950">
        <h1 className="text-white text-4xl font-bold">Galería de Fotos</h1>
        <p className="text-indigo-300 text-lg mt-2">Momentos destacados de nuestros simulacros educativos</p>
      </div>

      <VerticalCarousel sections={["apertura", "sesiones", "agasajo"]} /> 

      <div
        ref={googleDriveRef}
        className={`w-full px-4 py-12 text-center transition-opacity duration-1000 ${googleDriveInView ? 'opacity-100' : 'opacity-0'}`}
      >
        <h2 className="text-blue-950 text-3xl font-bold mb-6 flex flex-row justify-center items-center">
          <FontAwesomeIcon icon={faGoogleDrive} className="mr-3 text-blue-600" style={{ fontSize: '32px' }} />
          Fotos VII Edición del Modelo Público Más Grande del País
        </h2>

        <div className="bg-[#e0e0f8] rounded-lg shadow-lg p-4 mb-4">
          <iframe
            src={googleDriveLink}
            title="Google Drive Photos"
            width="100%"
            height="300"
            className="rounded-lg"
            frameBorder="0"
          />
        </div>

        <div className="mt-8 flex flex-col md:flex-row justify-center items-center gap-4">
          <a
            href={googleDriveGeneralLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 text-lg font-semibold text-white bg-[#787ac1] rounded-md transition duration-300 ease-in-out transform hover:bg-blue-950 hover:scale-105 hover:shadow-xl"
          >
            <FontAwesomeIcon icon={faGoogleDrive} className="mr-2" style={{ fontSize: '24px' }} />
            Acceder a la galería completa
          </a>

          <a
            href={preparatoryLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 text-lg font-semibold text-white bg-[#787ac1] rounded-md transition duration-300 ease-in-out transform hover:bg-blue-950 hover:scale-105 hover:shadow-xl"
          >
            <FontAwesomeIcon icon={faGoogleDrive} className="mr-2" style={{ fontSize: '24px' }} />
            Galería preparatorios 2025
          </a>
        </div>
      </div>
    </div>
  );
};

export default Photos;
