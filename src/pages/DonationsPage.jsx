// src/pages/DonationsPage.jsx
import React, { useState } from "react";
import { useInView } from "react-intersection-observer";
import SEOHelmet from "../components/SEOHelmet";
import LazyImage from "../components/LazyImage";
import heroDonaciones from "../assets/images/image3.JPG";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";

const mercadoPagoOptions = [
  {
    label: "Donar $2000",
    description: "Contribuí con $2000 y apoyá la educación gratuita, pública y de calidad.",
    url: "https://www.mercadopago.com.ar/checkout/v1/payment/redirect/?source=link&preference-id=1904693867-e2ca0481-63ed-4cb8-9ac0-9b716a07147c",
  },
  {
    label: "Donar $3000",
    description: "Contribuí con $3000 y apoyá la educación gratuita, pública y de calidad.",
    url: "https://www.mercadopago.com.ar/payment-link/v1/redirect?preference-id=1904693867-163a4a73-71a7-4d79-a859-58a20e22b842&source=link",
  },
  {
    label: "Donar $5000",
    description: "Contribuí con $5000 y apoyá la educación gratuita, pública y de calidad.",
    url: "https://www.mercadopago.com.ar/checkout/v1/payment/redirect/d1b6b4a2-e55a-4d4d-b16c-0d3647af1479/payment-option-form-v2/?source=link&preference-id=1904693867-dc50117b-876f-4873-bae0-706fe0ca73cc",
  },
  {
    label: "Donación Voluntaria",
    description: "Elegí el monto a voluntad y apoyá la educación gratuita, pública y de calidad.",
    url: "https://link.mercadopago.com.ar/acserp",
  },
];

const DonationsPage = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <section className="bg-blue-950 text-white min-h-screen">
      <SEOHelmet
        title="Donaciones - Modelo ONU La Plata"
        description="Contribuí al Modelo ONU La Plata y apoyá la educación pública y gratuita con tu donación."
      />

      {/* Hero */}
      <div className="relative w-full h-[50vh]">
        <LazyImage
          src={heroDonaciones}
          alt="Donaciones ONU Modelo"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-white text-4xl font-bold mb-4">
            ¡Hacé tu aporte al Modelo ONU más grande del país!
          </h1>
        </div>
      </div>

      {/* ¿Por qué donar? */}
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">¿Por qué donar?</h2>
        <p className="text-lg md:text-xl text-blue-100 leading-relaxed">
          Tu colaboración hace posible que miles de estudiantes de escuelas públicas y privadas de toda la región vivan una experiencia educativa transformadora. En la Asociación Civil Simulacros Educativos Río de la Plata trabajamos de forma ininterrumpida para defender una educación pública, gratuita, inclusiva y experimental, donde el pensamiento crítico, la cooperación internacional y la participación juvenil sean protagonistas. Cada donación es un gesto de confianza en este proyecto colectivo, construido desde el compromiso voluntario, que año tras año convoca a miles de jóvenes a debatir, investigar y construir soluciones para un mundo más justo.
        </p>
      </div>

      {/* Suscripción mensual - DonarOnline */}
      <div className="bg-blue-800 w-full py-12 px-4 text-center">
        <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">Donación mensual vía DonarOnline</h3>
        <p className="text-blue-100 max-w-3xl mx-auto mb-6">
          Esta opción funciona como una suscripción. Con tu aporte mensual ayudás a que el Modelo ONU público más grande del país siga creciendo.
        </p>
        <a
          href="https://donaronline.org/simulacros-educativos-rio-de-la-plata/la-actividad-educativa-publica-y-gratuita-mas-grande-de-argentina-te-necesita"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-blue-950 font-semibold text-lg px-8 py-3 rounded-full shadow-md hover:scale-105 hover:bg-blue-100 transition-transform duration-300 inline-block"
        >
          Donar con DonarOnline
        </a>
      </div>

      {/* MercadoPago */}
      <div className="bg-white text-blue-950 w-full py-16 px-4 text-center">
        <h3 className="text-2xl md:text-3xl font-bold mb-4">Donaciones únicas vía MercadoPago</h3>
        <p className="max-w-3xl mx-auto mb-6 text-gray-700">
          También podés colaborar de forma puntual con uno de los siguientes montos. Elegí la opción que prefieras.
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-6 py-3 text-lg font-semibold text-white bg-blue-950 rounded-full transition duration-300 ease-in-out transform hover:bg-blue-800 hover:scale-105 hover:shadow-xl"
        >
          <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
          Ver opciones de donación
        </button>
      </div>

      {/* Modal de MercadoPago */}
      {showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
    <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-xl transform transition-all duration-500 scale-95 opacity-0 animate-fade-in-up">
      <h3 className="text-2xl font-bold text-blue-950 mb-6 text-center">
        Elegí un monto para donar
      </h3>
      <div className="space-y-4">
  {mercadoPagoOptions.map((opt, index) => (
    <a
      key={index}
      href={opt.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block border border-blue-200 rounded-lg p-4 bg-white hover:shadow-lg hover:border-blue-500 transition duration-300"
    >
      <h4 className="font-semibold text-blue-950 text-lg mb-1">{opt.label}</h4>
      <p className="text-gray-600 text-sm">{opt.description}</p>
    </a>
  ))}
</div>

      <div className="text-center mt-8">
        <button
          onClick={() => setShowModal(false)}
          className="bg-blue-950 text-white px-6 py-2 rounded-full hover:bg-blue-800 transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
)}

    </section>
  );
};

export default DonationsPage;
