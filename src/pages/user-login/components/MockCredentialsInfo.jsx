import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MockCredentialsInfo = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const credentials = [
    {
      role: 'Administrador',
      email: 'admin@corteya.com',
      password: 'admin123',
      description: 'Acceso completo al sistema'
    },
    {
      role: 'Propietario',
      email: 'propietario@corteya.com',
      password: 'barbero123',
      description: 'Panel de negocio y citas'
    }
  ];

  return (
    <div className="mt-6 p-4 bg-muted/50 rounded-md border border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="Info" size={16} className="text-accent" />
          <span className="text-sm font-medium text-foreground">
            Credenciales de Prueba
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
          iconPosition="right"
        >
          {isExpanded ? 'Ocultar' : 'Ver'}
        </Button>
      </div>
      {isExpanded && (
        <div className="mt-4 space-y-3">
          {credentials?.map((cred, index) => (
            <div key={index} className="p-3 bg-card rounded-md border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  {cred?.role}
                </span>
                <span className="text-xs text-muted-foreground">
                  {cred?.description}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Icon name="Mail" size={14} className="text-muted-foreground" />
                  <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                    {cred?.email}
                  </code>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Key" size={14} className="text-muted-foreground" />
                  <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                    {cred?.password}
                  </code>
                </div>
              </div>
            </div>
          ))}
          <p className="text-xs text-muted-foreground text-center mt-3">
            Utiliza estas credenciales para probar diferentes niveles de acceso
          </p>
        </div>
      )}
    </div>
  );
};

export default MockCredentialsInfo;