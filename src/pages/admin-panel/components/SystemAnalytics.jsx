import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';

const SystemAnalytics = ({ analyticsData }) => {
  const {
    totalUsers,
    activeUsers,
    subscriptionDistribution,
    revenueData,
    userGrowthData,
    platformUsage
  } = analyticsData;

  const COLORS = ['#2C3E50', '#E67E22', '#27AE60', '#E74C3C'];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'ARS'
    })?.format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('es-ES')?.format(value);
  };

  const StatCard = ({ title, value, change, icon, color = 'primary' }) => {
    const isPositive = change > 0;
    const colorClasses = {
      primary: 'bg-primary text-primary-foreground',
      success: 'bg-success text-success-foreground',
      warning: 'bg-warning text-warning-foreground',
      accent: 'bg-accent text-accent-foreground'
    };

    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-lg ${colorClasses?.[color]} flex items-center justify-center`}>
            <Icon name={icon} size={24} />
          </div>
          <div className={`flex items-center text-sm ${isPositive ? 'text-success' : 'text-error'}`}>
            <Icon name={isPositive ? 'TrendingUp' : 'TrendingDown'} size={16} className="mr-1" />
            {Math.abs(change)}%
          </div>
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground mb-1">{value}</p>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Usuarios"
          value={formatNumber(totalUsers)}
          change={12.5}
          icon="Users"
          color="primary"
        />
        <StatCard
          title="Usuarios Activos"
          value={formatNumber(activeUsers)}
          change={8.3}
          icon="UserCheck"
          color="success"
        />
        <StatCard
          title="Ingresos Mensuales"
          value={formatCurrency(revenueData?.monthly)}
          change={15.7}
          icon="DollarSign"
          color="accent"
        />
        <StatCard
          title="Tasa de Conversión"
          value="68.4%"
          change={-2.1}
          icon="Target"
          color="warning"
        />
      </div>
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subscription Distribution */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Icon name="PieChart" size={20} className="mr-2 text-accent" />
            Distribución de Suscripciones
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subscriptionDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100)?.toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {subscriptionDistribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatNumber(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Growth */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Icon name="TrendingUp" size={20} className="mr-2 text-success" />
            Crecimiento de Usuarios
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatNumber(value)} />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#27AE60"
                  strokeWidth={2}
                  dot={{ fill: '#27AE60' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Revenue Analytics */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="BarChart3" size={20} className="mr-2 text-accent" />
          Análisis de Ingresos por Mes
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData?.monthly_breakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="revenue" fill="#E67E22" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Platform Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-foreground">Citas Programadas</h4>
            <Icon name="Calendar" size={20} className="text-primary" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Hoy</span>
              <span className="font-medium text-foreground">{formatNumber(platformUsage?.appointmentsToday)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Esta semana</span>
              <span className="font-medium text-foreground">{formatNumber(platformUsage?.appointmentsWeek)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Este mes</span>
              <span className="font-medium text-foreground">{formatNumber(platformUsage?.appointmentsMonth)}</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-foreground">Actividad del Sistema</h4>
            <Icon name="Activity" size={20} className="text-success" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Sesiones activas</span>
              <span className="font-medium text-foreground">{formatNumber(platformUsage?.activeSessions)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Tiempo promedio</span>
              <span className="font-medium text-foreground">{platformUsage?.avgSessionTime} min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Páginas vistas</span>
              <span className="font-medium text-foreground">{formatNumber(platformUsage?.pageViews)}</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-foreground">Soporte Técnico</h4>
            <Icon name="HelpCircle" size={20} className="text-warning" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Tickets abiertos</span>
              <span className="font-medium text-foreground">{formatNumber(platformUsage?.openTickets)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Resueltos hoy</span>
              <span className="font-medium text-foreground">{formatNumber(platformUsage?.resolvedToday)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Tiempo respuesta</span>
              <span className="font-medium text-foreground">{platformUsage?.avgResponseTime}h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemAnalytics;