import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

const SocialMediaLink = ({ href, icon, text, link }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-transparent border border-white p-6 rounded-lg hover:shadow-lg hover:opacity-90 transition duration-300 ease-in-out transform hover:scale-105 mx-3 md:mx-0"
    >
      <i className={`fab ${icon} text-white text-5xl mb-4 transition-transform duration-300 ease-in-out transform hover:scale-125`} />
      <h3 className="text-white text-lg font-bold">{text}</h3>
      <p className="text-white text-sm">{link}</p>
    </a>
  );
};

const SocialMediaSection = () => {
  return (
    <div className="bg-[#61629b] py-12">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-white text-3xl font-bold mb-8">SEGUINOS EN</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <SocialMediaLink href="https://www.instagram.com/modeloonulp/?hl=es" icon="fa-instagram" text="INSTAGRAM" link="/modeloonulp" />
          <SocialMediaLink href="https://www.facebook.com/ModeloONU.LP" icon="fa-facebook-f" text="FACEBOOK" link="/ModeloONU.LP" />
          <SocialMediaLink href="https://x.com/modeloonulp" icon="fa-x-twitter" text="X" link="/modeloonulp" />
          <SocialMediaLink href="https://www.linkedin.com/in/simulacros-educativos-r%C3%ADo-de-la-plata-b45698230/?originalSubdomain=ar" icon="fa-linkedin-in" text="LINKEDIN" link="Simulacros Educativos Río de La Plata" />
          
 
          
        </div>
      </div>
    </div>
  );
};

export default SocialMediaSection;
