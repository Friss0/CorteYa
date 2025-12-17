import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityBadges = () => {
  const securityFeatures = [
    {
      icon: 'Shield',
      title: 'Conexión Segura',
      description: 'SSL 256-bit'
    },
    {
      icon: 'Lock',
      title: 'Datos Protegidos',
      description: 'Encriptación completa'
    },
    {
      icon: 'Eye',
      title: 'Privacidad',
      description: 'Sin seguimiento'
    }
  ];

  return (
    <div className="mt-8 pt-6 border-t border-border">
      <div className="flex items-center justify-center space-x-8">
        {securityFeatures?.map((feature, index) => (
          <div key={index} className="flex flex-col items-center space-y-2 group">
            <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center group-hover:bg-success/20 transition-micro">
              <Icon 
                name={feature?.icon} 
                size={18} 
                className="text-success" 
              />
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-foreground">
                {feature?.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {feature?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <p className="text-xs text-muted-foreground">
          Tus datos están protegidos con los más altos estándares de seguridad
        </p>
      </div>
    </div>
  );
};

export default SecurityBadges;