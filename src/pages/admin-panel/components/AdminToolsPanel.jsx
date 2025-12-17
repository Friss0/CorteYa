import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const AdminToolsPanel = ({ onToolAction }) => {
  const [selectedTool, setSelectedTool] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const adminTools = [
    {
      id: 'system-backup',
      name: 'Respaldo del Sistema',
      description: 'Crear copia de seguridad completa de la base de datos',
      icon: 'Download',
      color: 'bg-primary',
      action: 'backup'
    },
    {
      id: 'maintenance-mode',
      name: 'Modo Mantenimiento',
      description: 'Activar/desactivar el modo de mantenimiento del sistema',
      icon: 'Wrench',
      color: 'bg-warning',
      action: 'maintenance'
    },
    {
      id: 'send-notifications',
      name: 'Notificaciones Masivas',
      description: 'Enviar notificaciones a todos los usuarios activos',
      icon: 'Bell',
      color: 'bg-accent',
      action: 'notifications'
    },
    {
      id: 'system-reports',
      name: 'Generar Reportes',
      description: 'Crear reportes detallados del sistema y usuarios',
      icon: 'FileText',
      color: 'bg-success',
      action: 'reports'
    },
    {
      id: 'audit-logs',
      name: 'Logs de Auditoría',
      description: 'Revisar registros de actividad administrativa',
      icon: 'Eye',
      color: 'bg-secondary',
      action: 'audit'
    },
    {
      id: 'system-cleanup',
      name: 'Limpieza del Sistema',
      description: 'Eliminar archivos temporales y optimizar rendimiento',
      icon: 'Trash2',
      color: 'bg-error',
      action: 'cleanup'
    }
  ];

  const reportOptions = [
    { value: 'users', label: 'Reporte de Usuarios' },
    { value: 'revenue', label: 'Reporte de Ingresos' },
    { value: 'appointments', label: 'Reporte de Citas' },
    { value: 'system', label: 'Reporte del Sistema' }
  ];

  const notificationOptions = [
    { value: 'maintenance', label: 'Notificación de Mantenimiento' },
    { value: 'update', label: 'Actualización del Sistema' },
    { value: 'promotion', label: 'Promoción Especial' },
    { value: 'custom', label: 'Mensaje Personalizado' }
  ];

  const handleToolAction = async (tool) => {
    setIsProcessing(true);

    try {
      // Simulate processing time
      // Simulate API call
      // await new Promise(resolve => setTimeout(resolve, 2000)); // Delay removed

      onToolAction(tool?.action, {
        toolId: tool?.id,
        timestamp: new Date()?.toISOString()
      });

      console.log(`Executing ${tool?.name}...`);

    } catch (error) {
      console.error('Error executing tool:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const SystemStatusCard = () => (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
        <Icon name="Activity" size={20} className="mr-2 text-success" />
        Estado del Sistema
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-muted rounded-md">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-sm font-medium text-foreground">Servidor Principal</span>
          </div>
          <span className="text-xs text-success font-medium">OPERATIVO</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-muted rounded-md">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-sm font-medium text-foreground">Base de Datos</span>
          </div>
          <span className="text-xs text-success font-medium">OPERATIVO</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-muted rounded-md">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-warning rounded-full"></div>
            <span className="text-sm font-medium text-foreground">Sistema de Emails</span>
          </div>
          <span className="text-xs text-warning font-medium">LENTO</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-muted rounded-md">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-sm font-medium text-foreground">API Externa</span>
          </div>
          <span className="text-xs text-success font-medium">OPERATIVO</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Tiempo de actividad</p>
            <p className="font-medium text-foreground">99.8%</p>
          </div>
          <div>
            <p className="text-muted-foreground">Último respaldo</p>
            <p className="font-medium text-foreground">Hace 2 horas</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* System Status */}
      <SystemStatusCard />
      {/* Admin Tools Grid */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
          <Icon name="Settings" size={20} className="mr-2 text-accent" />
          Herramientas Administrativas
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminTools?.map((tool) => (
            <div key={tool?.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-micro">
              <div className="flex items-start space-x-3 mb-3">
                <div className={`w-10 h-10 ${tool?.color} rounded-md flex items-center justify-center`}>
                  <Icon name={tool?.icon} size={20} color="white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{tool?.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{tool?.description}</p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToolAction(tool)}
                disabled={isProcessing}
                loading={isProcessing}
                iconName={tool?.icon}
                iconPosition="left"
                className="w-full"
              >
                {isProcessing ? 'Procesando...' : 'Ejecutar'}
              </Button>
            </div>
          ))}
        </div>
      </div>
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Generate Reports */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h4 className="font-semibold text-foreground mb-4 flex items-center">
            <Icon name="FileText" size={18} className="mr-2 text-success" />
            Generar Reportes
          </h4>

          <div className="space-y-4">
            <Select
              options={reportOptions}
              value={selectedTool}
              onChange={setSelectedTool}
              placeholder="Selecciona tipo de reporte"
            />

            <Button
              variant="outline"
              onClick={() => onToolAction('generate-report', { type: selectedTool })}
              disabled={!selectedTool || isProcessing}
              iconName="Download"
              iconPosition="left"
              className="w-full"
            >
              Generar y Descargar
            </Button>
          </div>
        </div>

        {/* Send Notifications */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h4 className="font-semibold text-foreground mb-4 flex items-center">
            <Icon name="Bell" size={18} className="mr-2 text-accent" />
            Notificaciones Masivas
          </h4>

          <div className="space-y-4">
            <Select
              options={notificationOptions}
              value={selectedTool}
              onChange={setSelectedTool}
              placeholder="Tipo de notificación"
            />

            <Button
              variant="outline"
              onClick={() => onToolAction('send-notification', { type: selectedTool })}
              disabled={!selectedTool || isProcessing}
              iconName="Send"
              iconPosition="left"
              className="w-full"
            >
              Enviar a Todos
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminToolsPanel;