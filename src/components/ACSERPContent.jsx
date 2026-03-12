import React from "react";
import { motion } from "framer-motion";
import { fadeLeft, fadeRight, headingVariants, viewport, ease } from "../utils/motion";
import img1 from "../assets/images/acserp1.webp";
import img2 from "../assets/images/acserp2.webp";
import img3 from "../assets/images/acserp3.webp";
import img8 from "../assets/images/acserp8.webp";

const secciones = [
  {
    year:   "2016 – 2017",
    titulo: "Los Primeros Pasos",
    imagen: img1,
    texto: [
      "En el año 2016, organizamos por primera vez un Modelo de Naciones Unidas intercolegial en la ciudad de La Plata, un simulacro educativo donde estudiantes secundarios asumen el rol de diplomáticos de la más importante organización internacional para dar solución a diversas problemáticas globales. Este contó con la participación de más de 400 estudiantes provenientes de 20 escuelas secundarias de la región.",
      'A partir de esa exitosa primera experiencia, en 2017 se duplicó la cantidad de estudiantes e instituciones educativas participantes, realizando así el simulacro educativo más grande de la historia de la ciudad, con sede en el Colegio Nacional "Rafael Hernández".',
    ],
  },
  {
    year:   "2018 – 2019",
    titulo: "Crecimiento Regional",
    imagen: img2,
    texto: [
      "A partir del año 2018, y dado el gran crecimiento de la actividad, mudamos la actividad a la monumental República de los Niños, para finalmente alcanzar nuestra mayor convocatoria en la cuarta edición del Modelo, contando con la participación de más de 1000 estudiantes y 50 colegios de La Plata y sus alrededores.",
      "Dicho año en particular contamos, por primera vez, con el gran apoyo institucional y logístico de la Municipalidad de La Plata, sumado al de la Legislatura Bonaerense.",
    ],
  },
  {
    year:   "2020 – 2021",
    titulo: "La Virtualidad y el Regreso",
    imagen: img3,
    texto: [
      'El año 2020 fue un año excepcional, y es por eso que asumimos el compromiso de pensar y diseñar una actividad que surja del seno de las problemáticas contemporáneas. La actividad propuesta se tituló "Cumbre Preparatoria 2020: Emergencia sanitaria COVID-19".',
      "Esta se llevó adelante mediante herramientas virtuales de educación a distancia, con el apoyo del Rectorado de la UNLP.",
      'En 2021 realizamos el "Modelo Intercolegial de Naciones Unidas de La Plata - Edición Virtual 2021", en formato híbrido con sesiones virtuales y actos presenciales, gracias al continuo apoyo municipal.',
    ],
  },
  {
    year:   "2022 – 2025",
    titulo: "Récords, Sedes y Proyección Nacional",
    imagen: img8,
    texto: [
      "Desde la quinta edición en adelante, el Modelo volvió a la República de los Niños, reafirmando su carácter emblemático, y alcanzando nuevos récords de participación en cada edición.",
      "Sumamos sedes como el Estadio Único Diego Armando Maradona para el Acto de Apertura, y el Pasaje Dardo Rocha para el Agasajo Diplomático.",
      "En 2025 rompimos nuestro propio récord con 2050 estudiantes y más de 80 colegios. El crecimiento y el impacto de nuestra propuesta educativa se reafirma año tras año gracias al compromiso de más de 130 jóvenes voluntarios y voluntarias.",
    ],
  },
];

const ACSERPContent = () => (
  <section className="w-full bg-white">
    {secciones.map((sec, i) => {
      const isEven   = i % 2 === 0;
      const textAnim = isEven ? fadeLeft : fadeRight;
      const imgAnim  = isEven ? fadeRight : fadeLeft;

      return (
        <div
          key={i}
          className={`py-20 px-6 md:px-12 ${isEven ? "bg-white" : "bg-slate-50"}`}
        >
          <div
            className={`max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-14
              ${!isEven ? "md:flex-row-reverse" : ""}`}
          >
            {/* Text */}
            <motion.div
              variants={textAnim}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="md:w-1/2 space-y-5"
            >
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-brand-600">
                {sec.year}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                {sec.titulo}
              </h2>
              {sec.texto.map((p, idx) => (
                <p key={idx} className="text-base text-gray-500 leading-relaxed">
                  {p}
                </p>
              ))}
            </motion.div>

            {/* Image */}
            <motion.div
              variants={imgAnim}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="md:w-1/2"
            >
              <motion.div
                whileHover={{ scale: 1.02, transition: { duration: 0.35, ease } }}
                className="overflow-hidden rounded-2xl shadow-brand"
              >
                <img
                  src={sec.imagen}
                  alt={sec.titulo}
                  className="w-full object-cover"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      );
    })}

    {/* Closing */}
    <div className="bg-brand-900 text-white text-center py-16 px-6">
      <p className="text-base sm:text-lg text-white/60 max-w-xl mx-auto leading-relaxed">
        Gracias por ser parte de este recorrido. Sigamos construyendo juntos.
      </p>
    </div>
  </section>
);

export default ACSERPContent;
