import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const SecurityTab = () => {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: true,
    sessionTimeout: '30',
    loginAlerts: true,
    deviceTracking: true,
    passwordExpiry: false
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  const loginHistory = [
    {
      id: 1,
      device: 'Chrome en Windows',
      location: 'Madrid, España',
      ip: '192.168.1.100',
      date: '2024-09-23 09:15:32',
      status: 'Exitoso',
      current: true
    },
    {
      id: 2,
      device: 'Safari en iPhone',
      location: 'Madrid, España',
      ip: '192.168.1.101',
      date: '2024-09-22 18:30:45',
      status: 'Exitoso',
      current: false
    },
    {
      id: 3,
      device: 'Chrome en Android',
      location: 'Barcelona, España',
      ip: '10.0.0.50',
      date: '2024-09-20 14:22:18',
      status: 'Fallido',
      current: false
    },
    {
      id: 4,
      device: 'Firefox en Windows',
      location: 'Madrid, España',
      ip: '192.168.1.100',
      date: '2024-09-19 11:45:12',
      status: 'Exitoso',
      current: false
    }
  ];

  const activeSessions = [
    {
      id: 1,
      device: 'Chrome en Windows',
      location: 'Madrid, España',
      ip: '192.168.1.100',
      lastActivity: '2024-09-23 09:15:32',
      current: true
    },
    {
      id: 2,
      device: 'Safari en iPhone',
      location: 'Madrid, España',
      ip: '192.168.1.101',
      lastActivity: '2024-09-22 18:30:45',
      current: false
    }
  ];

  const handleSecuritySettingChange = (setting, value) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e?.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData?.currentPassword) {
      newErrors.currentPassword = 'La contraseña actual es obligatoria';
    }

    if (!passwordData?.newPassword) {
      newErrors.newPassword = 'La nueva contraseña es obligatoria';
    } else if (passwordData?.newPassword?.length < 8) {
      newErrors.newPassword = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/?.test(passwordData?.newPassword)) {
      newErrors.newPassword = 'Debe contener mayúsculas, minúsculas y números';
    }

    if (passwordData?.newPassword !== passwordData?.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      alert('Contraseña actualizada correctamente');
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Error al actualizar la contraseña. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFactorToggle = async () => {
    if (!securitySettings?.twoFactorEnabled) {
      setShowQRCode(true);
    } else {
      const confirmed = window.confirm('¿Estás seguro de que deseas desactivar la autenticación de dos factores?');
      if (confirmed) {
        setIsLoading(true);
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          handleSecuritySettingChange('twoFactorEnabled', false);
          alert('Autenticación de dos factores desactivada');
        } catch (error) {
          alert('Error al desactivar 2FA');
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  const handleTwoFactorSetup = async () => {
    if (!twoFactorCode || twoFactorCode?.length !== 6) {
      setErrors({ twoFactorCode: 'Ingresa un código de 6 dígitos válido' });
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      handleSecuritySettingChange('twoFactorEnabled', true);
      setShowQRCode(false);
      setTwoFactorCode('');
      alert('Autenticación de dos factores activada correctamente');
    } catch (error) {
      setErrors({ twoFactorCode: 'Código inválido. Inténtalo de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTerminateSession = async (sessionId) => {
    const confirmed = window.confirm('¿Estás seguro de que deseas cerrar esta sesión?');
    if (confirmed) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        alert('Sesión terminada correctamente');
      } catch (error) {
        alert('Error al terminar la sesión');
      }
    }
  };

  const handleTerminateAllSessions = async () => {
    const confirmed = window.confirm('¿Estás seguro de que deseas cerrar todas las sesiones excepto la actual?');
    if (confirmed) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert('Todas las sesiones han sido terminadas');
      } catch (error) {
        alert('Error al terminar las sesiones');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h3 className="text-lg font-semibold text-foreground">Configuración de Seguridad</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Gestiona la seguridad de tu cuenta y controla el acceso
        </p>
      </div>
      {/* Password Change */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="Lock" size={20} className="text-primary" />
          <div>
            <h4 className="text-md font-semibold text-foreground">Cambiar Contraseña</h4>
            <p className="text-sm text-muted-foreground">
              Actualiza tu contraseña regularmente para mayor seguridad
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <Input
            label="Contraseña Actual"
            type="password"
            name="currentPassword"
            value={passwordData?.currentPassword}
            onChange={handlePasswordChange}
            error={errors?.currentPassword}
            placeholder="Ingresa tu contraseña actual"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nueva Contraseña"
              type="password"
              name="newPassword"
              value={passwordData?.newPassword}
              onChange={handlePasswordChange}
              error={errors?.newPassword}
              placeholder="Mínimo 8 caracteres"
              description="Debe contener mayúsculas, minúsculas y números"
              required
            />

            <Input
              label="Confirmar Nueva Contraseña"
              type="password"
              name="confirmPassword"
              value={passwordData?.confirmPassword}
              onChange={handlePasswordChange}
              error={errors?.confirmPassword}
              placeholder="Repite la nueva contraseña"
              required
            />
          </div>

          <Button
            type="submit"
            variant="default"
            loading={isLoading}
            iconName="Save"
            iconPosition="left"
            size="sm"
          >
            Actualizar Contraseña
          </Button>
        </form>
      </div>
      {/* Two-Factor Authentication */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Icon name="Shield" size={20} className="text-success" />
            <div>
              <h4 className="text-md font-semibold text-foreground">Autenticación de Dos Factores</h4>
              <p className="text-sm text-muted-foreground">
                Añade una capa extra de seguridad a tu cuenta
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${securitySettings?.twoFactorEnabled ? 'text-success' : 'text-muted-foreground'}`}>
              {securitySettings?.twoFactorEnabled ? 'Activado' : 'Desactivado'}
            </span>
            <Button
              variant={securitySettings?.twoFactorEnabled ? "outline" : "default"}
              size="sm"
              onClick={handleTwoFactorToggle}
              loading={isLoading}
            >
              {securitySettings?.twoFactorEnabled ? 'Desactivar' : 'Activar'}
            </Button>
          </div>
        </div>

        {showQRCode && (
          <div className="bg-muted/30 p-4 rounded-md">
            <h5 className="font-medium text-foreground mb-3">Configurar Autenticación de Dos Factores</h5>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-3">
                  1. Escanea este código QR con tu aplicación de autenticación (Google Authenticator, Authy, etc.)
                </p>
                <div className="w-48 h-48 bg-white border border-border rounded-md flex items-center justify-center mx-auto">
                  <div className="text-center">
                    <Icon name="QrCode" size={48} className="text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Código QR</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Clave manual: JBSWY3DPEHPK3PXP
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-3">
                  2. Ingresa el código de 6 dígitos generado por tu aplicación
                </p>
                <Input
                  label="Código de Verificación"
                  type="text"
                  value={twoFactorCode}
                  onChange={(e) => {
                    setTwoFactorCode(e?.target?.value);
                    if (errors?.twoFactorCode) {
                      setErrors(prev => ({ ...prev, twoFactorCode: '' }));
                    }
                  }}
                  error={errors?.twoFactorCode}
                  placeholder="123456"
                  maxLength={6}
                  className="mb-4"
                />
                
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={handleTwoFactorSetup}
                    loading={isLoading}
                    iconName="Check"
                    iconPosition="left"
                  >
                    Verificar y Activar
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowQRCode(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Security Settings */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="Settings" size={20} className="text-accent" />
          <div>
            <h4 className="text-md font-semibold text-foreground">Configuración de Seguridad</h4>
            <p className="text-sm text-muted-foreground">
              Personaliza las opciones de seguridad de tu cuenta
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
            <div>
              <p className="font-medium text-foreground">Alertas de inicio de sesión</p>
              <p className="text-sm text-muted-foreground">
                Recibir notificaciones cuando alguien acceda a tu cuenta
              </p>
            </div>
            <Checkbox
              checked={securitySettings?.loginAlerts}
              onChange={(e) => handleSecuritySettingChange('loginAlerts', e?.target?.checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
            <div>
              <p className="font-medium text-foreground">Seguimiento de dispositivos</p>
              <p className="text-sm text-muted-foreground">
                Registrar información de dispositivos y ubicaciones
              </p>
            </div>
            <Checkbox
              checked={securitySettings?.deviceTracking}
              onChange={(e) => handleSecuritySettingChange('deviceTracking', e?.target?.checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
            <div>
              <p className="font-medium text-foreground">Expiración automática de contraseña</p>
              <p className="text-sm text-muted-foreground">
                Solicitar cambio de contraseña cada 90 días
              </p>
            </div>
            <Checkbox
              checked={securitySettings?.passwordExpiry}
              onChange={(e) => handleSecuritySettingChange('passwordExpiry', e?.target?.checked)}
            />
          </div>

          <div className="p-3 bg-muted/30 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-foreground">Tiempo de inactividad de sesión</p>
              <select
                value={securitySettings?.sessionTimeout}
                onChange={(e) => handleSecuritySettingChange('sessionTimeout', e?.target?.value)}
                className="px-2 py-1 border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="15">15 minutos</option>
                <option value="30">30 minutos</option>
                <option value="60">1 hora</option>
                <option value="120">2 horas</option>
                <option value="480">8 horas</option>
              </select>
            </div>
            <p className="text-sm text-muted-foreground">
              Cerrar sesión automáticamente después del tiempo especificado
            </p>
          </div>
        </div>
      </div>
      {/* Active Sessions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Icon name="Monitor" size={20} className="text-warning" />
            <div>
              <h4 className="text-md font-semibold text-foreground">Sesiones Activas</h4>
              <p className="text-sm text-muted-foreground">
                Dispositivos con sesiones abiertas en tu cuenta
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleTerminateAllSessions}
            iconName="LogOut"
            iconPosition="left"
          >
            Cerrar Todas
          </Button>
        </div>

        <div className="space-y-3">
          {activeSessions?.map((session) => (
            <div key={session?.id} className="flex items-center justify-between p-3 border border-border rounded-md">
              <div className="flex items-center space-x-3">
                <Icon name="Monitor" size={16} className="text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">
                    {session?.device}
                    {session?.current && (
                      <span className="ml-2 px-2 py-1 bg-success/10 text-success text-xs rounded-full">
                        Actual
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {session?.location} • {session?.ip}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Última actividad: {new Date(session.lastActivity)?.toLocaleString('es-ES')}
                  </p>
                </div>
              </div>
              
              {!session?.current && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTerminateSession(session?.id)}
                  iconName="X"
                >
                  Cerrar
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Login History */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Icon name="History" size={20} className="text-muted-foreground" />
            <div>
              <h4 className="text-md font-semibold text-foreground">Historial de Accesos</h4>
              <p className="text-sm text-muted-foreground">
                Últimos intentos de acceso a tu cuenta
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
          >
            Exportar
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Dispositivo</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Ubicación</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Fecha</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Estado</th>
              </tr>
            </thead>
            <tbody>
              {loginHistory?.map((login) => (
                <tr key={login?.id} className="border-b border-border/50">
                  <td className="py-3 px-2">
                    <div className="flex items-center space-x-2">
                      <Icon name="Monitor" size={14} className="text-muted-foreground" />
                      <span className="text-sm text-foreground">
                        {login?.device}
                        {login?.current && (
                          <span className="ml-2 text-xs text-success">(Actual)</span>
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-sm text-foreground">
                    {login?.location}
                    <br />
                    <span className="text-xs text-muted-foreground">{login?.ip}</span>
                  </td>
                  <td className="py-3 px-2 text-sm text-foreground">
                    {new Date(login.date)?.toLocaleString('es-ES')}
                  </td>
                  <td className="py-3 px-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      login?.status === 'Exitoso' ?'bg-success/10 text-success' :'bg-error/10 text-error'
                    }`}>
                      {login?.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;