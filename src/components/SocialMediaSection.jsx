import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";


const SocialMediaSection = () => {
  return (
    <div className="bg-[#61629b] py-12">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-white text-3xl font-bold mb-8">SEGUINOS EN</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Instagram */}
          <a 
            href="https://www.instagram.com/modeloonulp/?hl=es" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-transparent border border-white p-6 rounded-lg hover:shadow-lg hover:opacity-90 transition duration-300 ease-in-out transform hover:scale-105"
          >
            <i className="fab fa-instagram text-white text-5xl mb-4 transition-transform duration-300 ease-in-out transform hover:scale-125"></i>
            <h3 className="text-white text-lg font-bold">INSTAGRAM</h3>
            <p className="text-white text-sm">/modeloonulp</p>
          </a>
          
          {/* Facebook */}
          <a 
            href="https://www.facebook.com/ModeloONU.LP" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-transparent border border-white p-6 rounded-lg hover:shadow-lg hover:opacity-90 transition duration-300 ease-in-out transform hover:scale-105"
          >
            <i className="fab fa-facebook-f text-white text-5xl mb-4 transition-transform duration-300 ease-in-out transform hover:scale-125"></i>
            <h3 className="text-white text-lg font-bold">FACEBOOK</h3>
            <p className="text-white text-sm">/ModeloONU.LP</p>
          </a>
          
          {/* Twitter */}
          <a 
            href="https://x.com/modeloonulp" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-transparent border border-white p-6 rounded-lg hover:shadow-lg hover:opacity-90 transition duration-300 ease-in-out transform hover:scale-105"
          >
            <i className="fab fa-twitter text-white text-5xl mb-4 transition-transform duration-300 ease-in-out transform hover:scale-125"></i>
            <h3 className="text-white text-lg font-bold">TWITTER</h3>
            <p className="text-white text-sm">/modeloonulp</p>
          </a>
          
          {/* LinkedIn */}
          <a 
            href="https://www.linkedin.com/in/simulacros-educativos-r%C3%ADo-de-la-plata-b45698230/?originalSubdomain=ar" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-transparent border border-white p-6 rounded-lg hover:shadow-lg hover:opacity-90 transition duration-300 ease-in-out transform hover:scale-105"
          >
            <i className="fab fa-linkedin-in text-white text-5xl mb-4 transition-transform duration-300 ease-in-out transform hover:scale-125"></i>
            <h3 className="text-white text-lg font-bold">LINKEDIN</h3>
            <p className="text-white text-sm">Simulacros Educativos Río de La Plata</p>
          </a>
          
        </div>
      </div>
    </div>
  );
};

export default SocialMediaSection;
