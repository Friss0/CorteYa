import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CustomerInsights = ({ isDragging = false, ...dragProps }) => {
  const [activeTab, setActiveTab] = useState('demographics');

  const demographicsData = [
    { name: '18-25', value: 15, color: 'var(--color-accent)' },
    { name: '26-35', value: 35, color: 'var(--color-success)' },
    { name: '36-45', value: 28, color: 'var(--color-warning)' },
    { name: '46-55', value: 15, color: 'var(--color-secondary)' },
    { name: '55+', value: 7, color: 'var(--color-error)' }
  ];

  const servicePreferencesData = [
    { name: 'Corte Clásico', value: 45, clientes: 180 },
    { name: 'Corte + Barba', value: 30, clientes: 120 },
    { name: 'Afeitado', value: 15, clientes: 60 },
    { name: 'Lavado', value: 10, clientes: 40 }
  ];

  const loyaltyData = [
    { name: 'Nuevos', value: 25, color: 'var(--color-accent)' },
    { name: 'Regulares', value: 45, color: 'var(--color-success)' },
    { name: 'VIP', value: 30, color: 'var(--color-warning)' }
  ];

  const topCustomers = [
    { name: "Miguel Rodríguez", visits: 24, lastVisit: "2025-09-20", spending: 720 },
    { name: "Carlos Fernández", visits: 18, lastVisit: "2025-09-19", spending: 540 },
    { name: "Antonio López", visits: 15, lastVisit: "2025-09-18", spending: 450 },
    { name: "José García", visits: 12, lastVisit: "2025-09-17", spending: 360 },
    { name: "Francisco Martín", visits: 10, lastVisit: "2025-09-16", spending: 300 }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0];
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-popover-foreground">{data?.payload?.name}</p>
          <p className="text-sm text-accent">
            {data?.value}% ({data?.payload?.clientes || data?.value} clientes)
          </p>
        </div>
      );
    }
    return null;
  };

  const renderPieChart = (data, title) => (
    <div className="h-64">
      <h4 className="text-sm font-medium text-muted-foreground mb-4 text-center">{title}</h4>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry?.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      {data?.map((entry, index) => (
        <div key={index} className="flex items-center space-x-1">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: entry?.color }}
          />
          <span className="text-xs text-muted-foreground">
            {entry?.name} ({entry?.value}%)
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div
      {...dragProps}
      className={`
        bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200
        ${isDragging ? 'opacity-50 rotate-1 scale-105' : ''}
        cursor-move
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Icon name="Users" size={20} className="text-secondary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground font-heading">
              Análisis de Clientes
            </h3>
            <p className="text-sm text-muted-foreground">
              Insights y comportamiento de clientes
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={activeTab === 'demographics' ? 'default' : 'ghost'}
              size="xs"
              onClick={() => setActiveTab('demographics')}
            >
              Edad
            </Button>
            <Button
              variant={activeTab === 'services' ? 'default' : 'ghost'}
              size="xs"
              onClick={() => setActiveTab('services')}
            >
              Servicios
            </Button>
            <Button
              variant={activeTab === 'loyalty' ? 'default' : 'ghost'}
              size="xs"
              onClick={() => setActiveTab('loyalty')}
            >
              Fidelidad
            </Button>
          </div>
          
          <div className="opacity-30 hover:opacity-100 transition-opacity">
            <Icon name="GripVertical" size={16} className="text-muted-foreground" />
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Charts */}
        <div className="min-w-0">
          {activeTab === 'demographics' && renderPieChart(demographicsData, 'Distribución por Edad')}
          {activeTab === 'services' && (
            <div className="h-64">
              <h4 className="text-sm font-medium text-muted-foreground mb-4 text-center">
                Preferencias de Servicios
              </h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={servicePreferencesData} margin={{ top: 10, right: 30, left: 10, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="var(--color-muted-foreground)"
                    fontSize={10}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    interval={0}
                  />
                  <YAxis 
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                    width={40}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="value" 
                    fill="var(--color-secondary)" 
                    radius={[4, 4, 0, 0]}
                    minPointSize={5}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          {activeTab === 'loyalty' && renderPieChart(loyaltyData, 'Niveles de Fidelidad')}
        </div>

        {/* Top Customers */}
        <div className="min-w-0">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">
            Mejores Clientes
          </h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {topCustomers?.map((customer, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {customer?.name?.split(' ')?.map(n => n?.[0])?.join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {customer?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {customer?.visits} visitas • Última: {new Date(customer.lastVisit)?.toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-success text-sm">
                    €{customer?.spending?.toLocaleString('es-ES')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Total gastado
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mt-6 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-xl font-bold text-foreground font-heading">
            {topCustomers?.reduce((sum, customer) => sum + customer?.visits, 0)}
          </p>
          <p className="text-xs text-muted-foreground">Visitas Totales</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-success font-heading">
            €{topCustomers?.reduce((sum, customer) => sum + customer?.spending, 0)?.toLocaleString('es-ES')}
          </p>
          <p className="text-xs text-muted-foreground">Ingresos Top 5</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-accent font-heading">
            {Math.round(topCustomers?.reduce((sum, customer) => sum + customer?.visits, 0) / topCustomers?.length)}
          </p>
          <p className="text-xs text-muted-foreground">Promedio Visitas</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-warning font-heading">
            €{Math.round(topCustomers?.reduce((sum, customer) => sum + customer?.spending, 0) / topCustomers?.length)?.toLocaleString('es-ES')}
          </p>
          <p className="text-xs text-muted-foreground">Gasto Promedio</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerInsights;