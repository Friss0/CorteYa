import React, { useState, useRef } from 'react';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const ProfilePhotoUpload = () => {
  const [currentPhoto, setCurrentPhoto] = useState('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face');
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [cropData, setCropData] = useState({
    x: 0,
    y: 0,
    width: 150,
    height: 150,
    scale: 1
  });
  
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event?.target?.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file?.type?.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validate file size (max 5MB)
    if (file?.size > 5 * 1024 * 1024) {
      alert('El archivo es demasiado grande. Máximo 5MB permitido');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewPhoto(e?.target?.result);
      setShowCropper(true);
    };
    reader?.readAsDataURL(file);
  };

  const handleCropChange = (field, value) => {
    setCropData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSavePhoto = async () => {
    if (!previewPhoto) return;

    setIsUploading(true);
    
    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would upload the cropped image to your server
      setCurrentPhoto(previewPhoto);
      setPreviewPhoto(null);
      setShowCropper(false);
      
      alert('Foto de perfil actualizada correctamente');
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Error al subir la foto. Inténtalo de nuevo.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    const confirmed = window.confirm('¿Estás seguro de que deseas eliminar tu foto de perfil?');
    if (!confirmed) return;

    setIsUploading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentPhoto(null);
      alert('Foto de perfil eliminada correctamente');
    } catch (error) {
      console.error('Error removing photo:', error);
      alert('Error al eliminar la foto. Inténtalo de nuevo.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setPreviewPhoto(null);
    setShowCropper(false);
    setCropData({
      x: 0,
      y: 0,
      width: 150,
      height: 150,
      scale: 1
    });
    if (fileInputRef?.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Icon name="Camera" size={20} className="text-primary" />
        <div>
          <h4 className="text-md font-semibold text-foreground">Foto de Perfil</h4>
          <p className="text-sm text-muted-foreground">
            Actualiza tu imagen de perfil para personalizar tu cuenta
          </p>
        </div>
      </div>
      {!showCropper ? (
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          {/* Current Photo Display */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-border bg-muted flex items-center justify-center">
              {currentPhoto ? (
                <Image
                  src={currentPhoto}
                  alt="Foto de perfil actual"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Icon name="User" size={48} className="text-muted-foreground" />
              )}
            </div>
            
            {currentPhoto && (
              <button
                onClick={handleRemovePhoto}
                disabled={isUploading}
                className="absolute -top-2 -right-2 w-8 h-8 bg-error text-error-foreground rounded-full flex items-center justify-center hover:bg-error/90 transition-colors"
                title="Eliminar foto"
              >
                <Icon name="X" size={16} />
              </button>
            )}
          </div>

          {/* Upload Controls */}
          <div className="flex-1 space-y-3">
            <div className="text-center sm:text-left">
              <p className="text-sm font-medium text-foreground mb-1">
                {currentPhoto ? 'Cambiar foto de perfil' : 'Subir foto de perfil'}
              </p>
              <p className="text-xs text-muted-foreground">
                Formatos soportados: JPG, PNG, GIF. Tamaño máximo: 5MB
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <Button
                variant="default"
                size="sm"
                onClick={() => fileInputRef?.current?.click()}
                disabled={isUploading}
                iconName="Upload"
                iconPosition="left"
              >
                {currentPhoto ? 'Cambiar Foto' : 'Subir Foto'}
              </Button>

              {currentPhoto && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemovePhoto}
                  disabled={isUploading}
                  loading={isUploading}
                  iconName="Trash2"
                  iconPosition="left"
                >
                  Eliminar
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Image Cropper */}
          <div className="bg-muted/30 p-4 rounded-md">
            <h5 className="font-medium text-foreground mb-3">Ajustar Imagen</h5>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Preview Area */}
              <div className="space-y-3">
                <div className="relative w-full max-w-sm mx-auto">
                  <div 
                    className="relative overflow-hidden border-2 border-dashed border-border rounded-md"
                    style={{ paddingBottom: '100%' }}
                  >
                    {previewPhoto && (
                      <img
                        src={previewPhoto}
                        alt="Vista previa"
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{
                          transform: `scale(${cropData?.scale}) translate(${-cropData?.x}px, ${-cropData?.y}px)`,
                          transformOrigin: 'top left'
                        }}
                      />
                    )}
                    
                    {/* Crop overlay */}
                    <div 
                      className="absolute border-2 border-primary bg-primary/10"
                      style={{
                        left: `${cropData?.x}px`,
                        top: `${cropData?.y}px`,
                        width: `${cropData?.width}px`,
                        height: `${cropData?.height}px`
                      }}
                    />
                  </div>
                </div>

                {/* Final Preview */}
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground mb-2">Vista previa final</p>
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-border mx-auto bg-muted">
                    {previewPhoto && (
                      <img
                        src={previewPhoto}
                        alt="Vista previa final"
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
                    Escala: {cropData?.scale?.toFixed(1)}x
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={cropData?.scale}
                    onChange={(e) => handleCropChange('scale', parseFloat(e?.target?.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Posición X: {cropData?.x}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={cropData?.x}
                    onChange={(e) => handleCropChange('x', parseInt(e?.target?.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Posición Y: {cropData?.y}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={cropData?.y}
                    onChange={(e) => handleCropChange('y', parseInt(e?.target?.value))}
                    className="w-full"
                  />
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-3">
                    Ajusta la escala y posición para obtener el mejor encuadre de tu foto
                  </p>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleSavePhoto}
                      loading={isUploading}
                      iconName="Check"
                      iconPosition="left"
                    >
                      Guardar Foto
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
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
      )}
      {/* Upload Guidelines */}
      <div className="mt-6 p-4 bg-muted/30 rounded-md">
        <h5 className="font-medium text-foreground mb-2">Recomendaciones para tu foto</h5>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li className="flex items-center space-x-2">
            <Icon name="Check" size={14} className="text-success" />
            <span>Usa una imagen clara y bien iluminada</span>
          </li>
          <li className="flex items-center space-x-2">
            <Icon name="Check" size={14} className="text-success" />
            <span>Asegúrate de que tu rostro sea claramente visible</span>
          </li>
          <li className="flex items-center space-x-2">
            <Icon name="Check" size={14} className="text-success" />
            <span>Evita imágenes borrosas o con poca luz</span>
          </li>
          <li className="flex items-center space-x-2">
            <Icon name="Check" size={14} className="text-success" />
            <span>La imagen se recortará automáticamente en formato circular</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfilePhotoUpload;