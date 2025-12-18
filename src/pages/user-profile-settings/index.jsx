import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarNavigation from '../../components/ui/SidebarNavigation';
import UserProfileDropdown from '../../components/ui/UserProfileDropdown';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

// Import tab components

import BusinessInfoTab from './components/BusinessInfoTab';
import SubscriptionTab from './components/SubscriptionTab';
import NotificationTab from './components/NotificationTab';
import SecurityTab from './components/SecurityTab';
import BusinessPhotoUpload from './components/BusinessPhotoUpload';

const UserProfileSettings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('business');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [headerRefreshTrigger, setHeaderRefreshTrigger] = useState(0);

  const tabs = [
    {
      id: 'business',
      label: 'Información del Negocio',
      icon: 'Store',
      description: 'Datos de tu barbería'
    },
    {
      id: 'subscription',
      label: 'Suscripción',
      icon: 'CreditCard',
      description: 'Plan y facturación'
    },
    {
      id: 'notifications',
      label: 'Notificaciones',
      icon: 'Bell',
      description: 'Preferencias de notificación'
    },
    {
      id: 'security',
      label: 'Seguridad',
      icon: 'Shield',
      description: 'Configuración de seguridad'
    }
  ];

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // Remove scroll to top - keep scroll position
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'business':
        return <BusinessInfoTab onUpdate={() => setHeaderRefreshTrigger(Date.now())} />;
      case 'subscription':
        return <SubscriptionTab />;
      case 'notifications':
        return <NotificationTab />;
      case 'security':
        return <SecurityTab />;
      default:
        return <BusinessInfoTab onUpdate={() => setHeaderRefreshTrigger(Date.now())} />;
    }
  };

  const customBreadcrumbs = [
    {
      label: 'Dashboard',
      path: '/business-dashboard',
      icon: 'BarChart3'
    },
    {
      label: 'Mi Perfil',
      path: '/user-profile-settings',
      icon: 'Settings',
      isActive: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar Navigation */}
      <SidebarNavigation
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        userRole="business"
      />
      {/* Main Content - Fixed margin to match admin panel and prevent overlap */}
      <div className={`transition-all duration-200 ${sidebarCollapsed ? 'ml-14' : 'ml-52'
        }`}>
        {/* Header */}
        <header className="bg-card border-b border-border px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden md:flex"
              >
                <Icon name={sidebarCollapsed ? 'ChevronRight' : 'ChevronLeft'} size={20} />
              </Button>

              <div className="hidden md:block">
                <h1 className="text-xl font-semibold text-foreground">
                  Mi Perfil
                </h1>
                <p className="text-sm text-muted-foreground">
                  Gestiona tu información personal y configuración de cuenta
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/business-dashboard')}
                iconName="ArrowLeft"
                iconPosition="left"
                className="md:hidden"
              >
                Volver
              </Button>

              <UserProfileDropdown
                userName="Carlos Rodríguez"
                userRole="business"
                userEmail="carlos.rodriguez@barberturn.com"
              />
            </div>
          </div>
        </header>

        {/* Content Area - Reduced padding to match admin panel */}
        <main className="p-4 md:p-4">
          {/* Breadcrumb Navigation */}
          <BreadcrumbNavigation customBreadcrumbs={customBreadcrumbs} />

          {/* Mobile Header */}
          <div className="md:hidden mb-6">
            <h1 className="text-xl font-semibold text-foreground mb-1">
              Mi Perfil
            </h1>
            <p className="text-sm text-muted-foreground">
              Gestiona tu información personal y configuración de cuenta
            </p>
          </div>

          <div className="max-w-7xl mx-auto space-y-6">
            {/* Cover Photo and Profile Photo Section - Now at the top */}
            <BusinessPhotoUpload refreshTrigger={headerRefreshTrigger} />

            {/* Profile Settings Content - Full width now */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              {/* Tab Navigation */}
              <div className="border-b border-border">
                {/* Desktop Tabs */}
                <div className="hidden md:flex overflow-x-auto">
                  {tabs?.map((tab) => (
                    <button
                      key={tab?.id}
                      onClick={() => handleTabChange(tab?.id)}
                      className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab?.id
                          ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                        }`}
                    >
                      <Icon name={tab?.icon} size={16} />
                      <span>{tab?.label}</span>
                    </button>
                  ))}
                </div>

                {/* Mobile Tab Selector */}
                <div className="md:hidden p-4">
                  <select
                    value={activeTab}
                    onChange={(e) => handleTabChange(e?.target?.value)}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                  >
                    {tabs?.map((tab) => (
                      <option key={tab?.id} value={tab?.id}>
                        {tab?.label}
                      </option>
                    ))}
                  </select>

                  <p className="text-sm text-muted-foreground mt-2">
                    {tabs?.find(tab => tab?.id === activeTab)?.description}
                  </p>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Active Tab Content */}
                <div className="animate-fade-in">
                  {renderTabContent()}
                </div>
              </div>
            </div>

            {/* Quick Actions - Mobile */}
            <div className="md:hidden grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/business-dashboard')}
                iconName="ArrowLeft"
                iconPosition="left"
                fullWidth
              >
                Volver al Dashboard
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate('/appointment-management')}
                iconName="Calendar"
                iconPosition="left"
                fullWidth
              >
                Gestión de Citas
              </Button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-card border-t border-border px-4 md:px-6 py-4 mt-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>© {new Date()?.getFullYear()} BarberTurn</span>
                <span>•</span>
                <button className="hover:text-foreground transition-colors">
                  Política de Privacidad
                </button>
                <span>•</span>
                <button className="hover:text-foreground transition-colors">
                  Términos de Servicio
                </button>
              </div>

              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Shield" size={14} />
                <span>Conexión segura</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default UserProfileSettings;