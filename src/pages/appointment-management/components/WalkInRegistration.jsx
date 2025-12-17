import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const WalkInRegistration = ({ 
  isOpen, 
  onClose, 
  onRegister, 
  services, 
  staff 
}) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    service: '',
    staffMember: '',
    estimatedWait: 15,
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const serviceOptions = services?.map(service => ({
    value: service?.name,
    label: `${service?.name} - ${service?.duration}min - $${service?.price}`,
    description: service?.description
  }));

  const staffOptions = [
    { value: '', label: 'Cualquier barbero disponible' },
    ...staff?.map(member => ({
      value: member?.name,
      label: member?.name,
      description: member?.specialties?.join(', ')
    }))
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleServiceSelect = (serviceName) => {
    const service = services?.find(s => s?.name === serviceName);
    if (service) {
      setFormData(prev => ({
        ...prev,
        service: serviceName,
        estimatedWait: service?.duration
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.customerName?.trim()) {
      newErrors.customerName = 'El nombre del cliente es obligatorio';
    }

    if (!formData?.service) {
      newErrors.service = 'Debe seleccionar un servicio';
    }

    if (formData?.customerPhone && !/^\d{9}$/?.test(formData?.customerPhone?.replace(/\s/g, ''))) {
      newErrors.customerPhone = 'Formato de teléfono inválido';
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
      const walkInData = {
        ...formData,
        id: Date.now(),
        type: 'walk-in',
        registeredAt: new Date(),
        status: 'waiting',
        queuePosition: 1 // This would be calculated based on current queue
      };

      await onRegister(walkInData);
      
      // Reset form
      setFormData({
        customerName: '',
        customerPhone: '',
        service: '',
        staffMember: '',
        estimatedWait: 15,
        notes: ''
      });
      
      onClose();
    } catch (error) {
      console.error('Error registering walk-in:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-warning/20 rounded-full flex items-center justify-center">
              <Icon name="UserPlus" size={20} className="text-warning" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Cliente Sin Cita
              </h2>
              <p className="text-sm text-muted-foreground">
                Registrar cliente en cola de espera
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
            className="h-8 w-8 p-0"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Nombre del Cliente"
            type="text"
            placeholder="Nombre completo"
            value={formData?.customerName}
            onChange={(e) => handleInputChange('customerName', e?.target?.value)}
            error={errors?.customerName}
            required
          />

          <Input
            label="Teléfono (Opcional)"
            type="tel"
            placeholder="123 456 789"
            value={formData?.customerPhone}
            onChange={(e) => handleInputChange('customerPhone', e?.target?.value)}
            error={errors?.customerPhone}
            description="Para notificaciones de turno"
          />

          <Select
            label="Servicio Solicitado"
            placeholder="Seleccionar servicio"
            options={serviceOptions}
            value={formData?.service}
            onChange={handleServiceSelect}
            error={errors?.service}
            required
          />

          <Select
            label="Barbero Preferido"
            placeholder="Seleccionar barbero"
            options={staffOptions}
            value={formData?.staffMember}
            onChange={(value) => handleInputChange('staffMember', value)}
            description="Opcional - se asignará automáticamente si no se especifica"
          />

          <Input
            label="Tiempo Estimado (min)"
            type="number"
            min="5"
            max="180"
            step="5"
            value={formData?.estimatedWait}
            onChange={(e) => handleInputChange('estimatedWait', parseInt(e?.target?.value))}
            description="Tiempo estimado de espera"
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Notas Adicionales
            </label>
            <textarea
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              rows="2"
              placeholder="Preferencias o notas especiales..."
              value={formData?.notes}
              onChange={(e) => handleInputChange('notes', e?.target?.value)}
            />
          </div>

          {/* Queue Info */}
          <div className="bg-muted/50 rounded-md p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Clock" size={16} className="text-warning" />
              <span className="text-sm font-medium text-foreground">
                Información de Cola
              </span>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Posición estimada:</span>
                <span className="font-medium">1° en cola</span>
              </div>
              <div className="flex justify-between">
                <span>Tiempo de espera:</span>
                <span className="font-medium">{formData?.estimatedWait} minutos</span>
              </div>
              <div className="flex justify-between">
                <span>Hora estimada:</span>
                <span className="font-medium">
                  {new Date(Date.now() + formData.estimatedWait * 60000)?.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              fullWidth
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              iconName="UserPlus"
              iconPosition="left"
              fullWidth
            >
              Agregar a Cola
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WalkInRegistration;