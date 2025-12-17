import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AppointmentQueue = ({ 
  appointments, 
  onAppointmentClick, 
  onStatusChange, 
  selectedDate 
}) => {
  const formatTime = (date) => {
    return date?.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-success bg-success/10 border-success/20';
      case 'in-progress':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'completed':
        return 'text-accent bg-accent/10 border-accent/20';
      case 'cancelled':
        return 'text-error bg-error/10 border-error/20';
      default:
        return 'text-muted-foreground bg-muted/10 border-border';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'in-progress':
        return 'En Progreso';
      case 'completed':
        return 'Completada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return 'Pendiente';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return 'CheckCircle';
      case 'in-progress':
        return 'Clock';
      case 'completed':
        return 'CheckCircle2';
      case 'cancelled':
        return 'XCircle';
      default:
        return 'Circle';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return 'AlertTriangle';
      case 'medium':
        return 'AlertCircle';
      default:
        return null;
    }
  };

  const todayAppointments = appointments?.filter(apt => 
    apt?.date?.toDateString() === selectedDate?.toDateString()
  )?.sort((a, b) => a?.date?.getTime() - b?.date?.getTime());

  const upcomingAppointments = appointments?.filter(apt => 
    apt?.date > selectedDate && apt?.status !== 'cancelled'
  )?.sort((a, b) => a?.date?.getTime() - b?.date?.getTime())?.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Today's Queue */}
      <div className="bg-card rounded-lg border border-border">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              Cola de Hoy
            </h3>
            <div className="flex items-center space-x-2">
              <div className="text-sm text-muted-foreground">
                {todayAppointments?.length} citas
              </div>
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {todayAppointments?.length === 0 ? (
            <div className="p-6 text-center">
              <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No hay citas programadas para hoy</p>
            </div>
          ) : (
            <div className="space-y-2 p-4">
              {todayAppointments?.map((appointment, index) => (
                <div
                  key={appointment?.id}
                  onClick={() => onAppointmentClick(appointment)}
                  className="flex items-center space-x-4 p-3 rounded-md hover:bg-muted/50 cursor-pointer transition-micro border border-transparent hover:border-border"
                >
                  {/* Turn Number */}
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  
                  {/* Appointment Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-foreground truncate">
                        {appointment?.customerName}
                      </h4>
                      {appointment?.priority && getPriorityIcon(appointment?.priority) && (
                        <Icon 
                          name={getPriorityIcon(appointment?.priority)} 
                          size={16} 
                          className={appointment?.priority === 'high' ? 'text-error' : 'text-warning'} 
                        />
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center space-x-1">
                        <Icon name="Clock" size={14} />
                        <span>{formatTime(appointment?.date)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Icon name="Scissors" size={14} />
                        <span>{appointment?.service}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Icon name="Timer" size={14} />
                        <span>{appointment?.duration} min</span>
                      </span>
                    </div>
                    {appointment?.notes && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {appointment?.notes}
                      </p>
                    )}
                  </div>
                  
                  {/* Status Badge */}
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment?.status)}`}>
                    <Icon name={getStatusIcon(appointment?.status)} size={12} />
                    <span>{getStatusLabel(appointment?.status)}</span>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex items-center space-x-1">
                    {appointment?.status === 'confirmed' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e?.stopPropagation();
                          onStatusChange(appointment?.id, 'in-progress');
                        }}
                        iconName="Play"
                        className="h-8 w-8 p-0"
                      />
                    )}
                    {appointment?.status === 'in-progress' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e?.stopPropagation();
                          onStatusChange(appointment?.id, 'completed');
                        }}
                        iconName="Check"
                        className="h-8 w-8 p-0"
                      />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e?.stopPropagation();
                        onAppointmentClick(appointment);
                      }}
                      iconName="MoreVertical"
                      className="h-8 w-8 p-0"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Upcoming Appointments */}
      <div className="bg-card rounded-lg border border-border">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            Próximas Citas
          </h3>
        </div>
        
        <div className="max-h-64 overflow-y-auto">
          {upcomingAppointments?.length === 0 ? (
            <div className="p-6 text-center">
              <Icon name="CalendarDays" size={48} className="text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No hay citas próximas</p>
            </div>
          ) : (
            <div className="space-y-2 p-4">
              {upcomingAppointments?.map((appointment) => (
                <div
                  key={appointment?.id}
                  onClick={() => onAppointmentClick(appointment)}
                  className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-micro"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                    <Icon name="Calendar" size={12} className="text-muted-foreground" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground text-sm truncate">
                        {appointment?.customerName}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(appointment?.date)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                      <span>{formatTime(appointment?.date)}</span>
                      <span>{appointment?.service}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Queue Statistics */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="text-lg font-semibold text-foreground mb-3">
          Estadísticas de Cola
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-success">
              {todayAppointments?.filter(apt => apt?.status === 'completed')?.length}
            </div>
            <div className="text-sm text-muted-foreground">Completadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">
              {todayAppointments?.filter(apt => apt?.status === 'in-progress')?.length}
            </div>
            <div className="text-sm text-muted-foreground">En Progreso</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">
              {todayAppointments?.filter(apt => apt?.status === 'confirmed')?.length}
            </div>
            <div className="text-sm text-muted-foreground">Pendientes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-error">
              {todayAppointments?.filter(apt => apt?.status === 'cancelled')?.length}
            </div>
            <div className="text-sm text-muted-foreground">Canceladas</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentQueue;