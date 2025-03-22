import React from "react";
import { motion } from "framer-motion"; // Importa framer-motion para animaciones
import img1 from "../assets/images/acserp1.jpeg";
import img2 from "../assets/images/acserp2.jpeg";
import img3 from "../assets/images/acserp3.jpeg";
import img8 from "../assets/images/acserp8.jpeg";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const ACSERPContent = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
   

        {/* Primer Bloque */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeIn}
        >
          <div>
            <p className="text-lg leading-relaxed text-gray-700">
              En el año 2016, organizamos por primera vez un Modelo de Naciones
              Unidas intercolegial en la ciudad de La Plata, un simulacro
              educativo donde estudiantes secundarios asumen el rol de
              diplomáticos de la más importante organización internacional para
              dar solución a diversas problemáticas globales. Este contó con la
              participación de más de 400 estudiantes provenientes de 20
              escuelas secundarias de la región.
            </p>
            <p className="text-lg leading-relaxed text-gray-700 mt-4">
              A partir de esa exitosa primera experiencia, en 2017 se duplicó la
              cantidad de estudiantes e instituciones educativas participantes,
              realizando así el simulacro educativo más grande de la historia
              de la ciudad, con sede en el Colegio Nacional “Rafael Hernández”.
            </p>
          </div>
          <motion.div
            className="overflow-hidden"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={img2}
              alt="Evento 2016"
              className="w-full rounded-lg shadow-lg hover:scale-105 transition-transform duration-500"
            />
          </motion.div>
        </motion.div>

        {/* Segundo Bloque */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeIn}
        >
          <motion.div
            className="overflow-hidden"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={img8}
              alt="República de los Niños"
              className="w-full rounded-lg shadow-lg hover:scale-105 transition-transform duration-500"
            />
          </motion.div>
          <div>
            <p className="text-lg leading-relaxed text-gray-700">
              A partir del año 2018, y dado el gran crecimiento de la actividad,
              mudamos la actividad a la monumental República de los Niños, para
              finalmente alcanzar nuestra mayor convocatoria en la cuarta
              edición del Modelo, contando con la participación de más de 1000
              estudiantes y 50 colegios de La Plata y sus alrededores.
            </p>
            <p className="text-lg leading-relaxed text-gray-700 mt-4">
              Dicho año en particular contamos, por primera vez, con el gran
              apoyo institucional y logístico de la Municipalidad de La Plata,
              sumado al de la Legislatura Bonaerense.
            </p>
          </div>
        </motion.div>

        {/* Tercer Bloque */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeIn}
        >
          <div>
            <p className="text-lg leading-relaxed text-gray-700">
              El año 2020 fue un año excepcional, y es por eso que asumimos el
              compromiso de pensar y diseñar una actividad que surja del seno de
              las problemáticas contemporáneas. La actividad propuesta se tituló
              “Cumbre Preparatoria 2020: Emergencia sanitaria COVID-19”, en la
              cual los estudiantes tuvieron que asumir el vertiginoso papel de
              gobernantes de las diferentes naciones de un mundo atacado por la
              pandemia.
            </p>
            <p className="text-lg leading-relaxed text-gray-700 mt-4">
              Esta se llevó adelante mediante herramientas virtuales de
              educación a distancia “Cursos Externos”, a la cual accedimos con
              el apoyo incondicional del Rectorado de la Universidad Nacional de
              La Plata.
            </p>
          </div>
          <motion.div
            className="overflow-hidden"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={img3}
              alt="Cumbre Preparatoria 2020"
              className="w-full rounded-lg shadow-lg hover:scale-105 transition-transform duration-500"
            />
          </motion.div>
        </motion.div>

        {/* Cuarto Bloque */}
        <motion.div
          className="text-lg leading-relaxed text-gray-700"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeIn}
        >
          <p className="mt-4">
            Es indudable entonces que nuestro proyecto ha comenzado a ocupar un
            lugar relevante en la agenda educativa platense, en el marco de una
            fuerte apuesta de nuestra organización por la educación
            experimental, interdisciplinaria, participativa, crítica, y, sobre
            todo, pública y gratuita.
          </p>
          <p className="mt-4">
            Asimismo, nos es grato mencionar que, con el correr de los años,
            hemos contado con la ayuda y colaboración de diversas instituciones
            de variada índole, como las ya mencionadas Municipalidad de La Plata
            y Universidad Nacional de La Plata.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ACSERPContent;
