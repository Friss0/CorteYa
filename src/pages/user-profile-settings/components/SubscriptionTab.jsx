import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SubscriptionTab = () => {
  const [currentPlan, setCurrentPlan] = useState('premium');
  const [isLoading, setIsLoading] = useState(false);

  const plans = [
    {
      id: 'basic',
      name: 'Plan Básico',
      price: '5',
      period: 'mes',
      description: 'Perfecto para barberías pequeñas',
      features: [
        'Hasta 100 citas por mes',
        'Dashboard básico',
        'Gestión de clientes',
        'Recordatorios por email',
        'Soporte por email',
        '1 usuario'
      ],
      limitations: [
        'Sin reportes avanzados',
        'Sin integración SMS',
        'Sin personalización avanzada'
      ],
      color: 'secondary',
      popular: false
    },
    {
      id: 'premium',
      name: 'Plan Premium',
      price: '15',
      period: 'mes',
      description: 'La solución completa para tu barbería',
      features: [
        'Citas ilimitadas',
        'Dashboard avanzado personalizable',
        'Gestión completa de clientes',
        'Recordatorios SMS y email',
        'Reportes y análisis detallados',
        'Hasta 5 usuarios',
        'Integración con redes sociales',
        'Soporte prioritario 24/7',
        'Backup automático',
        'API personalizada'
      ],
      limitations: [],
      color: 'primary',
      popular: true
    }
  ];

  const usageStats = {
    appointments: { current: 847, limit: currentPlan === 'basic' ? 100 : 'Ilimitadas' },
    users: { current: 3, limit: currentPlan === 'basic' ? 1 : 5 },
    storage: { current: 2.4, limit: 10, unit: 'GB' },
    smsCredits: { current: 156, limit: currentPlan === 'basic' ? 0 : 500 }
  };

  const billingHistory = [
    {
      id: 1,
      date: '2024-09-01',
      amount: '15',
      plan: 'Plan Premium',
      status: 'Pagado',
      invoice: 'INV-2024-09-001'
    },
    {
      id: 2,
      date: '2024-08-01',
      amount: '15',
      plan: 'Plan Premium',
      status: 'Pagado',
      invoice: 'INV-2024-08-001'
    },
    {
      id: 3,
      date: '2024-07-01',
      amount: '5',
      plan: 'Plan Básico',
      status: 'Pagado',
      invoice: 'INV-2024-07-001'
    }
  ];

  const handlePlanChange = async (planId) => {
    if (planId === currentPlan) return;

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCurrentPlan(planId);
      alert(`Plan cambiado exitosamente a ${plans?.find(p => p?.id === planId)?.name}`);
    } catch (error) {
      console.error('Error changing plan:', error);
      alert('Error al cambiar el plan. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const getUsagePercentage = (current, limit) => {
    if (limit === 'Ilimitadas' || limit === 0) return 0;
    return Math.min((current / limit) * 100, 100);
  };

  const getUsageColor = (percentage) => {
    if (percentage >= 90) return 'text-error';
    if (percentage >= 70) return 'text-warning';
    return 'text-success';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h3 className="text-lg font-semibold text-foreground">Suscripción y Facturación</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Gestiona tu plan de suscripción y revisa tu historial de pagos
        </p>
      </div>
      {/* Current Plan Status */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-lg font-semibold text-foreground">Plan Actual</h4>
            <p className="text-sm text-muted-foreground">
              Renovación automática el 01/10/2024
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              {plans?.find(p => p?.id === currentPlan)?.price}€
            </div>
            <div className="text-sm text-muted-foreground">por mes</div>
          </div>
        </div>

        <div className="flex items-center space-x-3 mb-4">
          <div className={`w-3 h-3 rounded-full ${currentPlan === 'premium' ? 'bg-primary' : 'bg-secondary'}`}></div>
          <span className="font-medium text-foreground">
            {plans?.find(p => p?.id === currentPlan)?.name}
          </span>
          {currentPlan === 'premium' && (
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
              Popular
            </span>
          )}
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          {plans?.find(p => p?.id === currentPlan)?.description}
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            iconName="CreditCard"
            iconPosition="left"
            size="sm"
          >
            Actualizar Método de Pago
          </Button>
          <Button
            variant="outline"
            iconName="Download"
            iconPosition="left"
            size="sm"
          >
            Descargar Factura
          </Button>
        </div>
      </div>
      {/* Usage Statistics */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Uso Actual</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-foreground">Citas este mes</span>
                <span className={`text-sm font-medium ${getUsageColor(getUsagePercentage(usageStats?.appointments?.current, usageStats?.appointments?.limit))}`}>
                  {usageStats?.appointments?.current} / {usageStats?.appointments?.limit}
                </span>
              </div>
              {usageStats?.appointments?.limit !== 'Ilimitadas' && (
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getUsagePercentage(usageStats?.appointments?.current, usageStats?.appointments?.limit) >= 90 ? 'bg-error' : getUsagePercentage(usageStats?.appointments?.current, usageStats?.appointments?.limit) >= 70 ? 'bg-warning' : 'bg-success'}`}
                    style={{ width: `${getUsagePercentage(usageStats?.appointments?.current, usageStats?.appointments?.limit)}%` }}
                  ></div>
                </div>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-foreground">Usuarios activos</span>
                <span className={`text-sm font-medium ${getUsageColor(getUsagePercentage(usageStats?.users?.current, usageStats?.users?.limit))}`}>
                  {usageStats?.users?.current} / {usageStats?.users?.limit}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getUsagePercentage(usageStats?.users?.current, usageStats?.users?.limit) >= 90 ? 'bg-error' : 'bg-success'}`}
                  style={{ width: `${getUsagePercentage(usageStats?.users?.current, usageStats?.users?.limit)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-foreground">Almacenamiento</span>
                <span className={`text-sm font-medium ${getUsageColor(getUsagePercentage(usageStats?.storage?.current, usageStats?.storage?.limit))}`}>
                  {usageStats?.storage?.current} / {usageStats?.storage?.limit} {usageStats?.storage?.unit}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-success"
                  style={{ width: `${getUsagePercentage(usageStats?.storage?.current, usageStats?.storage?.limit)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-foreground">Créditos SMS</span>
                <span className={`text-sm font-medium ${currentPlan === 'basic' ? 'text-muted-foreground' : getUsageColor(getUsagePercentage(usageStats?.smsCredits?.current, usageStats?.smsCredits?.limit))}`}>
                  {currentPlan === 'basic' ? 'No disponible' : `${usageStats?.smsCredits?.current} / ${usageStats?.smsCredits?.limit}`}
                </span>
              </div>
              {currentPlan !== 'basic' && (
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-success"
                    style={{ width: `${getUsagePercentage(usageStats?.smsCredits?.current, usageStats?.smsCredits?.limit)}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Available Plans */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Planes Disponibles</h4>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {plans?.map((plan) => (
            <div
              key={plan?.id}
              className={`border rounded-lg p-6 relative ${
                plan?.id === currentPlan 
                  ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
              } transition-colors`}
            >
              {plan?.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                    Más Popular
                  </span>
                </div>
              )}

              {plan?.id === currentPlan && (
                <div className="absolute top-4 right-4">
                  <div className="flex items-center space-x-1 text-primary">
                    <Icon name="Check" size={16} />
                    <span className="text-xs font-medium">Actual</span>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <h5 className="text-lg font-semibold text-foreground">{plan?.name}</h5>
                <p className="text-sm text-muted-foreground">{plan?.description}</p>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-foreground">{plan?.price}€</span>
                  <span className="text-sm text-muted-foreground ml-1">/{plan?.period}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {plan?.features?.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Icon name="Check" size={16} className="text-success" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
                
                {plan?.limitations?.map((limitation, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Icon name="X" size={16} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{limitation}</span>
                  </div>
                ))}
              </div>

              <Button
                variant={plan?.id === currentPlan ? "outline" : "default"}
                fullWidth
                loading={isLoading}
                onClick={() => handlePlanChange(plan?.id)}
                disabled={plan?.id === currentPlan}
              >
                {plan?.id === currentPlan ? 'Plan Actual' : 
                 currentPlan === 'basic' && plan?.id === 'premium' ? 'Actualizar Plan' : 'Cambiar Plan'}
              </Button>
            </div>
          ))}
        </div>
      </div>
      {/* Billing History */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-foreground">Historial de Facturación</h4>
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
          >
            Exportar
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Fecha</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Plan</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Importe</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Estado</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Factura</th>
              </tr>
            </thead>
            <tbody>
              {billingHistory?.map((bill) => (
                <tr key={bill?.id} className="border-b border-border/50">
                  <td className="py-3 px-2 text-sm text-foreground">
                    {new Date(bill.date)?.toLocaleDateString('es-ES')}
                  </td>
                  <td className="py-3 px-2 text-sm text-foreground">{bill?.plan}</td>
                  <td className="py-3 px-2 text-sm font-medium text-foreground">{bill?.amount}€</td>
                  <td className="py-3 px-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                      {bill?.status}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Download"
                      iconPosition="left"
                    >
                      {bill?.invoice}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTab;