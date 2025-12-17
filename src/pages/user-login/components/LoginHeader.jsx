import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LoginHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center mb-8">
      {/* Logo */}
      <div className="flex items-center justify-center mb-6">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-card">
          <Icon name="Scissors" size={28} color="white" />
        </div>
        <div className="ml-3">
          <h1 className="text-2xl font-heading font-bold text-primary">
            BarberTurn
          </h1>
          <p className="text-sm text-muted-foreground font-caption">
            Gestión Profesional
          </p>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="mb-6">
        <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
          Bienvenido de vuelta
        </h2>
        <p className="text-muted-foreground font-body">
          Inicia sesión para acceder a tu panel de control
        </p>
      </div>

      {/* Back to Home Button */}
      <div className="flex justify-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/landing-page')}
          iconName="ArrowLeft"
          iconPosition="left"
          className="text-muted-foreground hover:text-foreground"
        >
          Volver al inicio
        </Button>
      </div>
    </div>
  );
};

export default LoginHeader;