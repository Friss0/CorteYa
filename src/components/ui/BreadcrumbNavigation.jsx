import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const BreadcrumbNavigation = ({ customBreadcrumbs = null }) => {
  const location = useLocation();

  const routeMap = {
    '/business-dashboard': { label: 'Dashboard', icon: 'BarChart3' },
    '/appointment-management': { label: 'Gestión de Citas', icon: 'Calendar' },
    '/user-profile-settings': { label: 'Configuración', icon: 'Settings' },
    '/admin-panel': { label: 'Panel de Administración', icon: 'Shield' },
    '/landing-page': { label: 'Inicio', icon: 'Home' },
    '/user-login': { label: 'Iniciar Sesión', icon: 'LogIn' }
  };

  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const pathSegments = location?.pathname?.split('/')?.filter(segment => segment);
    const breadcrumbs = [];

    // Always start with Dashboard for authenticated routes
    if (location?.pathname !== '/landing-page' && location?.pathname !== '/user-login') {
      breadcrumbs?.push({
        label: 'Dashboard',
        path: '/business-dashboard',
        icon: 'BarChart3'
      });
    }

    // Add current page if it's not dashboard
    if (location?.pathname !== '/business-dashboard' && routeMap?.[location?.pathname]) {
      const currentRoute = routeMap?.[location?.pathname];
      breadcrumbs?.push({
        label: currentRoute?.label,
        path: location?.pathname,
        icon: currentRoute?.icon,
        isActive: true
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't render breadcrumbs on landing page or login
  if (location?.pathname === '/landing-page' || location?.pathname === '/user-login') {
    return null;
  }

  // Don't render if only one breadcrumb (Dashboard)
  if (breadcrumbs?.length <= 1 && location?.pathname === '/business-dashboard') {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm font-body mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs?.map((crumb, index) => {
          const isLast = index === breadcrumbs?.length - 1;
          
          return (
            <li key={crumb?.path} className="flex items-center">
              {index > 0 && (
                <Icon 
                  name="ChevronRight" 
                  size={16} 
                  className="text-muted-foreground mx-2" 
                />
              )}
              {isLast || crumb?.isActive ? (
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={crumb?.icon} 
                    size={16} 
                    className="text-accent" 
                  />
                  <span className="font-medium text-foreground">
                    {crumb?.label}
                  </span>
                </div>
              ) : (
                <Link
                  to={crumb?.path}
                  className="flex items-center space-x-2 text-muted-foreground hover:text-accent transition-micro group"
                >
                  <Icon 
                    name={crumb?.icon} 
                    size={16} 
                    className="group-hover:text-accent" 
                  />
                  <span className="group-hover:text-accent">
                    {crumb?.label}
                  </span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default BreadcrumbNavigation;