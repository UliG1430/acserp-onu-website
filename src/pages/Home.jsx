import logo from '../assets/images/Azul Viejo - Logo ACSERP + Texto.png';
import SocialMedia from '../components/SocialMedia';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-700 text-white flex flex-col items-center">
      {/* Logo y menú */}
      <header className="w-full flex flex-col items-center mt-4">
        <img src={logo} alt="Logo" className="w-40 h-40" />
        <nav className="mt-4">
          <ul className="flex space-x-4">
            <li><a href="/" className="text-lg">Inicio</a></li>
            <li><a href="/about" className="text-lg">Acerca de</a></li>
            <li><a href="/contact" className="text-lg">Contacto</a></li>
          </ul>
        </nav>
      </header>

      {/* Contenido principal */}
      <main className="flex-grow flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Bienvenidos a Simulacros Educativos</h1>
        <p className="mt-4 text-lg text-center">
          Explore nuestros recursos y conecte con nuestras redes sociales.
        </p>
      </main>

      {/* Redes Sociales */}
      <footer className="w-full py-6 bg-blue-900 flex justify-center">
        <SocialMedia />
      </footer>
    </div>
  );
}

export default Home;
