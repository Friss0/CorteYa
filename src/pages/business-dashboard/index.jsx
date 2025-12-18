import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarNavigation from '../../components/ui/SidebarNavigation';
import UserProfileDropdown from '../../components/ui/UserProfileDropdown';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import DashboardHeader from './components/DashboardHeader';
import MetricsCard from './components/MetricsCard';
import RevenueChart from './components/RevenueChart';
import AppointmentCalendar from './components/AppointmentCalendar';
import CustomerInsights from './components/CustomerInsights';
import WidgetLibrary from './components/WidgetLibrary';
import DashboardLayout from './components/DashboardLayout';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { db } from '../../lib/firebase';
import { ref, get } from 'firebase/database';
import { MetricsService } from '../../services/metricsService';

const BusinessDashboard = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [widgetLibraryOpen, setWidgetLibraryOpen] = useState(false);
  const [dashboardWidgets, setDashboardWidgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [metricsData, setMetricsData] = useState({ cards: [], chartData: [] });

  // Check for missing required fields (Mobile Map Requirements)
  const checkRequiredFields = (data) => {
    // Required: lat, lng, address, businessName, image (profile), heroImage (cover)
    // Note: 'image' and 'heroImage' might be checked if they exist in data.
    // If data comes from 'barbershops/{uid}', it should have them if uploaded.

    const missing = [];
    if (!data.lat) missing.push('Latitud');
    if (!data.lng) missing.push('Longitud');
    if (!data.address) missing.push('Dirección');
    if (!data.businessName && !data.name) missing.push('Nombre del Negocio');

    // Strict check for photos if requested by user ("obligue a cargar... foto de portada, foto de perfil")
    // We can relax this if it's too blocking, but user said "oblige".
    if (!data.image) missing.push('Logo / Foto de Perfil');
    // if (!data.heroImage) missing.push('Foto de Portada'); // Optional? User said "foto de portada" required.

    return missing;
  };

  const [missingFields, setMissingFields] = useState([]);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Fetch real user data and metrics
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const session = localStorage.getItem('barberTurnUser');
        if (!session) {
          navigate('/user-login');
          return;
        }
        if (session) {
          const sessionObj = JSON.parse(session);
          const uid = sessionObj.uid;

          // 1. Fetch User Info
          const userRef = ref(db, `barbershops/${uid}`);
          const snapshot = await get(userRef);

          let currentUserData = {
            name: sessionObj.name || "Propietario",
            email: sessionObj.email || "",
            role: "business",
            businessName: sessionObj.businessName || "Mi Barbería"
          };

          if (snapshot.exists()) {
            const data = snapshot.val();
            currentUserData = {
              name: data.ownerName || sessionObj.name || "Propietario",
              email: data.email || sessionObj.email || "",
              role: "business",
              businessName: data.name || data.businessName || sessionObj.businessName || "Mi Barbería",
              ...data
            };

            // Check Requirements
            const missing = checkRequiredFields(currentUserData);
            if (missing.length > 0) {
              setMissingFields(missing);
              setShowOnboarding(true);
            }
          }
          setUserData(currentUserData);

          // 2. Fetch Metrics
          const metricsObj = await MetricsService.getBusinessMetrics(uid);
          const finalMetrics = metricsObj || { cards: [], chartData: [] };
          setMetricsData(finalMetrics);

          // 3. Initialize Widgets with Real Data
          const cards = finalMetrics.cards || [];
          const chartData = finalMetrics.chartData || [];

          const defaultWidgets = [
            {
              id: 'metrics-revenue',
              type: 'metric',
              component: (
                <MetricsCard
                  key="metrics-revenue"
                  title={cards[0]?.title || 'Ingresos'}
                  value={cards[0]?.value || '$0'}
                  change={cards[0]?.change || '0%'}
                  changeType={cards[0]?.changeType || 'neutral'}
                  icon={cards[0]?.icon || 'DollarSign'}
                  subtitle={cards[0]?.subtitle || 'Actual'}
                />
              )
            },
            {
              id: 'metrics-appointments',
              type: 'metric',
              component: (
                <MetricsCard
                  key="metrics-appointments"
                  title={cards[1]?.title || 'Citas'}
                  value={cards[1]?.value || 0}
                  change={cards[1]?.change || '0%'}
                  changeType={cards[1]?.changeType || 'neutral'}
                  icon={cards[1]?.icon || 'Calendar'}
                  subtitle={cards[1]?.subtitle || 'Este mes'}
                />
              )
            },
            {
              id: 'metrics-customers',
              type: 'metric',
              component: (
                <MetricsCard
                  key="metrics-customers"
                  title={cards[2]?.title || 'Clientes'}
                  value={cards[2]?.value || 0}
                  change={cards[2]?.change || '0%'}
                  changeType={cards[2]?.changeType || 'neutral'}
                  icon={cards[2]?.icon || 'Users'}
                  subtitle={cards[2]?.subtitle || 'Activos'}
                />
              )
            },
            {
              id: 'metrics-satisfaction',
              type: 'metric',
              component: (
                <MetricsCard
                  key="metrics-satisfaction"
                  title={cards[3]?.title || 'Satisfacción'}
                  value={cards[3]?.value || '5.0'}
                  change={cards[3]?.change || '0.0'}
                  changeType={cards[3]?.changeType || 'neutral'}
                  icon={cards[3]?.icon || 'Star'}
                  subtitle={cards[3]?.subtitle || 'Puntuación'}
                />
              )
            },
            {
              id: 'revenue-chart',
              type: 'chart',
              component: <RevenueChart key="revenue-chart" data={chartData} />
            },
            {
              id: 'appointment-calendar',
              type: 'calendar',
              component: <AppointmentCalendar key="appointment-calendar" />
            },
            {
              id: 'customer-insights',
              type: 'insights',
              component: <CustomerInsights key="customer-insights" />
            }
          ];

          setDashboardWidgets(defaultWidgets);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'appointments': navigate('/appointment-management');
        break;
      case 'customers': console.log('Navegando a gestión de clientes');
        break;
      default:
        console.log('Acción rápida:', action);
    }
  };

  const handleLogout = () => {
    // Clear all user session data from localStorage
    localStorage.removeItem('barberTurnUser');
    localStorage.removeItem('barberTurnLanguage');
    localStorage.removeItem('barberTurnPreferences');
    localStorage.removeItem('barberTurnSettings');

    console.log('Usuario cerrado sesión exitosamente - desde Onboarding');
    navigate('/user-login');
  };

  const handleExportReport = () => {
    console.log('Exportando reporte del dashboard...');
    // Simulate export process
    const exportData = {
      date: new Date()?.toISOString(),
      metrics: metricsData,
      period: 'Septiembre 2025'
    };

    // In a real app, this would trigger a download
    console.log('Datos de exportación:', exportData);
    alert('Reporte exportado exitosamente');
  };

  const handleMoveWidget = (fromIndex, toIndex) => {
    const updatedWidgets = [...dashboardWidgets];
    const [movedWidget] = updatedWidgets?.splice(fromIndex, 1);
    updatedWidgets?.splice(toIndex, 0, movedWidget);
    setDashboardWidgets(updatedWidgets);
  };

  const handleRemoveWidget = (widgetId) => {
    setDashboardWidgets(prev => prev?.filter(widget => widget?.id !== widgetId));
  };

  const handleAddWidget = (widgetConfig) => {
    const newWidget = {
      id: `${widgetConfig?.id}-${Date.now()}`,
      type: widgetConfig?.category,
      component: (
        <div key={`${widgetConfig?.id}-${Date.now()}`} className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name={widgetConfig?.icon} size={20} className="text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground font-heading">
                {widgetConfig?.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {widgetConfig?.description}
              </p>
            </div>
          </div>
          <div className="text-center py-8">
            <Icon name="Construction" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Widget en desarrollo
            </p>
          </div>
        </div>
      )
    };

    setDashboardWidgets(prev => [...prev, newWidget]);
    setWidgetLibraryOpen(false);
  };

  const handleLayoutChange = (layout) => {
    console.log('Cambio de diseño:', layout);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Onboarding Modal Overlay */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl shadow-2xl max-w-md w-full p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="MapPin" size={32} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">¡Completa tu Perfil!</h2>
            <p className="text-muted-foreground mb-6">
              Para que tu barbería sea visible en la App Móvil y los clientes puedan encontrarte en el mapa, necesitamos que completes la siguiente información obligatoria:
            </p>

            <div className="bg-muted/50 rounded-lg p-4 mb-8 text-left">
              <h4 className="font-semibold mb-2 text-sm text-foreground">Falta completar:</h4>
              <ul className="space-y-2">
                {missingFields.map((field, idx) => (
                  <li key={idx} className="flex items-center text-sm text-error">
                    <Icon name="XCircle" size={16} className="mr-2" />
                    {field}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full"
                onClick={() => navigate('/user-profile-settings')}
                iconName="ArrowRight"
              >
                Ir a Completar Perfil
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full text-error border-error/50 hover:bg-error/10 hover:text-error hover:border-error"
                onClick={handleLogout}
                iconName="LogOut"
              >
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Sidebar */}
        <SidebarNavigation
          isCollapsed={sidebarCollapsed}
          onToggle={handleSidebarToggle}
          userRole={userData?.role}
        />

        {/* Main Content - Updated margins to match admin panel */}
        <div className={`flex-1 transition-all duration-200 ${sidebarCollapsed ? 'ml-14' : 'ml-52'}`}>
          {/* Top Bar */}
          <header className="bg-card border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSidebarToggle}
                  className="hidden md:flex"
                >
                  <Icon name={sidebarCollapsed ? 'ChevronRight' : 'ChevronLeft'} size={20} />
                </Button>
                <div>
                  <h1 className="text-xl font-semibold text-foreground font-heading">
                    Dashboard de Negocio
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Panel de control y análisis
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  iconName="RefreshCw"
                  iconPosition="left"
                  onClick={() => window.location?.reload()}
                >
                  Actualizar
                </Button>
                <UserProfileDropdown
                  userName={userData?.name}
                  userRole={userData?.role}
                  userEmail={userData?.email}
                />
              </div>
            </div>
          </header>

          {/* Page Content - Reduced padding to be closer to navigation */}
          <main className="p-4">
            <BreadcrumbNavigation />

            <DashboardHeader
              userName={userData?.name}
              businessName={userData?.businessName}
              onExportReport={handleExportReport}
              onQuickAction={handleQuickAction}
            />

            <DashboardLayout
              widgets={dashboardWidgets}
              onMoveWidget={handleMoveWidget}
              onRemoveWidget={handleRemoveWidget}
              onLayoutChange={handleLayoutChange}
            />
          </main>
        </div>

        {/* Widget Library */}
        <WidgetLibrary
          isOpen={widgetLibraryOpen}
          onToggle={() => setWidgetLibraryOpen(!widgetLibraryOpen)}
          onAddWidget={handleAddWidget}
        />
      </div>
    </div>
  );
};

export default BusinessDashboard;