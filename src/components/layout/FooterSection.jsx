import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';

const FooterSection = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white pt-16 pb-8 border-t border-gray-100 text-black">
      <div className="max-w-[1800px] mx-auto px-8 md:px-16 lg:px-24">

        <div className="flex flex-col lg:flex-row justify-between gap-12 mb-16">
          {/* Left Column: Brand & Socials */}
          <div className="space-y-6">
            {/* Logo */}
            <Link to="/">
              <img
                src="/assets/images/logo1-1758650906205.png"
                alt="Corte Ya"
                className="h-20 w-auto"
              />
            </Link>

            {/* Social Icons */}
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 hover:bg-pink-100 transition-colors">
                <Instagram size={20} />
              </a>
              {/* TikTok SVG */}
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-black hover:bg-gray-200 transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center text-sky-500 hover:bg-sky-100 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 hover:bg-indigo-100 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Right Columns: Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-24">
            {/* Column 1 */}
            <div>
              <h4 className="font-bold text-lg mb-6">Sobre Corte Ya</h4>
              <ul className="space-y-4 text-gray-500 font-medium">
                <li><Link to="/" onClick={() => document.getElementById('demo')?.scrollIntoView()} className="hover:text-black transition-colors">Descargar app</Link></li>
                <li><Link to="/nosotros" className="hover:text-black transition-colors">Nosotros</Link></li>
                <li><Link to="/funcionalidades" className="hover:text-black transition-colors">Funcionalidades</Link></li>
                <li><span className="text-gray-300 cursor-default">Empleos</span></li>
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <h4 className="font-bold text-lg mb-6">Unite a Corte Ya</h4>
              <ul className="space-y-4 text-gray-500 font-medium">
                <li><Link to="/registro" className="hover:text-black transition-colors">Registrá tu local</Link></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h4 className="font-bold text-lg mb-6">Ayuda</h4>
              <ul className="space-y-4 text-gray-500 font-medium">
                <li><Link to="/help" className="hover:text-black transition-colors">Preguntas Frecuentes</Link></li>
                <li><span className="text-gray-400 cursor-not-allowed">Términos y Condiciones</span></li>
                <li><span className="text-gray-400 cursor-not-allowed">Privacidad</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="border-t border-gray-100 pt-8 text-center text-gray-400 text-sm">
          © {currentYear} Corte Ya LLC. Todos los derechos reservados.
        </div>

      </div>
    </footer>
  );
};

export default FooterSection;