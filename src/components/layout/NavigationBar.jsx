import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Button from '../ui/Button';

const NavigationBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationLinks = [
    { name: 'Sobre Nosotros', href: '/nosotros' },
    { name: 'Funcionalidades', href: '/funcionalidades' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-50">
      <div className="max-w-[1800px] mx-auto px-8 md:px-16 lg:px-24">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <img
                src="/assets/images/logo1-1758650906205.png"
                alt="Corte Ya"
                className="h-10 w-auto transform scale-150 hover:scale-[1.6] transition-transform duration-200"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-black hover:text-gray-600 font-medium transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action Buttons & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <Link to="/registro">
              <Button
                variant="outline"
                className="bg-white border text-black shadow-sm hover:bg-black hover:text-white hover:border-black px-4 py-2 rounded-lg font-medium text-sm hidden md:block transition-all duration-300"
              >
                Registrar mi barbería
              </Button>
            </Link>

            <Link to="/user-login">
              <Button
                variant="default"
                className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium text-sm"
              >
                Iniciar sesión
              </Button>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-black" />
              ) : (
                <Menu className="h-6 w-6 text-black" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-3">
              {navigationLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-left text-black hover:text-gray-600 font-medium py-2 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;