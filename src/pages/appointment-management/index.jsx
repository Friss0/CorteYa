import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import SidebarNavigation from '../../components/ui/SidebarNavigation';
import UserProfileDropdown from '../../components/ui/UserProfileDropdown';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

// Import components
import CalendarView from './components/CalendarView';
import AppointmentQueue from './components/AppointmentQueue';
import AppointmentModal from './components/AppointmentModal';
import FilterControls from './components/FilterControls';
import WalkInRegistration from './components/WalkInRegistration';

const AppointmentManagement = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    service: '',
    staff: '',
    dateFrom: '',
    dateTo: '',
    priority: '',
    quickFilter: ''
  });

  // Mock data
  const mockServices = [
    {
      id: 1,
      name: "Corte Clásico",
      duration: 30,
      price: 15,
      description: "Corte tradicional con tijeras y máquina"
    },
    {
      id: 2,
      name: "Corte y Barba",
      duration: 45,
      price: 25,
      description: "Corte completo con arreglo de barba"
    },
    {
      id: 3,
      name: "Afeitado Tradicional",
      duration: 30,
      price: 18,
      description: "Afeitado con navaja y toallas calientes"
    },
    {
      id: 4,
      name: "Corte Premium",
      duration: 60,
      price: 35,
      description: "Corte premium con lavado y peinado"
    },
    {
      id: 5,
      name: "Arreglo de Barba",
      duration: 20,
      price: 12,
      description: "Perfilado y arreglo de barba"
    }
  ];

  const mockStaff = [
    {
      id: 1,
      name: "Carlos Rodríguez",
      specialties: ["Cortes Clásicos", "Barbas"],
      available: true
    },
    {
      id: 2,
      name: "Miguel Fernández",
      specialties: ["Cortes Modernos", "Afeitado"],
      available: true
    },
    {
      id: 3,
      name: "Antonio López",
      specialties: ["Cortes Premium", "Tratamientos"],
      available: false
    }
  ];

  const mockCustomers = [
    {
      id: 1,
      name: "Juan Pérez",
      phone: "666 123 456",
      email: "juan.perez@email.com"
    },
    {
      id: 2,
      name: "María García",
      phone: "666 234 567",
      email: "maria.garcia@email.com"
    },
    {
      id: 3,
      name: "Pedro Martín",
      phone: "666 345 678",
      email: "pedro.martin@email.com"
    },
    {
      id: 4,
      name: "Ana Ruiz",
      phone: "666 456 789",
      email: "ana.ruiz@email.com"
    },
    {
      id: 5,
      name: "Luis Sánchez",
      phone: "666 567 890",
      email: "luis.sanchez@email.com"
    }
  ];

  const generateMockAppointments = () => {
    const appointments = [];
    const today = new Date();
    
    // Generate appointments for the next 30 days
    for (let i = 0; i < 50; i++) {
      const date = new Date(today);
      date?.setDate(today?.getDate() + Math.floor(Math.random() * 30) - 5);
      date?.setHours(8 + Math.floor(Math.random() * 11), Math.floor(Math.random() * 4) * 15, 0, 0);
      
      const customer = mockCustomers?.[Math.floor(Math.random() * mockCustomers?.length)];
      const service = mockServices?.[Math.floor(Math.random() * mockServices?.length)];
      const staff = mockStaff?.[Math.floor(Math.random() * mockStaff?.length)];
      const statuses = ['confirmed', 'in-progress', 'completed', 'cancelled'];
      const priorities = ['normal', 'normal', 'normal', 'medium', 'high'];
      
      appointments?.push({
        id: i + 1,
        customerName: customer?.name,
        customerPhone: customer?.phone,
        customerEmail: customer?.email,
        service: service?.name,
        staffMember: staff?.name,
        date: date,
        duration: service?.duration,
        status: statuses?.[Math.floor(Math.random() * statuses?.length)],
        priority: priorities?.[Math.floor(Math.random() * priorities?.length)],
        notes: Math.random() > 0.7 ? `Cliente prefiere ${staff?.name}. Corte habitual.` : '',
        price: service?.price
      });
    }
    
    return appointments?.sort((a, b) => a?.date?.getTime() - b?.date?.getTime());
  };

  useEffect(() => {
    setAppointments(generateMockAppointments());
  }, []);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsAppointmentModalOpen(true);
  };

  const handleNewAppointment = () => {
    setSelectedAppointment(null);
    setIsAppointmentModalOpen(true);
  };

  const handleWalkInRegistration = () => {
    setIsWalkInModalOpen(true);
  };

  const handleAppointmentSave = (appointmentData) => {
    if (appointmentData?.id && appointments?.find(apt => apt?.id === appointmentData?.id)) {
      // Update existing appointment
      setAppointments(prev => prev?.map(apt => 
        apt?.id === appointmentData?.id ? appointmentData : apt
      ));
    } else {
      // Add new appointment
      setAppointments(prev => [...prev, appointmentData]);
    }
  };

  const handleAppointmentDelete = (appointmentId) => {
    setAppointments(prev => prev?.filter(apt => apt?.id !== appointmentId));
  };

  const handleStatusChange = (appointmentId, newStatus) => {
    setAppointments(prev => prev?.map(apt => 
      apt?.id === appointmentId ? { ...apt, status: newStatus } : apt
    ));
  };

  const handleAppointmentDrop = (appointment, targetDate) => {
    const updatedAppointment = {
      ...appointment,
      date: targetDate
    };
    handleAppointmentSave(updatedAppointment);
  };

  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));

    // Handle quick filters
    if (filterKey === 'quickFilter') {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow?.setDate(today?.getDate() + 1);
      
      switch (value) {
        case 'today':
          setFilters(prev => ({
            ...prev,
            dateFrom: today?.toISOString()?.split('T')?.[0],
            dateTo: today?.toISOString()?.split('T')?.[0],
            quickFilter: value
          }));
          break;
        case 'tomorrow':
          setFilters(prev => ({
            ...prev,
            dateFrom: tomorrow?.toISOString()?.split('T')?.[0],
            dateTo: tomorrow?.toISOString()?.split('T')?.[0],
            quickFilter: value
          }));
          break;
        case 'week':
          const weekEnd = new Date(today);
          weekEnd?.setDate(today?.getDate() + 7);
          setFilters(prev => ({
            ...prev,
            dateFrom: today?.toISOString()?.split('T')?.[0],
            dateTo: weekEnd?.toISOString()?.split('T')?.[0],
            quickFilter: value
          }));
          break;
        case 'pending':
          setFilters(prev => ({
            ...prev,
            status: 'confirmed',
            quickFilter: value
          }));
          break;
        case 'completed':
          setFilters(prev => ({
            ...prev,
            status: 'completed',
            quickFilter: value
          }));
          break;
        default:
          break;
      }
    }
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: '',
      service: '',
      staff: '',
      dateFrom: '',
      dateTo: '',
      priority: '',
      quickFilter: ''
    });
  };

  const handleWalkInRegister = (walkInData) => {
    // Convert walk-in to appointment
    const appointmentData = {
      ...walkInData,
      date: new Date(),
      status: 'confirmed'
    };
    setAppointments(prev => [...prev, appointmentData]);
  };

  // Filter appointments based on current filters
  const filteredAppointments = appointments?.filter(appointment => {
    if (filters?.search && !appointment?.customerName?.toLowerCase()?.includes(filters?.search?.toLowerCase())) {
      return false;
    }
    if (filters?.status && appointment?.status !== filters?.status) {
      return false;
    }
    if (filters?.service && appointment?.service !== filters?.service) {
      return false;
    }
    if (filters?.staff && appointment?.staffMember !== filters?.staff) {
      return false;
    }
    if (filters?.priority && appointment?.priority !== filters?.priority) {
      return false;
    }
    if (filters?.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      if (appointment?.date < fromDate) {
        return false;
      }
    }
    if (filters?.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate?.setHours(23, 59, 59, 999);
      if (appointment?.date > toDate) {
        return false;
      }
    }
    return true;
  });

  return (
    <>
      <Helmet>
        <title>Gestión de Citas - BarberTurn</title>
        <meta name="description" content="Sistema completo de gestión de citas y turnos para barberías con calendario interactivo y cola de espera." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <div className="flex">
          {/* Sidebar */}
          <SidebarNavigation 
            isCollapsed={sidebarCollapsed}
            onToggle={handleSidebarToggle}
            userRole="business"
          />

          {/* Main Content - Fixed margin to match admin panel and prevent overlap */}
          <div className={`flex-1 transition-all duration-200 ${sidebarCollapsed ? 'ml-14' : 'ml-52'}`}>
            {/* Header */}
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
                    <h1 className="text-2xl font-bold text-foreground">
                      Gestión de Citas
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Administra citas, turnos y cola de espera
                    </p>
                  </div>
                </div>
                <UserProfileDropdown 
                  userName="Carlos Rodríguez"
                  userRole="business"
                  userEmail="carlos@barberturn.com"
                />
              </div>
            </header>

            {/* Content - Reduced padding to be closer to navigation like admin panel */}
            <main className="p-4">
              <BreadcrumbNavigation />

              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={handleNewAppointment}
                    iconName="Plus"
                    iconPosition="left"
                  >
                    Nueva Cita
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleWalkInRegistration}
                    iconName="UserPlus"
                    iconPosition="left"
                  >
                    Cliente Sin Cita
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Download"
                    iconPosition="left"
                  >
                    Exportar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="RefreshCw"
                    iconPosition="left"
                    onClick={() => setAppointments(generateMockAppointments())}
                  >
                    Actualizar
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <FilterControls
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                services={mockServices}
                staff={mockStaff}
              />

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                {/* Calendar View */}
                <div className="lg:col-span-2">
                  <CalendarView
                    currentDate={currentDate}
                    onDateChange={setCurrentDate}
                    appointments={filteredAppointments}
                    onAppointmentClick={handleAppointmentClick}
                    onAppointmentDrop={handleAppointmentDrop}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                  />
                </div>

                {/* Appointment Queue */}
                <div className="lg:col-span-1">
                  <AppointmentQueue
                    appointments={filteredAppointments}
                    onAppointmentClick={handleAppointmentClick}
                    onStatusChange={handleStatusChange}
                    selectedDate={currentDate}
                  />
                </div>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                      <Icon name="CheckCircle" size={20} className="text-success" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {filteredAppointments?.filter(apt => apt?.status === 'completed')?.length}
                      </p>
                      <p className="text-sm text-muted-foreground">Completadas Hoy</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-warning/20 rounded-full flex items-center justify-center">
                      <Icon name="Clock" size={20} className="text-warning" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {filteredAppointments?.filter(apt => apt?.status === 'in-progress')?.length}
                      </p>
                      <p className="text-sm text-muted-foreground">En Progreso</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                      <Icon name="Calendar" size={20} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {filteredAppointments?.filter(apt => apt?.status === 'confirmed')?.length}
                      </p>
                      <p className="text-sm text-muted-foreground">Confirmadas</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-error/20 rounded-full flex items-center justify-center">
                      <Icon name="XCircle" size={20} className="text-error" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {filteredAppointments?.filter(apt => apt?.status === 'cancelled')?.length}
                      </p>
                      <p className="text-sm text-muted-foreground">Canceladas</p>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>

        {/* Modals */}
        <AppointmentModal
          isOpen={isAppointmentModalOpen}
          onClose={() => setIsAppointmentModalOpen(false)}
          appointment={selectedAppointment}
          onSave={handleAppointmentSave}
          onDelete={handleAppointmentDelete}
          customers={mockCustomers}
          services={mockServices}
        />

        <WalkInRegistration
          isOpen={isWalkInModalOpen}
          onClose={() => setIsWalkInModalOpen(false)}
          onRegister={handleWalkInRegister}
          services={mockServices}
          staff={mockStaff}
        />
      </div>
    </>
  );
};

export default AppointmentManagement;