import React from 'react';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className=" text-4xl font-bold text-blue-900 mb-4">Bienvenido a Simulacros Educativos</h1>
      <p className="text-lg text-gray-700 max-w-2xl text-center">
        Únase a nosotros para participar en simulacros educativos de alto nivel, donde puede aprender y colaborar con otros.
      </p>
      <button className="mt-8">Explorar</button>
    </div>
  );
}

export default Home;
