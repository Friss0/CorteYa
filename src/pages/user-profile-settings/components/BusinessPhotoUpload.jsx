import React, { useState, useRef, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import AppImage from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import { FirebaseBusinessPhotosService } from '../../../lib/firebase-business-photos';

const BusinessPhotoUpload = () => {
  // Get User ID from session
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const session = localStorage.getItem('barberTurnUser');
    if (session) {
      const sessionObj = JSON.parse(session);
      setUserId(sessionObj.uid);
    }
  }, []);

  // Profile photo state
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [profileCropping, setProfileCropping] = useState(false);

  // Cover photo state
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [coverCropping, setCoverCropping] = useState(false);

  // General state
  const [isUploading, setIsUploading] = useState(false);
  const [activeUpload, setActiveUpload] = useState(null); // 'profile' or 'cover'
  const [businessData, setBusinessData] = useState(null);

  // Crop data for both images
  const [cropData, setCropData] = useState({
    profile: { x: 0, y: 0, width: 150, height: 150, scale: 1 },
    cover: { x: 0, y: 0, width: 400, height: 200, scale: 1 }
  });

  // File input refs
  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  // Load existing business data on component mount
  useEffect(() => {
    if (userId) {
      loadBusinessData();
    }
  }, [userId]);

  const loadBusinessData = async () => {
    try {
      // Use userId as businessId
      const { data, error } = await FirebaseBusinessPhotosService.getBusinessWithPhotos(userId, userId);
      if (data && !error) {
        setBusinessData(data);
        setProfilePhoto(data.profilePhotoUrl);
        setCoverPhoto(data.coverPhotoUrl);
      }
    } catch (error) {
      console.error('Error loading business data:', error);
    }
  };

  const handleFileSelect = (event, type) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validate file size (max 10MB for cover, 5MB for profile)
    const maxSize = type === 'cover' ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`El archivo es demasiado grande. Máximo ${type === 'cover' ? '10MB' : '5MB'} permitido`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (type === 'profile') {
        setProfilePreview(e.target.result);
        setProfileCropping(true);
      } else {
        setCoverPreview(e.target.result);
        setCoverCropping(true);
      }
      setActiveUpload(type);
    };
    reader.readAsDataURL(file);
  };

  const handleCropChange = (type, field, value) => {
    setCropData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  const handleSavePhoto = async (type) => {
    const preview = type === 'profile' ? profilePreview : coverPreview;
    if (!preview) return;

    setIsUploading(true);

    try {
      // Convert preview to blob
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      await new Promise((resolve) => {
        img.onload = resolve;
        img.src = preview;
      });

      const cropSettings = cropData[type];
      canvas.width = cropSettings.width || (type === 'profile' ? 150 : 400);
      canvas.height = cropSettings.height || (type === 'profile' ? 150 : 200);

      ctx.drawImage(
        img,
        cropSettings.x || 0,
        cropSettings.y || 0,
        cropSettings.width || (type === 'profile' ? 150 : 400),
        cropSettings.height || (type === 'profile' ? 150 : 200),
        0,
        0,
        canvas.width,
        canvas.height
      );

      // Convert canvas to blob
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.8));
      const file = new File([blob], `${type}-photo.jpg`, { type: 'image/jpeg' });

      // Upload to Firebase using userId as businessId
      const { data, error } = await FirebaseBusinessPhotosService.uploadPhoto(file, userId, type, userId);

      if (error) {
        throw error;
      }

      // Update UI
      if (type === 'profile') {
        setProfilePhoto(data.downloadURL);
        setProfilePreview(null);
        setProfileCropping(false);
      } else {
        setCoverPhoto(data.downloadURL);
        setCoverPreview(null);
        setCoverCropping(false);
      }

      setActiveUpload(null);
      alert(`${type === 'profile' ? 'Foto de perfil' : 'Foto de portada'} actualizada correctamente`);
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Error al subir la foto. Inténtalo de nuevo. ' + (error.message || ''));
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = async (type) => {
    const confirmed = window.confirm(
      `¿Estás seguro de que deseas eliminar la ${type === 'profile' ? 'foto de perfil' : 'foto de portada'} de tu barbería?`
    );
    if (!confirmed) return;

    setIsUploading(true);

    try {
      const photoPath = businessData?.[`${type}PhotoPath`];
      // Note: service uses URL/path logic. Our updated service handles URL or removal from DB.

      const { error } = await FirebaseBusinessPhotosService.deletePhoto(photoPath, userId, type, userId);
      if (error) {
        throw error;
      }

      // Update UI
      if (type === 'profile') {
        setProfilePhoto(null);
      } else {
        setCoverPhoto(null);
      }

      alert(`${type === 'profile' ? 'Foto de perfil' : 'Foto de portada'} eliminada correctamente`);
    } catch (error) {
      console.error('Error removing photo:', error);
      alert('Error al eliminar la foto. Inténtalo de nuevo.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = (type) => {
    if (type === 'profile') {
      setProfilePreview(null);
      setProfileCropping(false);
    } else {
      setCoverPreview(null);
      setCoverCropping(false);
    }

    setCropData(prev => ({
      ...prev,
      [type]: type === 'profile'
        ? { x: 0, y: 0, width: 150, height: 150, scale: 1 }
        : { x: 0, y: 0, width: 400, height: 200, scale: 1 }
    }));

    setActiveUpload(null);

    if (type === 'profile' && profileInputRef.current) {
      profileInputRef.current.value = '';
    } else if (type === 'cover' && coverInputRef.current) {
      coverInputRef.current.value = '';
    }
  };

  const renderImageCropper = (type) => {
    const preview = type === 'profile' ? profilePreview : coverPreview;
    const cropSettings = cropData[type];
    const isActive = activeUpload === type;

    if (!preview || !isActive) return null;

    return (
      <div className="space-y-4 mt-6">
        <div className="bg-muted/30 p-4 rounded-md">
          <h5 className="font-medium text-foreground mb-3">
            Ajustar {type === 'profile' ? 'Foto de Perfil' : 'Foto de Portada'}
          </h5>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Preview Area */}
            <div className="space-y-3">
              <div className="relative w-full mx-auto">
                <div
                  className="relative overflow-hidden border-2 border-dashed border-border rounded-md bg-muted/50"
                  style={{
                    paddingBottom: type === 'profile' ? '100%' : '50%',
                    maxWidth: type === 'profile' ? '300px' : '100%'
                  }}
                >
                  {preview && (
                    <img
                      src={preview}
                      alt={`Vista previa ${type === 'profile' ? 'perfil' : 'portada'}`}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{
                        transform: `scale(${cropSettings.scale}) translate(${-cropSettings.x}px, ${-cropSettings.y}px)`,
                        transformOrigin: 'top left'
                      }}
                    />
                  )}

                  {/* Crop overlay */}
                  <div
                    className="absolute border-2 border-primary bg-primary/10"
                    style={{
                      left: `${cropSettings.x || 0}px`,
                      top: `${cropSettings.y || 0}px`,
                      width: `${cropSettings.width || (type === 'profile' ? 150 : 400)}px`,
                      height: `${cropSettings.height || (type === 'profile' ? 150 : 200)}px`
                    }}
                  />
                </div>
              </div>

              {/* Final Preview */}
              <div className="text-center">
                <p className="text-sm font-medium text-foreground mb-2">Vista previa final</p>
                <div className={`mx-auto border-2 border-border bg-muted overflow-hidden ${type === 'profile' ? 'w-20 h-20 rounded-full' : 'w-32 h-16 rounded-md'
                  }`}>
                  {preview && (
                    <img
                      src={preview}
                      alt={`Vista previa final ${type === 'profile' ? 'perfil' : 'portada'}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Crop Controls */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Escala: {cropSettings.scale.toFixed(1)}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={cropSettings.scale || 1}
                  onChange={(e) => handleCropChange(type, 'scale', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Posición X: {cropSettings.x || 0}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="300"
                  value={cropSettings.x || 0}
                  onChange={(e) => handleCropChange(type, 'x', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Posición Y: {cropSettings.y || 0}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="300"
                  value={cropSettings.y || 0}
                  onChange={(e) => handleCropChange(type, 'y', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-3">
                  Ajusta la escala y posición para obtener el mejor encuadre
                </p>

                <div className="flex space-x-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleSavePhoto(type)}
                    loading={isUploading}
                    iconName="Check"
                    iconPosition="left"
                  >
                    Guardar Foto
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCancel(type)}
                    disabled={isUploading}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <div className="flex items-center space-x-3 mb-2">
          <Icon name="Camera" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Fotos de la Barbería</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Personaliza el perfil de tu barbería con una foto de perfil y una foto de portada
        </p>
      </div>

      {!profileCropping && !coverCropping && (
        <>
          {/* Cover Photo Section */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="relative">
              {/* Cover Photo Display */}
              <div className="relative w-full h-48 bg-muted overflow-hidden">
                {coverPhoto ? (
                  <AppImage
                    src={coverPhoto}
                    alt="Foto de portada de la barbería"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-muted to-muted/50">
                    <div className="text-center">
                      <Icon name="Image" size={48} className="text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Sin foto de portada</p>
                    </div>
                  </div>
                )}

                {/* Cover Photo Actions Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => coverInputRef.current?.click()}
                    disabled={isUploading}
                    iconName="Upload"
                    iconPosition="left"
                  >
                    {coverPhoto ? 'Cambiar Portada' : 'Subir Portada'}
                  </Button>

                  {coverPhoto && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemovePhoto('cover')}
                      disabled={isUploading}
                      iconName="Trash2"
                      iconPosition="left"
                    >
                      Eliminar
                    </Button>
                  )}
                </div>
              </div>

              {/* Profile Photo Positioned on Cover */}
              <div className="absolute -bottom-12 left-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-card bg-muted flex items-center justify-center">
                    {profilePhoto ? (
                      <AppImage
                        src={profilePhoto}
                        alt="Foto de perfil de la barbería"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Icon name="Store" size={32} className="text-muted-foreground" />
                    )}
                  </div>

                  {/* Profile Photo Edit Button */}
                  <button
                    onClick={() => profileInputRef.current?.click()}
                    disabled={isUploading}
                    className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors border-2 border-card"
                    title={profilePhoto ? 'Cambiar foto de perfil' : 'Subir foto de perfil'}
                  >
                    <Icon name="Camera" size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Business Info Section */}
            <div className="pt-16 p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-foreground">
                    {businessData?.businessName || 'Barbería El Corte Perfecto'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {businessData?.address || 'Calle Mayor 123'}, {businessData?.city || 'Madrid'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Foto de Perfil</label>
                    <div className="flex space-x-2">
                      <input
                        ref={profileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileSelect(e, 'profile')}
                        className="hidden"
                      />

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => profileInputRef.current?.click()}
                        disabled={isUploading}
                        iconName="Upload"
                        iconPosition="left"
                      >
                        {profilePhoto ? 'Cambiar' : 'Subir'}
                      </Button>

                      {profilePhoto && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemovePhoto('profile')}
                          disabled={isUploading}
                          iconName="Trash2"
                          iconPosition="left"
                        >
                          Eliminar
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Foto de Portada</label>
                    <div className="flex space-x-2">
                      <input
                        ref={coverInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileSelect(e, 'cover')}
                        className="hidden"
                      />

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => coverInputRef.current?.click()}
                        disabled={isUploading}
                        iconName="Upload"
                        iconPosition="left"
                      >
                        {coverPhoto ? 'Cambiar' : 'Subir'}
                      </Button>

                      {coverPhoto && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemovePhoto('cover')}
                          disabled={isUploading}
                          iconName="Trash2"
                          iconPosition="left"
                        >
                          Eliminar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Image Croppers */}
      {renderImageCropper('profile')}
      {renderImageCropper('cover')}
    </div>
  );
};

export default BusinessPhotoUpload;