import React from "react";
import { useParams } from "react-router-dom";
import newsData from "../assets/noticias/newsData";

const NewsDetail = () => {
  const { id } = useParams();
  const news = newsData.find((item) => item.id === parseInt(id)); // Busca la noticia por ID

  if (!news) {
    return (
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold text-red-600">Noticia no encontrada</h1>
        <p className="text-gray-700 mt-4">La noticia que buscas no está disponible.</p>
      </div>
    );
  }

  // Divide el contenido en párrafos
  const paragraphs = news.content.trim().split("\n").filter((p) => p);

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      {/* Encabezado */}
      <header className="mb-8">
        <h1 className="text-5xl font-bold text-blue-950 mb-4 leading-tight">{news.title}</h1>
        <p className="text-gray-500 text-sm">{news.date}</p>
      </header>

      {/* Imagen Principal */}
      <figure className="mb-12">
        <img
          src={news.img}
          alt={news.title}
          className="w-full h-auto rounded-lg shadow-lg"
        />
        <figcaption className="text-gray-500 text-sm mt-2 text-center">
          {news.imgDescription}
        </figcaption>
      </figure>

      {/* Contenido con Imágenes Adicionales Alternadas */}
      <section className="space-y-8">
        {paragraphs.map((paragraph, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            } items-start gap-4`}
          >
            {/* Párrafo de Texto */}
            <p className="text-lg leading-relaxed text-gray-800 flex-1">
              {paragraph}
            </p>

            {/* Imagen Adicional (si aplica) */}
            {news.additionalImages && news.additionalImages[index] && (
              <figure className="flex-shrink-0 w-full md:w-1/3">
                <img
                  src={news.additionalImages[index].url}
                  alt={`Imagen adicional ${index + 1}`}
                  className="w-full h-auto rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
                />
                <figcaption className="text-gray-600 text-sm mt-2 text-center">
                  {news.additionalImages[index].description}
                </figcaption>
              </figure>
            )}
          </div>
        ))}
      </section>

      {/* Botón Volver */}
      <div className="mt-16 text-center">
        <a
          href="/"
          className="inline-block px-6 py-3 bg-blue-950 text-white text-lg rounded-lg shadow-lg hover:bg-blue-800 transition-colors"
        >
          Volver a Inicio
        </a>
      </div>
    </div>
  );
};

export default NewsDetail;
