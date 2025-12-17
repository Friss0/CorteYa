import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const SidebarNavigation = ({ isCollapsed = false, onToggle, userRole = 'business' }) => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/business-dashboard',
      icon: 'BarChart3',
      tooltip: 'Análisis y métricas del negocio'
    },
    {
      label: 'Citas',
      path: '/appointment-management',
      icon: 'Calendar',
      tooltip: 'Gestión de citas y turnos'
    },
    {
      label: 'Mi Perfil',
      path: '/user-profile-settings',
      icon: 'Settings',
      tooltip: 'Configuración de perfil y cuenta'
    },
    {
      label: 'Ayuda',
      path: '/business-help',
      icon: 'HelpCircle',
      tooltip: 'Manuales y soporte'
    }];


  const adminItems = [
    {
      label: 'Panel Admin',
      path: '/admin-panel',
      icon: 'Shield',
      tooltip: 'Panel de administración'
    }];


  const menuItems = userRole === 'admin' ? [...navigationItems, ...adminItems] : navigationItems;

  const isActiveRoute = (path) => {
    return location?.pathname === path || location?.pathname?.startsWith(path + '/');
  };

  const handleMobileToggle = () => {
    setIsMobileOpen(!isMobileOpen);
    if (onToggle) onToggle();
  };

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={handleMobileToggle}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-card shadow-card hover:bg-muted transition-micro"
        aria-label="Toggle navigation menu">

        <Icon name={isMobileOpen ? 'X' : 'Menu'} size={24} />
      </button>
      {/* Mobile Backdrop */}
      {isMobileOpen &&
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobileMenu} />

      }
      {/* Sidebar - Now fully fixed like admin navigation */}
      <nav
        className={`
          fixed left-0 top-0 h-full bg-card border-r border-border transition-all duration-200 z-40
          ${isCollapsed ? 'w-14' : 'w-52'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          shadow-lg
        `}>

        <div className="flex flex-col h-full">
          {/* Logo Section - Compact like admin */}
          <div className="flex items-center h-14 px-3 border-b border-border bg-primary/5">
            {!isCollapsed &&
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
                  <Icon name="Scissors" size={18} color="white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-semibold text-base text-primary">CorteYa

                  </span>
                  <span className="text-xs text-primary/70 font-caption">
                    {userRole === 'admin' ? 'Admin Panel' : 'Gestión Profesional'}
                  </span>
                </div>
              </div>
            }
            {isCollapsed &&
              <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center mx-auto">
                <Icon name="Scissors" size={18} color="white" />
              </div>
            }
          </div>

          {/* Navigation Items - Compact styling like admin */}
          <div className="flex-1 py-3 overflow-y-auto">
            <ul className="space-y-1 px-2">
              {menuItems?.map((item) => {
                const isActive = isActiveRoute(item?.path);
                return (
                  <li key={item?.path}>
                    <Link
                      to={item?.path}
                      onClick={closeMobileMenu}
                      className={`
                        flex items-center px-2 py-2.5 rounded-lg text-sm font-body transition-micro
                        hover:bg-primary/10 hover:scale-[0.98] group relative
                        ${isActive ?
                          'bg-primary text-primary-foreground shadow-card' :
                          'text-foreground hover:text-primary'}
                        ${isCollapsed ? 'justify-center' : 'justify-start'}
                      `}
                      title={isCollapsed ? item?.tooltip : ''}>

                      <Icon
                        name={item?.icon}
                        size={18}
                        className={`
                          ${isCollapsed ? '' : 'mr-2'}
                          ${isActive ? 'text-primary-foreground' : ''}
                        `} />

                      {!isCollapsed &&
                        <span className="font-medium text-sm">{item?.label}</span>
                      }

                      {/* Tooltip for collapsed state */}
                      {isCollapsed &&
                        <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-dropdown opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                          {item?.label}
                        </div>
                      }
                    </Link>
                  </li>);

              })}
            </ul>

            {/* Quick Actions Section - Compact like admin */}
            <div className="mt-6 px-2">
              {!isCollapsed &&
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                  Acciones Rápidas
                </h3>
              }
              <div className="space-y-1">
                <button
                  onClick={() => console.log('Quick appointment booking')}
                  className={`
                    w-full flex items-center px-2 py-2 rounded-lg text-sm font-body transition-micro
                    text-accent hover:bg-accent/10 hover:scale-[0.98]
                    ${isCollapsed ? 'justify-center' : 'justify-start'}
                  `}
                  title={isCollapsed ? 'Cita rápida' : ''}>

                  <Icon
                    name="Plus"
                    size={16}
                    className={isCollapsed ? '' : 'mr-2'} />

                  {!isCollapsed && <span className="text-sm">Nueva Cita</span>}
                </button>

                <button
                  onClick={() => console.log('View today schedule')}
                  className={`
                    w-full flex items-center px-2 py-2 rounded-lg text-sm font-body transition-micro
                    text-muted-foreground hover:bg-muted hover:scale-[0.98]
                    ${isCollapsed ? 'justify-center' : 'justify-start'}
                  `}
                  title={isCollapsed ? 'Agenda de hoy' : ''}>

                  <Icon
                    name="Clock"
                    size={16}
                    className={isCollapsed ? '' : 'mr-2'} />

                  {!isCollapsed && <span className="text-sm">Agenda Hoy</span>}
                </button>
              </div>
            </div>
          </div>

          {/* User Section - Compact like admin */}
          <div className="border-t border-border p-3 bg-primary/5">
            {!isCollapsed &&
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="User" size={14} color="white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary truncate">
                    {userRole === 'admin' ? 'Administrador' : 'Propietario'}
                  </p>
                  <p className="text-xs text-primary/70 truncate">
                    Sesión activa
                  </p>
                </div>
              </div>
            }
            {isCollapsed &&
              <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center mx-auto">
                <Icon name="User" size={14} color="white" />
              </div>
            }
          </div>
        </div>
      </nav>
    </>);

};

export default SidebarNavigation;