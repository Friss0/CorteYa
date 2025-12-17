import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AppointmentCalendar = ({ isDragging = false, ...dragProps }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const todayAppointments = [
    {
      id: 1,
      time: "09:00",
      client: "Miguel Rodríguez",
      service: "Corte + Barba",
      duration: "45 min",
      status: "confirmada",
      phone: "+34 612 345 678"
    },
    {
      id: 2,
      time: "10:30",
      client: "Carlos Fernández",
      service: "Corte Clásico",
      duration: "30 min",
      status: "pendiente",
      phone: "+34 698 765 432"
    },
    {
      id: 3,
      time: "12:00",
      client: "Antonio López",
      service: "Afeitado Tradicional",
      duration: "25 min",
      status: "confirmada",
      phone: "+34 654 321 987"
    },
    {
      id: 4,
      time: "14:30",
      client: "José García",
      service: "Corte + Lavado",
      duration: "40 min",
      status: "en_proceso",
      phone: "+34 677 888 999"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmada':
        return 'bg-success/10 text-success border-success/20';
      case 'pendiente':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'en_proceso':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'cancelada':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmada':
        return 'Confirmada';
      case 'pendiente':
        return 'Pendiente';
      case 'en_proceso':
        return 'En Proceso';
      case 'cancelada':
        return 'Cancelada';
      default:
        return 'Desconocido';
    }
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div
      {...dragProps}
      className={`
        bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200
        ${isDragging ? 'opacity-50 rotate-1 scale-105' : ''}
        cursor-move
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Calendar" size={20} className="text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground font-heading">
              Citas de Hoy
            </h3>
            <p className="text-sm text-muted-foreground">
              {formatDate(selectedDate)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            onClick={() => console.log('Nueva cita')}
          >
            Nueva
          </Button>
          
          <div className="opacity-30 hover:opacity-100 transition-opacity">
            <Icon name="GripVertical" size={16} className="text-muted-foreground" />
          </div>
        </div>
      </div>
      {/* Appointments List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {todayAppointments?.map((appointment) => (
          <div
            key={appointment?.id}
            className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <p className="text-lg font-bold text-foreground font-heading">
                  {appointment?.time}
                </p>
                <p className="text-xs text-muted-foreground">
                  {appointment?.duration}
                </p>
              </div>
              
              <div className="flex-1">
                <h4 className="font-semibold text-foreground font-body">
                  {appointment?.client}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {appointment?.service}
                </p>
                <p className="text-xs text-muted-foreground">
                  {appointment?.phone}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className={`
                px-3 py-1 rounded-full text-xs font-medium border
                ${getStatusColor(appointment?.status)}
              `}>
                {getStatusText(appointment?.status)}
              </span>
              
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => console.log('Editar cita', appointment?.id)}
                >
                  <Icon name="Edit2" size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => console.log('Llamar cliente', appointment?.phone)}
                >
                  <Icon name="Phone" size={16} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-xl font-bold text-success font-heading">
            {todayAppointments?.filter(apt => apt?.status === 'confirmada')?.length}
          </p>
          <p className="text-xs text-muted-foreground">Confirmadas</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-warning font-heading">
            {todayAppointments?.filter(apt => apt?.status === 'pendiente')?.length}
          </p>
          <p className="text-xs text-muted-foreground">Pendientes</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-accent font-heading">
            {todayAppointments?.filter(apt => apt?.status === 'en_proceso')?.length}
          </p>
          <p className="text-xs text-muted-foreground">En Proceso</p>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCalendar;