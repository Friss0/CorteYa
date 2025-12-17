import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const NotificationTab = () => {
  const [notificationSettings, setNotificationSettings] = useState({
    email: {
      appointments: true,
      reminders: true,
      cancellations: true,
      promotions: false,
      systemUpdates: true,
      weeklyReports: true,
      monthlyReports: false
    },
    sms: {
      appointments: true,
      reminders: true,
      cancellations: true,
      promotions: false,
      emergencyAlerts: true
    },
    push: {
      appointments: true,
      reminders: false,
      cancellations: true,
      promotions: false,
      systemUpdates: false
    },
    dashboard: {
      realTimeUpdates: true,
      soundAlerts: false,
      desktopNotifications: true,
      badgeCounters: true
    }
  });

  const [preferences, setPreferences] = useState({
    reminderTiming: '24',
    reportFrequency: 'weekly',
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '08:00'
    },
    language: 'es',
    timezone: 'Europe/Madrid'
  });

  const [isLoading, setIsLoading] = useState(false);

  const reminderOptions = [
    { value: '15', label: '15 minutos antes' },
    { value: '30', label: '30 minutos antes' },
    { value: '60', label: '1 hora antes' },
    { value: '120', label: '2 horas antes' },
    { value: '1440', label: '24 horas antes' },
    { value: '2880', label: '48 horas antes' }
  ];

  const reportFrequencyOptions = [
    { value: 'daily', label: 'Diario' },
    { value: 'weekly', label: 'Semanal' },
    { value: 'monthly', label: 'Mensual' },
    { value: 'never', label: 'Nunca' }
  ];

  const languageOptions = [
    { value: 'es', label: 'Español' },
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'Français' },
    { value: 'pt', label: 'Português' }
  ];

  const timezoneOptions = [
    { value: 'Europe/Madrid', label: 'Madrid (GMT+1)' },
    { value: 'Europe/London', label: 'Londres (GMT+0)' },
    { value: 'Europe/Paris', label: 'París (GMT+1)' },
    { value: 'America/New_York', label: 'Nueva York (GMT-5)' },
    { value: 'America/Los_Angeles', label: 'Los Ángeles (GMT-8)' }
  ];

  const handleNotificationChange = (category, setting, value) => {
    setNotificationSettings(prev => ({
      ...prev,
      [category]: {
        ...prev?.[category],
        [setting]: value
      }
    }));
  };

  const handlePreferenceChange = (setting, value) => {
    setPreferences(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleQuietHoursChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      quietHours: {
        ...prev?.quietHours,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Configuración de notificaciones actualizada correctamente');
    } catch (error) {
      console.error('Error updating notification settings:', error);
      alert('Error al actualizar la configuración. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const testNotification = async (type) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      alert(`Notificación de prueba ${type} enviada correctamente`);
    } catch (error) {
      alert('Error al enviar la notificación de prueba');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h3 className="text-lg font-semibold text-foreground">Configuración de Notificaciones</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Personaliza cómo y cuándo recibir notificaciones del sistema
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Notifications */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Icon name="Mail" size={20} className="text-primary" />
              <div>
                <h4 className="text-md font-semibold text-foreground">Notificaciones por Email</h4>
                <p className="text-sm text-muted-foreground">carlos.rodriguez@barberturn.com</p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => testNotification('email')}
              iconName="Send"
              iconPosition="left"
            >
              Probar
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Checkbox
              checked={notificationSettings?.email?.appointments}
              onChange={(e) => handleNotificationChange('email', 'appointments', e?.target?.checked)}
              label="Nuevas citas"
              description="Cuando se agenda una nueva cita"
            />

            <Checkbox
              checked={notificationSettings?.email?.reminders}
              onChange={(e) => handleNotificationChange('email', 'reminders', e?.target?.checked)}
              label="Recordatorios de citas"
              description="Recordatorios automáticos"
            />

            <Checkbox
              checked={notificationSettings?.email?.cancellations}
              onChange={(e) => handleNotificationChange('email', 'cancellations', e?.target?.checked)}
              label="Cancelaciones"
              description="Cuando se cancela una cita"
            />

            <Checkbox
              checked={notificationSettings?.email?.promotions}
              onChange={(e) => handleNotificationChange('email', 'promotions', e?.target?.checked)}
              label="Promociones"
              description="Ofertas y promociones especiales"
            />

            <Checkbox
              checked={notificationSettings?.email?.systemUpdates}
              onChange={(e) => handleNotificationChange('email', 'systemUpdates', e?.target?.checked)}
              label="Actualizaciones del sistema"
              description="Nuevas funciones y mejoras"
            />

            <Checkbox
              checked={notificationSettings?.email?.weeklyReports}
              onChange={(e) => handleNotificationChange('email', 'weeklyReports', e?.target?.checked)}
              label="Reportes semanales"
              description="Resumen semanal de actividad"
            />
          </div>
        </div>

        {/* SMS Notifications */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Icon name="MessageSquare" size={20} className="text-success" />
              <div>
                <h4 className="text-md font-semibold text-foreground">Notificaciones por SMS</h4>
                <p className="text-sm text-muted-foreground">+34 612 345 678</p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => testNotification('SMS')}
              iconName="Send"
              iconPosition="left"
            >
              Probar
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Checkbox
              checked={notificationSettings?.sms?.appointments}
              onChange={(e) => handleNotificationChange('sms', 'appointments', e?.target?.checked)}
              label="Nuevas citas"
              description="Confirmación inmediata por SMS"
            />

            <Checkbox
              checked={notificationSettings?.sms?.reminders}
              onChange={(e) => handleNotificationChange('sms', 'reminders', e?.target?.checked)}
              label="Recordatorios"
              description="Recordatorios antes de la cita"
            />

            <Checkbox
              checked={notificationSettings?.sms?.cancellations}
              onChange={(e) => handleNotificationChange('sms', 'cancellations', e?.target?.checked)}
              label="Cancelaciones"
              description="Notificación de cancelaciones"
            />

            <Checkbox
              checked={notificationSettings?.sms?.emergencyAlerts}
              onChange={(e) => handleNotificationChange('sms', 'emergencyAlerts', e?.target?.checked)}
              label="Alertas de emergencia"
              description="Problemas críticos del sistema"
            />
          </div>
        </div>

        {/* Push Notifications */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Icon name="Bell" size={20} className="text-warning" />
              <div>
                <h4 className="text-md font-semibold text-foreground">Notificaciones Push</h4>
                <p className="text-sm text-muted-foreground">Notificaciones en tiempo real</p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => testNotification('push')}
              iconName="Send"
              iconPosition="left"
            >
              Probar
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Checkbox
              checked={notificationSettings?.push?.appointments}
              onChange={(e) => handleNotificationChange('push', 'appointments', e?.target?.checked)}
              label="Nuevas citas"
              description="Notificación instantánea"
            />

            <Checkbox
              checked={notificationSettings?.push?.cancellations}
              onChange={(e) => handleNotificationChange('push', 'cancellations', e?.target?.checked)}
              label="Cancelaciones"
              description="Cancelaciones inmediatas"
            />

            <Checkbox
              checked={notificationSettings?.push?.desktopNotifications}
              onChange={(e) => handleNotificationChange('push', 'desktopNotifications', e?.target?.checked)}
              label="Notificaciones de escritorio"
              description="Mostrar en el escritorio"
            />
          </div>
        </div>

        {/* Dashboard Notifications */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Icon name="Monitor" size={20} className="text-accent" />
            <div>
              <h4 className="text-md font-semibold text-foreground">Notificaciones del Dashboard</h4>
              <p className="text-sm text-muted-foreground">Configuración de la interfaz</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Checkbox
              checked={notificationSettings?.dashboard?.realTimeUpdates}
              onChange={(e) => handleNotificationChange('dashboard', 'realTimeUpdates', e?.target?.checked)}
              label="Actualizaciones en tiempo real"
              description="Actualizar datos automáticamente"
            />

            <Checkbox
              checked={notificationSettings?.dashboard?.soundAlerts}
              onChange={(e) => handleNotificationChange('dashboard', 'soundAlerts', e?.target?.checked)}
              label="Alertas sonoras"
              description="Sonidos para notificaciones"
            />

            <Checkbox
              checked={notificationSettings?.dashboard?.badgeCounters}
              onChange={(e) => handleNotificationChange('dashboard', 'badgeCounters', e?.target?.checked)}
              label="Contadores de notificaciones"
              description="Mostrar números en iconos"
            />
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h4 className="text-md font-semibold text-foreground mb-4">Preferencias de Notificación</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Select
                label="Tiempo de recordatorio"
                options={reminderOptions}
                value={preferences?.reminderTiming}
                onChange={(value) => handlePreferenceChange('reminderTiming', value)}
                description="Cuándo enviar recordatorios de citas"
              />

              <Select
                label="Frecuencia de reportes"
                options={reportFrequencyOptions}
                value={preferences?.reportFrequency}
                onChange={(value) => handlePreferenceChange('reportFrequency', value)}
                description="Con qué frecuencia recibir reportes"
              />
            </div>

            <div className="space-y-4">
              <Select
                label="Idioma de notificaciones"
                options={languageOptions}
                value={preferences?.language}
                onChange={(value) => handlePreferenceChange('language', value)}
                description="Idioma para todas las notificaciones"
              />

              <Select
                label="Zona horaria"
                options={timezoneOptions}
                value={preferences?.timezone}
                onChange={(value) => handlePreferenceChange('timezone', value)}
                description="Zona horaria para fechas y horas"
              />
            </div>
          </div>
        </div>

        {/* Quiet Hours */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-md font-semibold text-foreground">Horario de Silencio</h4>
              <p className="text-sm text-muted-foreground">
                No recibir notificaciones durante estas horas
              </p>
            </div>
            <Checkbox
              checked={preferences?.quietHours?.enabled}
              onChange={(e) => handleQuietHoursChange('enabled', e?.target?.checked)}
              label="Activar"
            />
          </div>

          {preferences?.quietHours?.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-md">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Hora de inicio
                </label>
                <input
                  type="time"
                  value={preferences?.quietHours?.start}
                  onChange={(e) => handleQuietHoursChange('start', e?.target?.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Hora de fin
                </label>
                <input
                  type="time"
                  value={preferences?.quietHours?.end}
                  onChange={(e) => handleQuietHoursChange('end', e?.target?.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
          <Button
            type="submit"
            variant="default"
            loading={isLoading}
            iconName="Save"
            iconPosition="left"
            className="sm:w-auto"
          >
            Guardar Configuración
          </Button>
          
          <Button
            type="button"
            variant="outline"
            iconName="RotateCcw"
            iconPosition="left"
            className="sm:w-auto"
          >
            Restablecer Predeterminados
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NotificationTab;