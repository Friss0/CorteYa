import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import FirebaseBusinessPhotosService from '../../lib/firebase-business-photos';

const UserProfileDropdown = ({ userName = 'Usuario', userRole = 'business', userEmail = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: userName,
    email: userEmail,
    role: userRole
  });
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Load real user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      const session = localStorage.getItem('barberTurnUser');
      if (session) {
        const sessionObj = JSON.parse(session);
        const uid = sessionObj.uid;

        try {
          const { data } = await FirebaseBusinessPhotosService.getBusinessWithPhotos(uid, uid);
          if (data) {
            setProfileData({
              name: data.businessName || sessionObj.name || 'Mi Barbería',
              email: data.email || sessionObj.email || '',
              role: 'business' // Force business role for display logic
            });
          }
        } catch (err) {
          console.error("Error fetching profile for dropdown:", err);
        }
      }
    };

    fetchUserData();
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    // Clear all user session data from localStorage
    localStorage.removeItem('barberTurnUser');
    localStorage.removeItem('barberTurnLanguage');
    localStorage.removeItem('barberTurnPreferences');
    localStorage.removeItem('barberTurnSettings');

    console.log('Usuario cerrado sesión exitosamente');
    closeDropdown();
    navigate('/user-login');
    window.location.reload();
  };

  const handleProfileClick = () => {
    closeDropdown();
    navigate('/user-profile-settings');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => {
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [isOpen]);

  const menuItems = [
    {
      label: 'Mi Perfil',
      icon: 'User',
      action: handleProfileClick,
      description: 'Configuración de cuenta'
    },
    {
      label: 'Ayuda',
      icon: 'HelpCircle',
      action: () => {
        closeDropdown();
        navigate('/business-help');
      },
      description: 'Manual de usuario'
    }
  ];


  // Filter menu items for Admin
  const displayMenuItems = userRole === 'admin' ? [] : menuItems;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted transition-micro focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
          <Icon name="User" size={16} color="white" />
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-foreground">{profileData.name}</p>
          <p className="text-xs text-muted-foreground">
            {profileData.role === 'admin' ? 'Administrador' : profileData.role === 'owner' ? 'Propietario' : 'Propietario'}
          </p>
        </div>
        <Icon
          name="ChevronDown"
          size={16}
          className={`hidden sm:block text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
            }`}
        />
      </button>
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-popover border border-border rounded-md shadow-dropdown z-50 animate-slide-in">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                <Icon name="User" size={20} color="white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-popover-foreground truncate">
                  {profileData.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {profileData.email}
                </p>
                <p className="text-xs text-accent font-medium">
                  {profileData.role === 'admin' ? 'Administrador' : profileData.role === 'owner' ? 'Propietario' : 'Propietario'}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items - Show for all users (Admin has none) */}
          <div className="py-2">
            {displayMenuItems?.map((item, index) => (
              <button
                key={index}
                onClick={item?.action}
                className="w-full flex items-center px-4 py-3 text-sm text-popover-foreground hover:bg-muted transition-micro group"
              >
                <Icon
                  name={item?.icon}
                  size={16}
                  className="mr-3 text-muted-foreground group-hover:text-accent"
                />
                <div className="flex-1 text-left">
                  <p className="font-medium">{item?.label}</p>
                  <p className="text-xs text-muted-foreground">{item?.description}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Logout Section */}
          <div className="border-t border-border py-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-sm text-error hover:bg-error/10 transition-micro group"
            >
              <Icon
                name="LogOut"
                size={16}
                className="mr-3 text-error"
              />
              <div className="flex-1 text-left">
                <p className="font-medium">Cerrar Sesión</p>
                <p className="text-xs text-muted-foreground">Salir de la aplicación</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;