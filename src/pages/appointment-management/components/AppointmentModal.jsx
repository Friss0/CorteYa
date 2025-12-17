import React, { useState, useEffect } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AppointmentModal = ({ 
  isOpen, 
  onClose, 
  appointment, 
  onSave, 
  onDelete,
  customers,
  services 
}) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    service: '',
    date: '',
    time: '',
    duration: 30,
    notes: '',
    status: 'confirmed',
    priority: 'normal'
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (appointment) {
      setFormData({
        customerName: appointment?.customerName || '',
        customerPhone: appointment?.customerPhone || '',
        customerEmail: appointment?.customerEmail || '',
        service: appointment?.service || '',
        date: appointment?.date ? appointment?.date?.toISOString()?.split('T')?.[0] : '',
        time: appointment?.date ? appointment?.date?.toTimeString()?.slice(0, 5) : '',
        duration: appointment?.duration || 30,
        notes: appointment?.notes || '',
        status: appointment?.status || 'confirmed',
        priority: appointment?.priority || 'normal'
      });
    } else {
      setFormData({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        service: '',
        date: new Date()?.toISOString()?.split('T')?.[0],
        time: '09:00',
        duration: 30,
        notes: '',
        status: 'confirmed',
        priority: 'normal'
      });
    }
    setErrors({});
  }, [appointment, isOpen]);

  const serviceOptions = services?.map(service => ({
    value: service?.name,
    label: `${service?.name} - ${service?.duration}min - $${service?.price}`,
    description: service?.description
  }));

  const customerOptions = customers?.map(customer => ({
    value: customer?.name,
    label: customer?.name,
    description: customer?.phone
  }));

  const statusOptions = [
    { value: 'confirmed', label: 'Confirmada' },
    { value: 'in-progress', label: 'En Progreso' },
    { value: 'completed', label: 'Completada' },
    { value: 'cancelled', label: 'Cancelada' }
  ];

  const priorityOptions = [
    { value: 'normal', label: 'Normal' },
    { value: 'medium', label: 'Media' },
    { value: 'high', label: 'Alta' }
  ];

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

  const handleCustomerSelect = (customerName) => {
    const customer = customers?.find(c => c?.name === customerName);
    if (customer) {
      setFormData(prev => ({
        ...prev,
        customerName: customer?.name,
        customerPhone: customer?.phone,
        customerEmail: customer?.email
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        customerName: customerName
      }));
    }
  };

  const handleServiceSelect = (serviceName) => {
    const service = services?.find(s => s?.name === serviceName);
    if (service) {
      setFormData(prev => ({
        ...prev,
        service: serviceName,
        duration: service?.duration
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

    if (!formData?.date) {
      newErrors.date = 'La fecha es obligatoria';
    }

    if (!formData?.time) {
      newErrors.time = 'La hora es obligatoria';
    }

    if (formData?.customerPhone && !/^\d{9}$/?.test(formData?.customerPhone?.replace(/\s/g, ''))) {
      newErrors.customerPhone = 'Formato de teléfono inválido';
    }

    if (formData?.customerEmail && !/\S+@\S+\.\S+/?.test(formData?.customerEmail)) {
      newErrors.customerEmail = 'Formato de email inválido';
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
      const appointmentDate = new Date(`${formData.date}T${formData.time}`);
      
      const appointmentData = {
        ...formData,
        date: appointmentDate,
        id: appointment?.id || Date.now()
      };

      await onSave(appointmentData);
      onClose();
    } catch (error) {
      console.error('Error saving appointment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (appointment && window.confirm('¿Está seguro de que desea eliminar esta cita?')) {
      setIsLoading(true);
      try {
        await onDelete(appointment?.id);
        onClose();
      } catch (error) {
        console.error('Error deleting appointment:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            {appointment ? 'Editar Cita' : 'Nueva Cita'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
            className="h-8 w-8 p-0"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Información del Cliente</h3>
            
            <Select
              label="Cliente"
              placeholder="Seleccionar cliente existente o escribir nuevo"
              searchable
              clearable
              options={customerOptions}
              value={formData?.customerName}
              onChange={handleCustomerSelect}
              error={errors?.customerName}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Teléfono"
                type="tel"
                placeholder="123 456 789"
                value={formData?.customerPhone}
                onChange={(e) => handleInputChange('customerPhone', e?.target?.value)}
                error={errors?.customerPhone}
              />

              <Input
                label="Email"
                type="email"
                placeholder="cliente@email.com"
                value={formData?.customerEmail}
                onChange={(e) => handleInputChange('customerEmail', e?.target?.value)}
                error={errors?.customerEmail}
              />
            </div>
          </div>

          {/* Appointment Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Detalles de la Cita</h3>
            
            <Select
              label="Servicio"
              placeholder="Seleccionar servicio"
              options={serviceOptions}
              value={formData?.service}
              onChange={handleServiceSelect}
              error={errors?.service}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Fecha"
                type="date"
                value={formData?.date}
                onChange={(e) => handleInputChange('date', e?.target?.value)}
                error={errors?.date}
                required
              />

              <Input
                label="Hora"
                type="time"
                value={formData?.time}
                onChange={(e) => handleInputChange('time', e?.target?.value)}
                error={errors?.time}
                required
              />

              <Input
                label="Duración (min)"
                type="number"
                min="15"
                max="180"
                step="15"
                value={formData?.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e?.target?.value))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Estado"
                options={statusOptions}
                value={formData?.status}
                onChange={(value) => handleInputChange('status', value)}
              />

              <Select
                label="Prioridad"
                options={priorityOptions}
                value={formData?.priority}
                onChange={(value) => handleInputChange('priority', value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Notas
              </label>
              <textarea
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                rows="3"
                placeholder="Notas adicionales sobre la cita..."
                value={formData?.notes}
                onChange={(e) => handleInputChange('notes', e?.target?.value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              {appointment && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isLoading}
                  iconName="Trash2"
                  iconPosition="left"
                >
                  Eliminar
                </Button>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                loading={isLoading}
                iconName="Save"
                iconPosition="left"
              >
                {appointment ? 'Actualizar' : 'Crear'} Cita
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;