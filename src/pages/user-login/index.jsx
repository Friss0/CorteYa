import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertCircle, X } from 'lucide-react';

import { db } from '../../lib/firebase';
import { ref, get, query, orderByChild, equalTo } from 'firebase/database';

const UserLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('barberTurnUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      if (userData?.role === 'admin') {
        navigate('/admin-panel');
      } else {
        navigate('/business-dashboard');
      }
    }
  }, [navigate]);

  useEffect(() => {
    if (error || success) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
        setTimeout(() => {
          setError('');
          setSuccess('');
        }, 300);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Imports removed (redundant and misplaced)

  // ... (inside component)

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      let userFound = null; // Declare here so it is available in all blocks

      // 1. Hardcoded Admin Bypass
      if (formData.email === 'admin@gmail.com' && formData.password === '123456') {
        userFound = {
          id: 'admin_master',
          email: 'admin@gmail.com',
          role: 'admin',
          ownerName: 'Super Admin',
          businessName: 'CorteYa Admin'
        };
      } else {
        // 2. DB Lookup for Barbershops (Owners)
        const usersRef = ref(db, 'barbershops');
        const snapshot = await get(usersRef);

        if (snapshot.exists()) {
          const usersData = snapshot.val();
          Object.keys(usersData).forEach(key => {
            const user = usersData[key];
            const dbEmail = String(user.email || '').trim().toLowerCase();
            const inputEmail = String(formData.email || '').trim().toLowerCase();
            const dbPassRaw = user.password || user.dni || '';
            const dbPass = String(dbPassRaw).trim();
            const inputPass = String(formData.password || '').trim();

            if (dbEmail === inputEmail && dbPass === inputPass) {
              userFound = { id: key, ...user };
            }
          });
        }
      }

      if (!userFound) {
        throw new Error('WRONG_PASSWORD');
      }

      const user = userFound;

      // Show success message
      setSuccess('¡Inicio de sesión exitoso! Redirigiendo...');

      // Determine role
      // If role is undefined, default to 'business'. 
      // If email contains 'admin' and role is missing, we could force admin, but better to rely on DB data if present.
      const role = user.role || (user.email.includes('admin') ? 'admin' : 'business');

      const sessionData = {
        email: user.email,
        uid: user.id, // Use RTDB Key as UID
        role: role,
        name: user.ownerName || (role === 'admin' ? 'Administrador Sistema' : 'Propietario Barbería'),
        businessName: user.businessName,
        loginTime: new Date().toISOString()
      };

      // Save to localStorage
      localStorage.setItem('barberTurnUser', JSON.stringify(sessionData));
      localStorage.setItem('barberTurnLanguage', 'es');

      // Wait for success message to show, then navigate
      setTimeout(() => {
        if (role === 'admin') {
          navigate('/admin-panel');
        } else {
          navigate('/business-dashboard');
        }
      }, 1000);

    } catch (err) {
      console.error("Login error:", err);
      if (err.message === 'USER_NOT_FOUND' || err.message === 'WRONG_PASSWORD') {
        setError('Credenciales incorrectas. Verifique su email y contraseña.');
      } else {
        setError('Error al iniciar sesión: ' + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const closeAlert = () => {
    setShowAlert(false);
    setTimeout(() => {
      setError('');
      setSuccess('');
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#AEC79C] rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-[#AEC79C] rounded-full opacity-8 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gray-300 rounded-full opacity-20 blur-2xl"></div>
      </div>

      {/* Alert System */}
      {(error || success) && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out ${showAlert ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
          }`}>
          <div className={`flex items-center space-x-3 px-6 py-4 rounded-lg shadow-lg max-w-md ${success
            ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
            {success ? (
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            )}
            <p className="text-sm font-medium">{success || error}</p>
            <button
              onClick={closeAlert}
              className={`ml-auto p-1 rounded-full transition-colors ${success
                ? 'hover:bg-green-100 text-green-500' : 'hover:bg-red-100 text-red-500'
                }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header with back arrow - removed CorteYa */}
      <div className="flex items-center justify-start p-6 relative z-10">
        <button
          onClick={() => navigate('/landing-page')}
          className="flex items-center text-gray-700 hover:text-[#AEC79C] transition-all duration-200 hover:translate-x-1"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span className="font-medium">Inicio</span>
        </button>
      </div>

      {/* Main content with repositioned logo */}
      <div className="flex-1 flex items-center justify-center px-6 py-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Logo outside form - updated with new logo and increased size */}
          <div className="flex justify-center mb-12">
            <img
              src="/assets/images/logo2-1758676602365.png"
              alt="CorteYa Logo"
              className="h-12 w-auto transform scale-[2] hover:scale-[2.1] transition-transform duration-200"
            />
          </div>

          {/* Enhanced login container with glass effect */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 relative overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none rounded-3xl"></div>

            {/* Content */}
            <div className="relative z-10">
              {/* Title with improved typography */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-light text-gray-800 mb-2">Iniciar sesión</h2>
                <div className="w-12 h-0.5 bg-gradient-to-r from-[#AEC79C] to-gray-300 mx-auto rounded-full"></div>
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email field with enhanced styling */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 uppercase tracking-wider">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData?.email}
                      onChange={handleInputChange}
                      placeholder="ejemplo@corteya.com"
                      className="w-full bg-gray-50/50 border-2 border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-[#AEC79C] focus:bg-white transition-all duration-200 hover:border-gray-300"
                      required
                      disabled={isLoading}
                    />
                    <div className="absolute inset-0 rounded-xl ring-1 ring-black/5 pointer-events-none"></div>
                  </div>
                </div>

                {/* Password field with enhanced styling */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 uppercase tracking-wider">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="password"
                      value={formData?.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="w-full bg-gray-50/50 border-2 border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-[#AEC79C] focus:bg-white transition-all duration-200 hover:border-gray-300"
                      required
                      disabled={isLoading}
                    />
                    <div className="absolute inset-0 rounded-xl ring-1 ring-black/5 pointer-events-none"></div>
                  </div>
                </div>

                {/* Enhanced login button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold py-4 px-6 rounded-xl hover:from-[#AEC79C] hover:to-[#9bb88a] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 uppercase tracking-wider overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex items-center justify-center">
                    {isLoading && (
                      <div className="absolute left-6">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      </div>
                    )}
                    {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                  </div>
                </button>
              </form>

              {/* Bottom links - removed "o" and "crear cuenta" */}
              <div className="flex flex-col items-center space-y-4 mt-8 pt-6 border-t border-gray-200/50">
                <button
                  onClick={() => navigate('/forgot-password')}
                  className="text-gray-600 hover:text-[#AEC79C] transition-colors duration-200 text-sm font-medium"
                  disabled={isLoading}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </div>
          </div>

          {/* Subtle footer text */}
          <p className="text-center text-xs text-gray-500 mt-6">
            Al continuar, aceptas nuestros términos de servicio
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;