import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const UserCreationModal = ({ isOpen, onClose, onCreateUser, editMode = false, userData = null }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    dni: '',
    email: '',
    phone: '',
    location: '',
    subscriptionPlan: 'basic',
    sendWelcomeEmail: true,
    autoActivate: true
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const planOptions = [
    { value: 'trial', label: 'Prueba Gratuita (30 días)' },
    { value: 'basic', label: 'Plan Básico - €29/mes' },
    { value: 'premium', label: 'Plan Premium - €59/mes' }
  ];

  const locationOptions = [
    { value: 'buenosaires', label: 'Buenos Aires' },
    { value: 'cordoba', label: 'Córdoba' },
    { value: 'santafe', label: 'Santa Fe' },
    { value: 'mendoza', label: 'Mendoza' },
    { value: 'tucuman', label: 'Tucumán' },
    { value: 'entrerios', label: 'Entre Ríos' },
    { value: 'salta', label: 'Salta' },
    { value: 'chaco', label: 'Chaco' },
    { value: 'corrientes', label: 'Corrientes' },
    { value: 'misiones', label: 'Misiones' },
    { value: 'sanluís', label: 'San Luis' },
    { value: 'sanjuan', label: 'San Juan' },
    { value: 'jujuy', label: 'Jujuy' },
    { value: 'rionegro', label: 'Río Negro' },
    { value: 'neuquen', label: 'Neuquén' },
    { value: 'chubut', label: 'Chubut' },
    { value: 'santacruz', label: 'Santa Cruz' },
    { value: 'tierradelfuego', label: 'Tierra del Fuego' },
    { value: 'formosa', label: 'Formosa' },
    { value: 'lapampa', label: 'La Pampa' },
    { value: 'larioja', label: 'La Rioja' },
    { value: 'catamarca', label: 'Catamarca' },
    { value: 'santiago', label: 'Santiago del Estero' }
  ];

  // Helper to generate random CABA location
  const generateRandomCabaLocation = () => {
    // CABA rough bounds
    const minLat = -34.69;
    const maxLat = -34.54;
    const minLng = -58.52;
    const maxLng = -58.36;

    const lat = (Math.random() * (maxLat - minLat) + minLat).toFixed(6);
    const lng = (Math.random() * (maxLng - minLng) + minLng).toFixed(6);

    // Generic streets
    const streets = ['Av. Corrientes', 'Av. Rivadavia', 'Av. Santa Fe', 'Av. Cabildo', 'Av. Córdoba', 'Jerónimo Salguero', 'Gurruchaga', 'Thames'];
    const street = streets[Math.floor(Math.random() * streets.length)];
    const number = Math.floor(Math.random() * 8000) + 1;

    return {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      address: `${street} ${number}, CABA`,
      location: 'buenosaires' // Province
    };
  };

  // Load user data when editing
  useEffect(() => {
    if (editMode && userData) {
      setFormData({
        businessName: userData?.businessName || '',
        ownerName: userData?.ownerName || '',
        dni: userData?.dni || '',
        email: userData?.email || '',
        phone: userData?.phone || '',
        location: userData?.location || 'buenosaires',
        address: userData?.address || '',
        lat: userData?.lat || '',
        lng: userData?.lng || '',
        subscriptionPlan: userData?.subscriptionPlan || 'basic',
        sendWelcomeEmail: false,
        autoActivate: userData?.status === 'active'
      });
    } else {
      // New User: Pre-fill random CABA location
      const randomLoc = generateRandomCabaLocation();
      setFormData({
        businessName: '',
        ownerName: '',
        dni: '',
        email: '',
        phone: '',
        location: randomLoc.location,
        address: randomLoc.address,
        lat: randomLoc.lat,
        lng: randomLoc.lng,
        subscriptionPlan: 'basic',
        sendWelcomeEmail: true,
        autoActivate: true
      });
    }
  }, [editMode, userData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.businessName?.trim()) {
      newErrors.businessName = 'El nombre del negocio es obligatorio';
    }

    if (!formData?.ownerName?.trim()) {
      newErrors.ownerName = 'El nombre del propietario es obligatorio';
    }

    if (!formData?.dni?.trim()) {
      newErrors.dni = 'El DNI es obligatorio';
    } else if (!/^\d{7,9}$/.test(formData?.dni)) {
      newErrors.ownerName = 'El DNI debe tener entre 7 y 9 números';
    }

    if (!formData?.email?.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'El formato del email no es válido';
    }

    if (!formData?.phone?.trim()) {
      newErrors.phone = 'El teléfono es obligatorio';
    } else if (!/^[+]?[\d\s-()]{9,}$/?.test(formData?.phone)) {
      newErrors.phone = 'El formato del teléfono no es válido';
    }

    if (!formData?.location) {
      newErrors.location = 'La ubicación es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (editMode && userData) {
        // Update existing user
        const updatedUser = {
          ...userData,
          ...formData,
          status: formData?.autoActivate ? 'active' : 'inactive',
          lastActivity: new Date()?.toISOString()
        };
        await onCreateUser(updatedUser);
      } else {
        // Create new user
        const newUser = {
          ...formData,
          // Ensure lat/lng are numbers
          lat: parseFloat(formData.lat),
          lng: parseFloat(formData.lng),
          password: formData.dni, // Use DNI as password
          status: formData?.autoActivate ? 'active' : 'inactive',
          registrationDate: new Date()?.toISOString(),
          lastActivity: new Date()?.toISOString()
        };

        // Clean up undefined values before sending
        Object.keys(newUser).forEach(key =>
          newUser[key] === undefined && delete newUser[key]
        );

        await onCreateUser(newUser);
      }

      onClose();

      // Reset form if creating (re-randomize)
      if (!editMode) {
        const randomLoc = generateRandomCabaLocation();
        setFormData({
          businessName: '',
          ownerName: '',
          dni: '',
          email: '',
          phone: '',
          location: randomLoc.location,
          address: randomLoc.address,
          lat: randomLoc.lat,
          lng: randomLoc.lng,
          subscriptionPlan: 'basic',
          sendWelcomeEmail: true,
          autoActivate: true
        });
      }

    } catch (error) {
      console.error('Error saving user:', error);
      // alert('Error en el guardado: ' + error.message); // Suppress alert, let optimistic UI flow
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setErrors({});
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center">
              <Icon name={editMode ? "Edit" : "UserPlus"} size={20} color="white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {editMode ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {editMode ? 'Actualiza la información del usuario' : 'Registra una nueva barbería en el sistema'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={isSubmitting}
            iconName="X"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Business Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground flex items-center">
              <Icon name="Store" size={18} className="mr-2 text-accent" />
              Información del Negocio
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre del Negocio"
                type="text"
                placeholder="Ej: Barbería El Corte Perfecto"
                value={formData?.businessName}
                onChange={(e) => handleInputChange('businessName', e?.target?.value)}
                error={errors?.businessName}
                required
                disabled={isSubmitting}
              />

              <Select
                label="Provincia / Ubicación"
                options={locationOptions}
                value={formData?.location}
                onChange={(value) => handleInputChange('location', value)}
                error={errors?.location}
                placeholder="Selecciona una ciudad"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Address and Coords (New) */}
            <div className="grid grid-cols-1 gap-4">
              <Input
                label="Dirección"
                type="text"
                placeholder="Ej: Av. Corrientes 1234, CABA"
                value={formData?.address}
                onChange={(e) => handleInputChange('address', e?.target?.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Latitud"
                type="number"
                step="any"
                value={formData?.lat}
                onChange={(e) => handleInputChange('lat', e?.target?.value)}
                disabled={isSubmitting}
              />
              <Input
                label="Longitud"
                type="number"
                step="any"
                value={formData?.lng}
                onChange={(e) => handleInputChange('lng', e?.target?.value)}
                disabled={isSubmitting}
              />
            </div>

          </div>

          {/* Owner Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground flex items-center">
              <Icon name="User" size={18} className="mr-2 text-accent" />
              Información del Propietario
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre Completo"
                type="text"
                placeholder="Ej: Juan Carlos Pérez"
                value={formData?.ownerName}
                onChange={(e) => handleInputChange('ownerName', e?.target?.value)}
                error={errors?.ownerName}
                required
                disabled={isSubmitting}
              />

              <Input
                label="DNI"
                type="text"
                placeholder="Ej: 12345678"
                value={formData?.dni}
                onChange={(e) => handleInputChange('dni', e?.target?.value)}
                error={errors?.dni}
                required
                disabled={isSubmitting}
                description="Se usará como contraseña inicial"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email"
                type="email"
                placeholder="Ej: propietario@barberia.com"
                value={formData?.email}
                onChange={(e) => handleInputChange('email', e?.target?.value)}
                error={errors?.email}
                required
                disabled={isSubmitting}
              />

              <Input
                label="Teléfono"
                type="tel"
                placeholder="Ej: +54 9 11 1234 5678"
                value={formData?.phone}
                onChange={(e) => handleInputChange('phone', e?.target?.value)}
                error={errors?.phone}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>



          {/* Configuration Options - Only show for new users */}
          {!editMode && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground flex items-center">
                <Icon name="Settings" size={18} className="mr-2 text-accent" />
                Configuración Inicial
              </h3>

              <div className="space-y-3">
                <Checkbox
                  label="Enviar email de bienvenida"
                  description="Se enviará un email con las credenciales de acceso"
                  checked={formData?.sendWelcomeEmail}
                  onChange={(e) => handleInputChange('sendWelcomeEmail', e?.target?.checked)}
                  disabled={isSubmitting}
                />

                <Checkbox
                  label="Activar cuenta automáticamente"
                  description="La cuenta estará lista para usar inmediatamente"
                  checked={formData?.autoActivate}
                  onChange={(e) => handleInputChange('autoActivate', e?.target?.checked)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          )}

          {/* Status toggle for edit mode */}
          {editMode && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground flex items-center">
                <Icon name="Settings" size={18} className="mr-2 text-accent" />
                Estado de la Cuenta
              </h3>

              <Checkbox
                label="Cuenta activa"
                description="Desmarcar para desactivar temporalmente la cuenta"
                checked={formData?.autoActivate}
                onChange={(e) => handleInputChange('autoActivate', e?.target?.checked)}
                disabled={isSubmitting}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              iconName={editMode ? "Save" : "UserPlus"}
              iconPosition="left"
              className="flex-1 sm:flex-none"
            >
              {isSubmitting
                ? (editMode ? 'Guardando...' : 'Creando Usuario...')
                : (editMode ? 'Guardar Cambios' : 'Crear Usuario')
              }
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserCreationModal;