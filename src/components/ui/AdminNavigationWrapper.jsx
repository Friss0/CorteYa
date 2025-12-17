import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const AdminNavigationWrapper = ({ isCollapsed = false, onToggle }) => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const adminNavigationItems = [
  {
    label: 'Dashboard Admin',
    path: '/admin-panel',
    icon: 'Shield',
    tooltip: 'Panel principal de administración'
  },
  {
    label: 'Usuarios',
    path: '/admin-panel/users',
    icon: 'Users',
    tooltip: 'Gestión de usuarios del sistema'
  },
  {
    label: 'Barberías',
    path: '/admin-panel/barbershops',
    icon: 'Store',
    tooltip: 'Administración de barberías'
  },
  {
    label: 'Reportes',
    path: '/admin-panel/reports',
    icon: 'FileText',
    tooltip: 'Reportes y análisis del sistema'
  },
  {
    label: 'Configuración',
    path: '/admin-panel/settings',
    icon: 'Settings',
    tooltip: 'Configuración del sistema'
  }];


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
        aria-label="Toggle admin navigation menu">

        <Icon name={isMobileOpen ? 'X' : 'Menu'} size={24} />
      </button>
      {/* Mobile Backdrop */}
      {isMobileOpen &&
      <div
        className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={closeMobileMenu} />

      }
      {/* Admin Sidebar - Now fully fixed and closer to content */}
      <nav
        className={`
          fixed left-0 top-0 h-full bg-card border-r border-border transition-all duration-200 z-40
          ${isCollapsed ? 'w-14' : 'w-52'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          shadow-lg
        `}>

        <div className="flex flex-col h-full">
          {/* Admin Logo Section */}
          <div className="flex items-center h-14 px-3 border-b border-border bg-error/5">
            {!isCollapsed &&
            <div className="flex items-center space-x-2">
                <div className="w-7 h-7 bg-error rounded-md flex items-center justify-center">
                  <Icon name="Shield" size={18} color="white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-semibold text-base text-error">CorteYa

                </span>
                  <span className="text-xs text-error/70 font-caption">
                    Admin Panel
                  </span>
                </div>
              </div>
            }
            {isCollapsed &&
            <div className="w-7 h-7 bg-error rounded-md flex items-center justify-center mx-auto">
                <Icon name="Shield" size={18} color="white" />
              </div>
            }
          </div>

          {/* Admin Navigation Items */}
          <div className="flex-1 py-3 overflow-y-auto">
            <ul className="space-y-1 px-2">
              {adminNavigationItems?.map((item) => {
                const isActive = isActiveRoute(item?.path);
                return (
                  <li key={item?.path}>
                    <Link
                      to={item?.path}
                      onClick={closeMobileMenu}
                      className={`
                        flex items-center px-2 py-2.5 rounded-lg text-sm font-body transition-micro
                        hover:bg-error/10 hover:scale-[0.98] group relative
                        ${isActive ?
                      'bg-error text-error-foreground shadow-card' :
                      'text-foreground hover:text-error'}
                        ${
                      isCollapsed ? 'justify-center' : 'justify-start'}
                      `}
                      title={isCollapsed ? item?.tooltip : ''}>

                      <Icon
                        name={item?.icon}
                        size={18}
                        className={`
                          ${isCollapsed ? '' : 'mr-2'}
                          ${isActive ? 'text-error-foreground' : ''}
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

            {/* Quick Actions Section */}
            <div className="mt-6 px-2">
              {!isCollapsed &&
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                  Acciones Rápidas
                </h3>
              }
              <div className="space-y-1">
                <button
                  onClick={() => console.log('System backup initiated')}
                  className={`
                    w-full flex items-center px-2 py-2 rounded-lg text-sm font-body transition-micro
                    text-warning hover:bg-warning/10 hover:scale-[0.98]
                    ${isCollapsed ? 'justify-center' : 'justify-start'}
                  `}
                  title={isCollapsed ? 'Respaldo del sistema' : ''}>

                  <Icon
                    name="Download"
                    size={16}
                    className={isCollapsed ? '' : 'mr-2'} />

                  {!isCollapsed && <span className="text-sm">Respaldo</span>}
                </button>
                
                <button
                  onClick={() => console.log('System maintenance mode')}
                  className={`
                    w-full flex items-center px-2 py-2 rounded-lg text-sm font-body transition-micro
                    text-muted-foreground hover:bg-muted hover:scale-[0.98]
                    ${isCollapsed ? 'justify-center' : 'justify-start'}
                  `}
                  title={isCollapsed ? 'Modo mantenimiento' : ''}>

                  <Icon
                    name="Wrench"
                    size={16}
                    className={isCollapsed ? '' : 'mr-2'} />

                  {!isCollapsed && <span className="text-sm">Mantenimiento</span>}
                </button>
              </div>
            </div>
          </div>

          {/* Admin User Section */}
          <div className="border-t border-border p-3 bg-error/5">
            {!isCollapsed &&
            <div className="flex items-center space-x-2">
                <div className="w-7 h-7 bg-error rounded-full flex items-center justify-center">
                  <Icon name="UserCheck" size={14} color="white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-error truncate">
                    Administrador
                  </p>
                  <p className="text-xs text-error/70 truncate">
                    Acceso completo
                  </p>
                </div>
              </div>
            }
            {isCollapsed &&
            <div className="w-7 h-7 bg-error rounded-full flex items-center justify-center mx-auto">
                <Icon name="UserCheck" size={14} color="white" />
              </div>
            }
          </div>
        </div>
      </nav>
    </>);

};

export default AdminNavigationWrapper;