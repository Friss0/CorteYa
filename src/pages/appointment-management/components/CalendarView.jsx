import React, { useState } from 'react';

import Button from '../../../components/ui/Button';

const CalendarView = ({ 
  currentDate, 
  onDateChange, 
  appointments, 
  onAppointmentClick, 
  onAppointmentDrop,
  viewMode,
  onViewModeChange 
}) => {
  const [draggedAppointment, setDraggedAppointment] = useState(null);

  const formatDate = (date) => {
    return date?.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date?.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysInMonth = (date) => {
    const year = date?.getFullYear();
    const month = date?.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay?.getDate();
    const startingDayOfWeek = firstDay?.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days?.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days?.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getWeekDays = (date) => {
    const startOfWeek = new Date(date);
    let day = startOfWeek?.getDay();
    const diff = startOfWeek?.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek?.setDate(diff);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      let day = new Date(startOfWeek);
      day?.setDate(startOfWeek?.getDate() + i);
      days?.push(day);
    }
    return days;
  };

  const getAppointmentsForDate = (date) => {
    return appointments?.filter(apt => 
      apt?.date?.toDateString() === date?.toDateString()
    );
  };

  const handleDragStart = (e, appointment) => {
    setDraggedAppointment(appointment);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetDate) => {
    e?.preventDefault();
    if (draggedAppointment && onAppointmentDrop) {
      onAppointmentDrop(draggedAppointment, targetDate);
    }
    setDraggedAppointment(null);
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate?.setMonth(currentDate?.getMonth() + direction);
    } else if (viewMode === 'week') {
      newDate?.setDate(currentDate?.getDate() + (direction * 7));
    } else {
      newDate?.setDate(currentDate?.getDate() + direction);
    }
    onDateChange(newDate);
  };

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate);
    const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    return (
      <div className="bg-card rounded-lg border border-border">
        <div className="grid grid-cols-7 gap-px bg-border">
          {weekDays?.map(day => (
            <div key={day} className="bg-muted p-3 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px bg-border">
          {days?.map((day, index) => (
            <div
              key={index}
              className={`bg-card min-h-[120px] p-2 ${
                day ? 'hover:bg-muted/50 cursor-pointer' : ''
              }`}
              onDragOver={day ? handleDragOver : undefined}
              onDrop={day ? (e) => handleDrop(e, day) : undefined}
            >
              {day && (
                <>
                  <div className={`text-sm font-medium mb-2 ${
                    day?.toDateString() === new Date()?.toDateString() 
                      ? 'text-accent' :'text-foreground'
                  }`}>
                    {day?.getDate()}
                  </div>
                  <div className="space-y-1">
                    {getAppointmentsForDate(day)?.slice(0, 3)?.map(appointment => (
                      <div
                        key={appointment?.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, appointment)}
                        onClick={() => onAppointmentClick(appointment)}
                        className={`text-xs p-1 rounded cursor-pointer transition-micro ${
                          appointment?.status === 'confirmed' ? 'bg-success/20 text-success' :
                          appointment?.status === 'in-progress' ? 'bg-warning/20 text-warning' :
                          appointment?.status === 'completed'? 'bg-accent/20 text-accent' : 'bg-error/20 text-error'
                        }`}
                      >
                        <div className="font-medium truncate">{appointment?.customerName}</div>
                        <div className="opacity-75">{formatTime(appointment?.date)}</div>
                      </div>
                    ))}
                    {getAppointmentsForDate(day)?.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{getAppointmentsForDate(day)?.length - 3} más
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays(currentDate);
    const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

    return (
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="grid grid-cols-8 gap-px bg-border">
          <div className="bg-muted p-3 text-center text-sm font-medium text-muted-foreground">
            Hora
          </div>
          {weekDays?.map(day => (
            <div key={day?.toISOString()} className="bg-muted p-3 text-center">
              <div className="text-sm font-medium text-foreground">
                {day?.toLocaleDateString('es-ES', { weekday: 'short' })}
              </div>
              <div className={`text-lg font-semibold ${
                day?.toDateString() === new Date()?.toDateString() 
                  ? 'text-accent' :'text-muted-foreground'
              }`}>
                {day?.getDate()}
              </div>
            </div>
          ))}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {hours?.map(hour => (
            <div key={hour} className="grid grid-cols-8 gap-px bg-border">
              <div className="bg-card p-2 text-center text-sm text-muted-foreground">
                {hour}:00
              </div>
              {weekDays?.map(day => {
                const dayAppointments = getAppointmentsForDate(day)?.filter(apt => 
                  apt?.date?.getHours() === hour
                );
                return (
                  <div
                    key={`${day?.toISOString()}-${hour}`}
                    className="bg-card min-h-[60px] p-1 hover:bg-muted/50"
                    onDragOver={handleDragOver}
                    onDrop={(e) => {
                      const newDate = new Date(day);
                      newDate?.setHours(hour, 0, 0, 0);
                      handleDrop(e, newDate);
                    }}
                  >
                    {dayAppointments?.map(appointment => (
                      <div
                        key={appointment?.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, appointment)}
                        onClick={() => onAppointmentClick(appointment)}
                        className={`text-xs p-1 rounded cursor-pointer mb-1 ${
                          appointment?.status === 'confirmed' ? 'bg-success/20 text-success' :
                          appointment?.status === 'in-progress' ? 'bg-warning/20 text-warning' :
                          appointment?.status === 'completed'? 'bg-accent/20 text-accent' : 'bg-error/20 text-error'
                        }`}
                      >
                        <div className="font-medium truncate">{appointment?.customerName}</div>
                        <div className="opacity-75">{appointment?.service}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const hours = Array.from({ length: 12 }, (_, i) => i + 8);
    const dayAppointments = getAppointmentsForDate(currentDate);

    return (
      <div className="bg-card rounded-lg border border-border">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            {formatDate(currentDate)}
          </h3>
          <p className="text-sm text-muted-foreground">
            {dayAppointments?.length} citas programadas
          </p>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {hours?.map(hour => {
            const hourAppointments = dayAppointments?.filter(apt => 
              apt?.date?.getHours() === hour
            );
            return (
              <div key={hour} className="flex border-b border-border">
                <div className="w-20 p-3 text-center text-sm text-muted-foreground bg-muted/50">
                  {hour}:00
                </div>
                <div className="flex-1 p-3 min-h-[60px]">
                  {hourAppointments?.map(appointment => (
                    <div
                      key={appointment?.id}
                      onClick={() => onAppointmentClick(appointment)}
                      className={`p-3 rounded-md mb-2 cursor-pointer transition-micro ${
                        appointment?.status === 'confirmed' ? 'bg-success/20 border-l-4 border-success' :
                        appointment?.status === 'in-progress' ? 'bg-warning/20 border-l-4 border-warning' :
                        appointment?.status === 'completed'? 'bg-accent/20 border-l-4 border-accent' : 'bg-error/20 border-l-4 border-error'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-foreground">{appointment?.customerName}</h4>
                          <p className="text-sm text-muted-foreground">{appointment?.service}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatTime(appointment?.date)} - {appointment?.duration} min
                          </p>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          appointment?.status === 'confirmed' ? 'bg-success text-success-foreground' :
                          appointment?.status === 'in-progress' ? 'bg-warning text-warning-foreground' :
                          appointment?.status === 'completed' ? 'bg-accent text-accent-foreground' :
                          'bg-error text-error-foreground'
                        }`}>
                          {appointment?.status === 'confirmed' ? 'Confirmada' :
                           appointment?.status === 'in-progress' ? 'En Progreso' :
                           appointment?.status === 'completed' ? 'Completada' :
                           'Cancelada'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateDate(-1)}
            iconName="ChevronLeft"
            iconPosition="left"
          >
            Anterior
          </Button>
          <h2 className="text-xl font-semibold text-foreground">
            {viewMode === 'month' && currentDate?.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            {viewMode === 'week' && `Semana del ${formatDate(getWeekDays(currentDate)?.[0])}`}
            {viewMode === 'day' && formatDate(currentDate)}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateDate(1)}
            iconName="ChevronRight"
            iconPosition="right"
          >
            Siguiente
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'day' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('day')}
          >
            Día
          </Button>
          <Button
            variant={viewMode === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('week')}
          >
            Semana
          </Button>
          <Button
            variant={viewMode === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('month')}
          >
            Mes
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDateChange(new Date())}
          >
            Hoy
          </Button>
        </div>
      </div>
      {/* Calendar Content */}
      {viewMode === 'month' && renderMonthView()}
      {viewMode === 'week' && renderWeekView()}
      {viewMode === 'day' && renderDayView()}
    </div>
  );
};

export default CalendarView;