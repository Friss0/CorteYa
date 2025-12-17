import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const HeroSection = () => {
  const navigate = useNavigate();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const words = ['citas.', 'clientes.', 'gastos.', 'ingresos.'];

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    let timeout;

    if (isTyping) {
      if (currentText.length < currentWord.length) {
        timeout = setTimeout(() => {
          setCurrentText(currentWord.slice(0, currentText.length + 1));
        }, 150);
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }
    } else {
      if (currentText.length > 0) {
        timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, 100);
      } else {
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [currentText, isTyping, currentWordIndex, words]);

  return (
    <section id="hero" className="relative bg-white min-h-screen flex items-center overflow-hidden pt-16 md:pt-0">

      {/* Blobs Background */}
      {/* Top Left Blob */}
      <img
        src="/assets/images/blob-top-left.png"
        alt=""
        className="absolute top-0 left-0 w-[280px] md:w-[350px] h-auto object-contain z-0 opacity-100 hidden md:block pointer-events-none"
        aria-hidden="true"
      />

      {/* Bottom Right Blob */}
      <img
        src="/assets/images/blob-bottom-right.png"
        alt=""
        className="absolute bottom-0 right-0 w-[350px] md:w-[450px] h-auto object-contain z-0 opacity-100 hidden md:block pointer-events-none"
        aria-hidden="true"
      />

      <div className="container mx-auto px-6 lg:px-12 relative z-10 max-w-7xl">
        <div className="grid md:grid-cols-2 gap-4 items-center">

          {/* Left Column: Content */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6 max-w-xl mx-auto md:ml-auto md:mr-0 md:pl-12 lg:pl-0">
            {/* Logo */}
            <img
              src="/assets/images/logo1-1758650906205.png"
              alt="Corte Ya"
              className="h-28 md:h-36 w-auto object-contain mb-4 md:ml-8"
            />

            {/* Headline */}
            <div className="md:pl-8">
              <h1 className="font-bold text-black leading-tight font-heading">
                <span className="block text-lg md:text-xl lg:text-2xl whitespace-nowrap">
                  Gestioná tu barbería de forma más simple.
                </span>

                <span className="block mt-4 text-2xl md:text-3xl lg:text-4xl">
                  Administrá{' '}
                  <span className="relative inline-block text-success">
                    <span className="relative z-10">{currentText}</span>
                    <span className="animate-pulse ml-0.5 text-black">|</span>
                  </span>
                </span>
              </h1>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto pt-10 justify-center md:justify-start">
                <Button
                  variant="default"
                  className="bg-black text-white hover:bg-gray-800 px-6 py-3 rounded-xl font-medium text-base min-w-[150px] shadow-lg hover:shadow-xl transition-all"
                  onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Descargar app
                </Button>

                <Button
                  variant="outline"
                  className="bg-white border-2 border-black text-black hover:bg-black hover:text-white px-6 py-3 rounded-xl font-medium text-base min-w-[150px] transition-all"
                  onClick={() => navigate('/registro')}
                >
                  Unite a Corte Ya
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column: Phone Mockup */}
          <div className="relative flex justify-center md:justify-center mt-12 md:mt-0">
            <div className="relative z-10 w-full max-w-[280px] md:max-w-[340px]">
              <img
                src="/assets/images/hero-phone.png"
                alt="App Interface"
                className="w-full h-auto drop-shadow-2xl transform -rotate-6 hover:rotate-0 transition-transform duration-500"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;