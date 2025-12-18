import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import UserProfileDropdown from '../../../components/ui/UserProfileDropdown';
import BreadcrumbNavigation from '../../../components/ui/BreadcrumbNavigation';

const AdminHeader = ({ onCreateUser, onRefresh, lastUpdated, stats }) => {
  const formatLastUpdated = (timestamp) => {
    return new Date(timestamp)?.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Define custom breadcrumbs for admin panel
  const customBreadcrumbs = [
    {
      label: 'Panel de Administración',
      path: '/admin-panel',
      icon: 'Shield',
      isActive: true
    }
  ];

  return (
    <div className="bg-card border-b border-border">
      <div className="px-6 py-4">
        {/* Breadcrumb */}
        <BreadcrumbNavigation customBreadcrumbs={customBreadcrumbs} />

        {/* Header Content */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Title and Description */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-error rounded-lg flex items-center justify-center">
              <Icon name="Shield" size={24} color="white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Panel de Administración</h1>
            </div>
          </div>

          {/* Actions and Profile */}
          <div className="flex items-center space-x-4">
            {/* System Status */}
            <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span>Sistema operativo</span>
              </div>
              <span>•</span>
              <span>Actualizado: {formatLastUpdated(lastUpdated)}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                iconName="RefreshCw"
                iconPosition="left"
                className="hidden sm:flex"
              >
                Actualizar
              </Button>

              <Button
                variant="default"
                size="sm"
                onClick={onCreateUser}
                iconName="UserPlus"
                iconPosition="left"
              >
                <span className="hidden sm:inline">Nuevo Usuario</span>
                <span className="sm:hidden">Nuevo</span>
              </Button>
            </div>

            {/* Admin Profile */}
            <UserProfileDropdown
              userName="Administrador"
              userRole="admin"
              userEmail="admin@barberturn.com"
            />
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-muted rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Icon name="Users" size={16} className="text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Usuarios Totales</p>
                <p className="text-lg font-bold text-primary">{stats?.totalUsers || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Icon name="UserCheck" size={16} className="text-success" />
              <div>
                <p className="text-sm font-medium text-foreground">Activos Hoy</p>
                <p className="text-lg font-bold text-success">{stats?.activeUsers || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Icon name="Calendar" size={16} className="text-accent" />
              <div>
                <p className="text-sm font-medium text-foreground">Citas Hoy</p>
                <p className="text-lg font-bold text-accent">{stats?.platformUsage?.appointmentsToday || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-warning" />
              <div>
                <p className="text-sm font-medium text-foreground">Tickets Abiertos</p>
                <p className="text-lg font-bold text-warning">{stats?.platformUsage?.openTickets || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;