import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { FirebaseBusinessPhotosService } from '../../../lib/firebase-business-photos';
import { CheckCircle, X } from 'lucide-react';

const BusinessInfoTab = () => {
  // Get User ID from session
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const session = localStorage.getItem('barberTurnUser');
    if (session) {
      const sessionObj = JSON.parse(session);
      setUserId(sessionObj.uid);
    }
  }, []);

  const [businessData, setBusinessData] = useState({
    businessName: '',
    address: '',
    city: '',
    postalCode: '',
    province: '',
    phone: '',
    email: '',
    website: '',
    description: '',
    lat: '',
    lng: '', // Coordinates required for Mobile Map
    services: [],
    openingHours: {
      monday: { open: '09:00', close: '20:00', closed: false },
      tuesday: { open: '09:00', close: '20:00', closed: false },
      wednesday: { open: '09:00', close: '20:00', closed: false },
      thursday: { open: '09:00', close: '21:00', closed: false },
      friday: { open: '09:00', close: '21:00', closed: false },
      saturday: { open: '09:00', close: '18:00', closed: false },
      sunday: { open: '10:00', close: '14:00', closed: false }
    }
  });

  // Barbers management
  const [barbers, setBarbers] = useState([]);
  const [newBarber, setNewBarber] = useState({ name: '', profilePhoto: null });
  const [isAddingBarber, setIsAddingBarber] = useState(false);

  // Services management
  const [businessServices, setBusinessServices] = useState([]);
  const [newService, setNewService] = useState({ name: '', price: '', duration: 30, description: '' });
  const [isAddingService, setIsAddingService] = useState(false);

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [businessExists, setBusinessExists] = useState(false);

  const [success, setSuccess] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const provinceOptions = [
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

  const dayNames = {
    monday: 'Lunes',
    tuesday: 'Martes',
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sábado',
    sunday: 'Domingo'
  };

  // Load existing business data on component mount
  useEffect(() => {
    if (userId) {
      loadBusinessData();
    }
  }, [userId]);

  const loadBusinessData = async () => {
    try {
      const { data, error } = await FirebaseBusinessPhotosService.getBusinessWithPhotos(userId, userId);
      if (data && !error) {
        setBusinessData({
          businessName: data.businessName || '',
          address: data.address || '',
          city: data.city || '',
          postalCode: data.postalCode || '',
          province: data.province || '',
          phone: data.phone || '',
          email: data.email || '',
          website: data.website || '',
          description: data.description || '',
          lat: data.lat || '',
          lng: data.lng || '',
          services: data.services || [],
          openingHours: data.openingHours || businessData.openingHours
        });

        // Populate Barbers and Services from loaded data
        if (data.barbersDict) {
          const barberArray = Object.values(data.barbersDict).map(b => ({
            id: b.id,
            name: b.name,
            profilePhoto: b.avatar || null,
            specialties: b.specialties || []
          }));
          if (barberArray.length > 0) setBarbers(barberArray);
        }

        if (data.servicesDict) {
          const serviceArray = Object.values(data.servicesDict).map(s => ({
            id: s.id,
            name: s.title,
            price: s.price,
            duration: s.duration || 30,
            description: s.description || ''
          }));
          if (serviceArray.length > 0) setBusinessServices(serviceArray);
        }

        setBusinessExists(true);
      } else {
        // Default data for new business
        setBusinessData(prev => ({
          ...prev,
          businessName: '',
          address: '',
        }));
        setBusinessExists(false);
      }
    } catch (error) {
      console.error('Error loading business data:', error);
      setBusinessExists(false);
    }
  };

  useEffect(() => {
    if (success) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
        setTimeout(() => {
          setSuccess('');
        }, 300);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBusinessData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleHoursChange = (day, field, value) => {
    setBusinessData(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: {
          ...prev.openingHours[day],
          [field]: value
        }
      }
    }));
  };

  const validateForm = () => {
    // Basic validation
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic formatting or validation if needed
    setIsLoading(true);
    setSuccess('');

    try {
      let result;

      // Save Main Data
      result = await FirebaseBusinessPhotosService.updateBusinessInfo(userId, userId, businessData);

      // Save Arrays
      await FirebaseBusinessPhotosService.saveServices(userId, businessServices);
      await FirebaseBusinessPhotosService.saveBarbers(userId, barbers);

      if (result.error) {
        throw result.error;
      }

      setSuccess('La información de la barbería fue actualizada correctamente');
      setBusinessExists(true);
    } catch (error) {
      console.error('Error saving business info:', error);
      alert('Error al actualizar la información. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const closeAlert = () => {
    setShowAlert(false);
    setTimeout(() => {
      setSuccess('');
    }, 300);
  };

  // Barber management functions
  const handleAddBarber = () => {
    if (newBarber.name.trim()) {
      setBarbers(prev => [...prev, {
        id: Date.now(),
        name: newBarber.name.trim(),
        profilePhoto: newBarber.profilePhoto,
        specialties: []
      }]);
      setNewBarber({ name: '', profilePhoto: null });
      setIsAddingBarber(false);
    }
  };

  const handleRemoveBarber = (barberId) => {
    setBarbers(prev => prev.filter(barber => barber.id !== barberId));
  };

  const handleBarberPhotoUpload = (barberId, file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBarbers(prev => prev.map(barber =>
          barber.id === barberId
            ? { ...barber, profilePhoto: e.target.result }
            : barber
        ));
      };
      reader.readAsDataURL(file);
    }
  };

  // Service management functions
  const handleAddService = () => {
    if (newService.name.trim() && newService.price) {
      setBusinessServices(prev => [...prev, {
        id: Date.now(),
        name: newService.name.trim(),
        price: Math.round(parseFloat(newService.price)),
        duration: parseInt(newService.duration) || 30,
        description: newService.description.trim()
      }]);
      setNewService({ name: '', price: '', duration: 30, description: '' });
      setIsAddingService(false);
    }
  };

  const handleRemoveService = (serviceId) => {
    setBusinessServices(prev => prev.filter(service => service.id !== serviceId));
  };

  return (
    <div className="space-y-6">
      {/* Success Alert System */}
      {success && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out ${showAlert ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
          }`}>
          <div className="flex items-center space-x-3 px-6 py-4 rounded-lg shadow-lg max-w-md bg-green-50 border border-green-200 text-green-800">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <p className="text-sm font-medium">{success}</p>
            <button
              onClick={closeAlert}
              className="ml-auto p-1 rounded-full transition-colors hover:bg-green-100 text-green-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-border pb-4">
        <h3 className="text-lg font-semibold text-foreground">Información de la Barbería</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Configura los datos de tu barbería, horarios, barberos y servicios
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Business Info */}
        <div className="space-y-4">
          <Input
            label="Nombre de la Barbería"
            type="text"
            name="businessName"
            value={businessData.businessName}
            onChange={handleInputChange}
            error={errors.businessName}
            placeholder="Nombre de tu barbería"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Dirección"
              type="text"
              name="address"
              value={businessData.address}
              onChange={handleInputChange}
              error={errors.address}
              placeholder="Calle y número"
              required
            />

            <Input
              label="Ciudad"
              type="text"
              name="city"
              value={businessData.city}
              onChange={handleInputChange}
              error={errors.city}
              placeholder="Ciudad"
              required
            />
          </div>

          {/* Coordinates Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Latitud"
              type="number"
              step="any"
              name="lat"
              value={businessData.lat}
              onChange={handleInputChange}
              error={errors.lat}
              placeholder="-34.6037"
              required
              description="Requerido para el mapa de la app móvil"
            />
            <Input
              label="Longitud"
              type="number"
              step="any"
              name="lng"
              value={businessData.lng}
              onChange={handleInputChange}
              error={errors.lng}
              placeholder="-58.3816"
              required
              description="Requerido para el mapa de la app móvil"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Código Postal"
              type="text"
              name="postalCode"
              value={businessData.postalCode}
              onChange={handleInputChange}
              error={errors.postalCode}
              placeholder="28001"
              required
            />

            <Select
              label="Provincia"
              options={provinceOptions}
              value={businessData.province}
              onChange={(value) => setBusinessData(prev => ({ ...prev, province: value }))}
              placeholder="Selecciona provincia"
              required
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="border-t border-border pt-6">
          <h4 className="text-md font-medium text-foreground mb-4">Información de Contacto</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Teléfono de la Barbería"
              type="tel"
              name="phone"
              value={businessData.phone}
              onChange={handleInputChange}
              error={errors.phone}
              placeholder="+34 915 123 456"
              required
            />

            <Input
              label="Email de la Barbería"
              type="email"
              name="email"
              value={businessData.email}
              onChange={handleInputChange}
              error={errors.email}
              placeholder="info@tubarberia.com"
              description="Email público para clientes"
            />
          </div>

          <Input
            label="Sitio Web"
            type="url"
            name="website"
            value={businessData.website}
            onChange={handleInputChange}
            placeholder="www.tubarberia.com"
            description="URL de tu página web (opcional)"
            className="mt-4"
          />
        </div>

        {/* Description */}
        <div className="border-t border-border pt-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-foreground">
              Descripción de la Barbería
            </label>
            <textarea
              name="description"
              value={businessData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              placeholder="Describe tu barbería, servicios especiales, experiencia..."
            />
            <p className="text-xs text-muted-foreground">
              Esta descripción aparecerá en tu perfil público
            </p>
          </div>
        </div>

        {/* Opening Hours */}
        <div className="border-t border-border pt-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-md font-medium text-foreground">
                Horarios de Atención
                <span className="text-destructive ml-1">*</span>
              </h4>
              <p className="text-sm text-muted-foreground">La barbería debe estar abierta al menos un día</p>
            </div>
            {errors.openingHours && (
              <p className="text-sm text-destructive mt-1">{errors.openingHours}</p>
            )}
          </div>

          <div className="space-y-3">
            {Object.entries(businessData.openingHours).map(([day, hours]) => (
              <div key={day} className="flex items-center space-x-4 p-3 bg-muted/30 rounded-md">
                <div className="w-20 text-sm font-medium text-foreground">
                  {dayNames[day]}
                </div>

                <Checkbox
                  checked={!hours.closed}
                  onChange={(e) => handleHoursChange(day, 'closed', !e.target.checked)}
                  label="Abierto"
                  size="sm"
                />

                {!hours.closed && (
                  <div className="flex items-center space-x-2 flex-1">
                    <input
                      type="time"
                      value={hours.open}
                      onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                      className="px-2 py-1 border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                    <span className="text-muted-foreground">a</span>
                    <input
                      type="time"
                      value={hours.close}
                      onChange={(e) => handleHoursChange(day, 'close', e.target.value)}
                      className="px-2 py-1 border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>
                )}

                {hours.closed && (
                  <div className="flex-1 text-sm text-muted-foreground">
                    Cerrado
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Barbers Section */}
        <div className="border-t border-border pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-md font-medium text-foreground">
                Barberos
                <span className="text-destructive ml-1">*</span>
              </h4>
              <p className="text-sm text-muted-foreground">Gestiona los barberos de tu establecimiento (mínimo 1)</p>
              {errors.barbers && (
                <p className="text-sm text-destructive mt-1">{errors.barbers}</p>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddingBarber(true)}
              iconName="Plus"
              iconPosition="left"
            >
              Agregar Barbero
            </Button>
          </div>

          {/* Add New Barber Form */}
          {isAddingBarber && (
            <div className="bg-muted/30 p-4 rounded-md mb-4">
              <h5 className="font-medium text-foreground mb-3">Nuevo Barbero</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nombre del Barbero"
                  type="text"
                  value={newBarber.name}
                  onChange={(e) => setNewBarber(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nombre completo"
                  required
                />

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Foto de Perfil</label>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-muted border border-border flex items-center justify-center">
                      {newBarber.profilePhoto ? (
                        <Image
                          src={newBarber.profilePhoto}
                          alt="Preview barbero"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Icon name="User" size={20} className="text-muted-foreground" />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setNewBarber(prev => ({ ...prev, profilePhoto: event.target.result }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 mt-4">
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={handleAddBarber}
                  iconName="Check"
                  iconPosition="left"
                >
                  Agregar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsAddingBarber(false);
                    setNewBarber({ name: '', profilePhoto: null });
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          {/* Current Barbers List */}
          <div className="space-y-3">
            {barbers.map((barber) => (
              <div key={barber.id} className="flex items-center justify-between p-4 bg-card border border-border rounded-md">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-muted border border-border flex items-center justify-center">
                    {barber.profilePhoto ? (
                      <Image
                        src={barber.profilePhoto}
                        alt={`${barber.name} foto perfil`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Icon name="User" size={20} className="text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h6 className="font-medium text-foreground">{barber.name}</h6>
                    {barber.specialties && barber.specialties.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        {barber.specialties.join(', ')}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleBarberPhotoUpload(barber.id, e.target.files?.[0])}
                    className="hidden"
                    id={`barber-photo-${barber.id}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => document.getElementById(`barber-photo-${barber.id}`).click()}
                    iconName="Camera"
                    iconPosition="left"
                  >
                    Foto
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveBarber(barber.id)}
                    iconName="Trash2"
                    iconPosition="left"
                    className="text-destructive hover:text-destructive"
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}

            {barbers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="Users" size={48} className="mx-auto mb-3 opacity-50" />
                <p>No hay barberos agregados</p>
                <p className="text-sm">Agrega el primer barbero de tu establecimiento</p>
              </div>
            )}
          </div>
        </div>

        {/* Services Section */}
        <div className="border-t border-border pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-md font-medium text-foreground">
                Servicios y Precios
                <span className="text-destructive ml-1">*</span>
              </h4>
              <p className="text-sm text-muted-foreground">Define los servicios que ofreces y sus precios (mínimo 1)</p>
              {errors.businessServices && (
                <p className="text-sm text-destructive mt-1">{errors.businessServices}</p>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddingService(true)}
              iconName="Plus"
              iconPosition="left"
            >
              Agregar Servicio
            </Button>
          </div>

          {/* Add New Service Form */}
          {isAddingService && (
            <div className="bg-muted/30 p-4 rounded-md mb-4">
              <h5 className="font-medium text-foreground mb-3">Nuevo Servicio</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Nombre del Servicio"
                  type="text"
                  value={newService.name}
                  onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ej: Corte de cabello"
                  required
                />

                <Input
                  label="Precio ($)"
                  type="number"
                  step="1"
                  min="0"
                  value={newService.price}
                  onChange={(e) => setNewService(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="25"
                  required
                />

                <Input
                  label="Duración (min)"
                  type="number"
                  min="5"
                  step="5"
                  value={newService.duration}
                  onChange={(e) => setNewService(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="30"
                  required
                />
              </div>

              <Input
                label="Descripción (opcional)"
                type="text"
                value={newService.description}
                onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Breve descripción del servicio"
                className="mt-4"
              />

              <div className="flex space-x-2 mt-4">
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={handleAddService}
                  iconName="Check"
                  iconPosition="left"
                >
                  Agregar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddingService(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          {/* Current Services List */}
          <div className="space-y-3">
            {businessServices.map((service) => (
              <div key={service.id} className="flex items-center justify-between p-4 bg-card border border-border rounded-md">
                <div>
                  <h6 className="font-medium text-foreground">{service.name}</h6>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                  <div className="flex items-center space-x-4 mt-1 text-sm">
                    <span className="font-semibold text-primary">${service.price}</span>
                    <span className="text-muted-foreground">{service.duration} min</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveService(service.id)}
                    iconName="Trash2"
                    iconPosition="left"
                    className="text-destructive hover:text-destructive"
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}

            {businessServices.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="Scissors" size={48} className="mx-auto mb-3 opacity-50" />
                <p>No hay servicios definidos</p>
                <p className="text-sm">Agrega los servicios que ofrece tu barbería</p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="border-t border-border pt-6 flex justify-end">
          <Button
            type="submit"
            variant="default"
            size="lg"
            loading={isLoading}
            iconName="Save"
            iconPosition="left"
          >
            Guardar Cambios
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BusinessInfoTab;