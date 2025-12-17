import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';


const PersonalInfoTab = () => {
  const [personalData, setPersonalData] = useState({
    firstName: 'Carlos',
    lastName: 'Rodríguez',
    email: 'carlos.rodriguez@barberturn.com',
    phone: '+34 612 345 678',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setPersonalData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!personalData?.firstName?.trim()) {
      newErrors.firstName = 'El nombre es obligatorio';
    }

    if (!personalData?.lastName?.trim()) {
      newErrors.lastName = 'Los apellidos son obligatorios';
    }

    if (!personalData?.email?.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(personalData?.email)) {
      newErrors.email = 'Formato de email inválido';
    }

    if (!personalData?.phone?.trim()) {
      newErrors.phone = 'El teléfono es obligatorio';
    } else if (!/^\+?[1-9]\d{1,14}$/?.test(personalData?.phone?.replace(/\s/g, ''))) {
      newErrors.phone = 'Formato de teléfono inválido';
    }

    if (showPasswordFields) {
      if (!personalData?.currentPassword) {
        newErrors.currentPassword = 'La contraseña actual es obligatoria';
      }

      if (!personalData?.newPassword) {
        newErrors.newPassword = 'La nueva contraseña es obligatoria';
      } else if (personalData?.newPassword?.length < 8) {
        newErrors.newPassword = 'La contraseña debe tener al menos 8 caracteres';
      }

      if (personalData?.newPassword !== personalData?.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset password fields after successful update
      if (showPasswordFields) {
        setPersonalData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        setShowPasswordFields(false);
      }
      
      // Show success message (you could use a toast notification here)
      alert('Información personal actualizada correctamente');
      
    } catch (error) {
      console.error('Error updating personal info:', error);
      alert('Error al actualizar la información. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h3 className="text-lg font-semibold text-foreground">Información Personal</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Actualiza tu información personal y credenciales de acceso
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre"
            type="text"
            name="firstName"
            value={personalData?.firstName}
            onChange={handleInputChange}
            error={errors?.firstName}
            placeholder="Ingresa tu nombre"
            required
          />

          <Input
            label="Apellidos"
            type="text"
            name="lastName"
            value={personalData?.lastName}
            onChange={handleInputChange}
            error={errors?.lastName}
            placeholder="Ingresa tus apellidos"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Correo Electrónico"
            type="email"
            name="email"
            value={personalData?.email}
            onChange={handleInputChange}
            error={errors?.email}
            placeholder="correo@ejemplo.com"
            description="Este será tu usuario para iniciar sesión"
            required
          />

          <Input
            label="Teléfono"
            type="tel"
            name="phone"
            value={personalData?.phone}
            onChange={handleInputChange}
            error={errors?.phone}
            placeholder="+34 612 345 678"
            required
          />
        </div>

        {/* Password Section */}
        <div className="border-t border-border pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-md font-medium text-foreground">Cambiar Contraseña</h4>
              <p className="text-sm text-muted-foreground">
                Actualiza tu contraseña para mayor seguridad
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowPasswordFields(!showPasswordFields)}
              iconName={showPasswordFields ? "EyeOff" : "Eye"}
              iconPosition="left"
            >
              {showPasswordFields ? 'Cancelar' : 'Cambiar'}
            </Button>
          </div>

          {showPasswordFields && (
            <div className="space-y-4 bg-muted/30 p-4 rounded-md">
              <Input
                label="Contraseña Actual"
                type="password"
                name="currentPassword"
                value={personalData?.currentPassword}
                onChange={handleInputChange}
                error={errors?.currentPassword}
                placeholder="Ingresa tu contraseña actual"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nueva Contraseña"
                  type="password"
                  name="newPassword"
                  value={personalData?.newPassword}
                  onChange={handleInputChange}
                  error={errors?.newPassword}
                  placeholder="Mínimo 8 caracteres"
                  description="Debe contener al menos 8 caracteres"
                  required
                />

                <Input
                  label="Confirmar Contraseña"
                  type="password"
                  name="confirmPassword"
                  value={personalData?.confirmPassword}
                  onChange={handleInputChange}
                  error={errors?.confirmPassword}
                  placeholder="Repite la nueva contraseña"
                  required
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
            Guardar Cambios
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setPersonalData({
                firstName: 'Carlos',
                lastName: 'Rodríguez',
                email: 'carlos.rodriguez@barberturn.com',
                phone: '+34 612 345 678',
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
              });
              setErrors({});
              setShowPasswordFields(false);
            }}
            iconName="RotateCcw"
            iconPosition="left"
            className="sm:w-auto"
          >
            Restablecer
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfoTab;