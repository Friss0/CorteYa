import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DashboardHeader = ({ userName = "Carlos Mendoza", businessName = "Barbería El Clásico", onExportReport, onQuickAction }) => {
  const currentDate = new Date()?.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Welcome Section */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <Icon name="User" size={24} color="white" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">
              ¡Bienvenido, {userName}!
            </h1>
            <p className="text-muted-foreground font-body">
              {businessName} • {currentDate}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant="default"
            iconName="Calendar"
            iconPosition="left"
            onClick={() => onQuickAction('appointments')}
            className="flex-1 sm:flex-none"
          >
            Nueva Cita
          </Button>
          <Button
            variant="outline"
            iconName="Users"
            iconPosition="left"
            onClick={() => onQuickAction('customers')}
            className="flex-1 sm:flex-none"
          >
            Clientes
          </Button>
          <Button
            variant="secondary"
            iconName="Download"
            iconPosition="left"
            onClick={onExportReport}
            className="flex-1 sm:flex-none"
          >
            Exportar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;