import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const LoginForm = ({ onLogin, isLoading, error }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const mockCredentials = {
    admin: { email: 'admin@corteya.com', password: 'admin123' },
    business: { email: 'propietario@corteya.com', password: 'barbero123' }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData?.email) {
      errors.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      errors.email = 'Ingrese un correo electrónico válido';
    }
    
    if (!formData?.password) {
      errors.password = 'La contraseña es obligatoria';
    } else if (formData?.password?.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors?.[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Check mock credentials
    const isAdmin = formData?.email === mockCredentials?.admin?.email && 
                   formData?.password === mockCredentials?.admin?.password;
    const isBusiness = formData?.email === mockCredentials?.business?.email && 
                      formData?.password === mockCredentials?.business?.password;

    if (isAdmin || isBusiness) {
      const userRole = isAdmin ? 'admin' : 'business';
      onLogin(formData, userRole);
    } else {
      setValidationErrors({
        general: 'Credenciales incorrectas. Verifique su correo y contraseña.'
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General Error Message */}
      {(error || validationErrors?.general) && (
        <div className="p-4 bg-error/10 border border-error/20 rounded-md">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-error" />
            <p className="text-sm text-error font-medium">
              {error || validationErrors?.general}
            </p>
          </div>
        </div>
      )}
      {/* Email Field */}
      <Input
        label="Correo Electrónico"
        type="email"
        name="email"
        placeholder="ejemplo@corteya.com"
        value={formData?.email}
        onChange={handleInputChange}
        error={validationErrors?.email}
        required
        disabled={isLoading}
        className="w-full"
      />
      {/* Password Field with Toggle */}
      <div className="space-y-2">
        <label
          htmlFor="password-input"
          className="text-sm font-medium leading-none text-foreground"
        >
          Contraseña
          <span className="text-destructive ml-1">*</span>
        </label>
        <div className="relative flex items-center">
          <input
            id="password-input"
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Ingrese su contraseña"
            value={formData?.password}
            onChange={handleInputChange}
            disabled={isLoading}
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none transition-colors z-10"
            disabled={isLoading}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? (
              <Icon name="EyeOff" size={20} />
            ) : (
              <Icon name="Eye" size={20} />
            )}
          </button>
        </div>
        {validationErrors?.password && (
          <p className="text-sm text-destructive">
            {validationErrors?.password}
          </p>
        )}
      </div>
      {/* Remember Me Checkbox */}
      <div className="flex items-center justify-between">
        <Checkbox
          label="Recordarme"
          name="rememberMe"
          checked={formData?.rememberMe}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        
        <button
          type="button"
          onClick={() => navigate('/forgot-password')}
          className="text-sm text-accent hover:text-accent/80 transition-micro font-medium"
          disabled={isLoading}
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>
      {/* Login Button */}
      <Button
        type="submit"
        variant="default"
        size="lg"
        fullWidth
        loading={isLoading}
        disabled={isLoading}
        iconName="LogIn"
        iconPosition="right"
        className="mt-8"
      >
        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </Button>
      {/* Registration Link */}
      <div className="text-center pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          ¿No tienes una cuenta?{' '}
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="text-accent hover:text-accent/80 transition-micro font-medium"
            disabled={isLoading}
          >
            Regístrate aquí
          </button>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;