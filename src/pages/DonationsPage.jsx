import React from "react";
import { useInView } from "react-intersection-observer";
import SEOHelmet from "../components/SEOHelmet";
import LazyImage from "../components/LazyImage";
import DonarOnlineIframe from "../components/DonarOnlineIframe"; 
import heroDonaciones from "../assets/images/image3.JPG";
import DonarOnlineWidget from "../components/DonarOnlineWidget";

const DonationsPage = () => {
  const donationLinks = [
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

  return (
    <section className="bg-white min-h-screen">
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
        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center">
          <h1 className="text-white text-4xl font-bold text-center px-4">
            ¡Hacé tu aporte al Modelo ONU más grande del país!
          </h1>
        </div>
      </div>

      {/* Nueva sección: Suscripción Donar Online */}
      <DonarOnlineWidget />

      {/* Sección clásica de donaciones únicas */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-blue-950 mb-10">
          Donaciones únicas vía MercadoPago
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {donationLinks.map((donation, index) => {
            const { ref, inView } = useInView({
              triggerOnce: true,
              threshold: 0.2,
            });

            return (
              <div
                key={index}
                ref={ref}
                className={`flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-lg transition-transform duration-500 ${
                  inView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                } hover:scale-105 hover:shadow-2xl`}
              >
                <h3 className="text-2xl font-semibold text-blue-950 mb-4">
                  {donation.label}
                </h3>
                <p className="text-gray-700 text-center mb-6">
                  {donation.description}
                </p>
                <a
                  href={donation.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 text-lg font-semibold text-white bg-blue-950 rounded-md transition duration-300 ease-in-out transform hover:bg-blue-800 hover:scale-105 hover:shadow-xl"
                >
                  Donar Ahora
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DonationsPage;
