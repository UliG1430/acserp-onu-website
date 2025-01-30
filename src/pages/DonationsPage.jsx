import React from "react";
import { useInView } from "react-intersection-observer";

const DonationsPage = () => {
  const donationLinks = [
    {
      label: "Donar $2000",
      description: "Contribuí con $2000 y apoyá la educacion gratuita, publica y de calidad.",
      url: "https://www.mercadopago.com.ar/checkout/v1/payment/redirect/?source=link&preference-id=1904693867-e2ca0481-63ed-4cb8-9ac0-9b716a07147c&router-request-id=c3029624-d8b0-493c-93be-40ed63daeab8",
    },
    {
      label: "Donar $3000",
      description: "Contribuí con $3000 y apoyá la educacion gratuita, publica y de calidad.",
      url: "https://www.mercadopago.com.ar/payment-link/v1/redirect?preference-id=1904693867-163a4a73-71a7-4d79-a859-58a20e22b842&source=link",
    },
    
    {
      label: "Donar $5000",
      description: "Contribuí con $5000 y apoyá la educacion gratuita, publica y de calidad.",
      url: "https://www.mercadopago.com.ar/checkout/v1/payment/redirect/d1b6b4a2-e55a-4d4d-b16c-0d3647af1479/payment-option-form-v2/?source=link&preference-id=1904693867-dc50117b-876f-4873-bae0-706fe0ca73cc&router-request-id=cdb25244-d49e-42b7-89cc-77e691342a8a&p=7254c06c0a2c45b31bdf5cad2db2adc1",
    },


    {
      label: "Donación Voluntaria",
      description: "Elige el monto a voluntad y apoyá la educacion gratuita, publica y de calidad.",
      url: "https://link.mercadopago.com.ar/acserp",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-blue-950 text-center mb-8">
        ¡Hacé tu aporte al Modelo ONU más grande del país!
        </h1>
        <p className="text-lg text-gray-700 text-center mb-12">
        </p>

        {/* Opciones de Donación */}
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
                className={`flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-lg transform transition-transform duration-500 ${
                  inView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                } hover:scale-105 hover:shadow-2xl`}
              >
                <h2 className="text-2xl font-semibold text-blue-950 mb-4">
                  {donation.label}
                </h2>
                <p className="text-gray-700 text-center mb-6">
                  {donation.description}
                </p>
                <a
                  href={donation.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 bg-blue-950 text-white font-bold rounded-md shadow hover:bg-blue-800 transition-colors duration-300"
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
