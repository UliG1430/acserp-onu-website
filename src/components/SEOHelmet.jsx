import React from "react";
import { Helmet } from "react-helmet-async";

const SEOHelmet = ({
  title = "Modelo ONU La Plata - VI Edición",
  description = "Somos la Asociación Civil Simulacros Educativos Río de La Plata - ¡Educación pública y gratuita!",
  url = "https://acserp.org.ar/",
  image = "https://acserp.org.ar/og-image.png",
}) => {
  const keywords =
    "modelo ONU, La Plata, simulacro educativo, Naciones Unidas, estudiantes, diplomacia, debate, VI Edición, acserp, ACSERP, ONU, onu";

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Ulises Geymonat" />
      <meta name="robots" content="index, follow" />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEOHelmet;
