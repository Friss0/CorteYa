import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RevenueChart = ({ data, isDragging = false, ...dragProps }) => {
  const [chartType, setChartType] = useState('bar');
  const [timeRange, setTimeRange] = useState('month');

  const monthlyData = [
    { name: 'Ene', ingresos: 2400, citas: 45 },
    { name: 'Feb', ingresos: 1398, citas: 32 },
    { name: 'Mar', ingresos: 9800, citas: 78 },
    { name: 'Abr', ingresos: 3908, citas: 56 },
    { name: 'May', ingresos: 4800, citas: 67 },
    { name: 'Jun', ingresos: 3800, citas: 54 },
    { name: 'Jul', ingresos: 4300, citas: 61 },
    { name: 'Ago', ingresos: 5200, citas: 72 },
    { name: 'Sep', ingresos: 4100, citas: 58 }
  ];

  const weeklyData = [
    { name: 'Lun', ingresos: 320, citas: 8 },
    { name: 'Mar', ingresos: 450, citas: 12 },
    { name: 'Mié', ingresos: 380, citas: 10 },
    { name: 'Jue', ingresos: 520, citas: 14 },
    { name: 'Vie', ingresos: 680, citas: 18 },
    { name: 'Sáb', ingresos: 890, citas: 22 },
    { name: 'Dom', ingresos: 420, citas: 11 }
  ];

  const getData = () => {
    if (data && data.length > 0 && timeRange === 'month') return data;
    return timeRange === 'month' ? monthlyData : weeklyData;
  };

  const formatCurrency = (value) => {
    return `$${value?.toLocaleString('es-ES')}`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-popover-foreground">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.dataKey === 'ingresos' ? 'Ingresos' : 'Citas'}: {' '}
              {entry?.dataKey === 'ingresos' ? formatCurrency(entry?.value) : entry?.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

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
          <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="TrendingUp" size={20} className="text-success" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground font-heading">
              Análisis de Ingresos
            </h3>
            <p className="text-sm text-muted-foreground">
              Tendencias de facturación y citas
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={timeRange === 'week' ? 'default' : 'ghost'}
              size="xs"
              onClick={() => setTimeRange('week')}
            >
              Semana
            </Button>
            <Button
              variant={timeRange === 'month' ? 'default' : 'ghost'}
              size="xs"
              onClick={() => setTimeRange('month')}
            >
              Mes
            </Button>
          </div>

          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={chartType === 'bar' ? 'default' : 'ghost'}
              size="xs"
              onClick={() => setChartType('bar')}
            >
              <Icon name="BarChart3" size={16} />
            </Button>
            <Button
              variant={chartType === 'line' ? 'default' : 'ghost'}
              size="xs"
              onClick={() => setChartType('line')}
            >
              <Icon name="LineChart" size={16} />
            </Button>
          </div>

          <div className="opacity-30 hover:opacity-100 transition-opacity">
            <Icon name="GripVertical" size={16} className="text-muted-foreground" />
          </div>
        </div>
      </div>
      {/* Chart */}
      <div className="h-96 min-w-0" aria-label="Gráfico de ingresos y citas">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={getData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis
                dataKey="name"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                interval={0}
              />
              <YAxis
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={(value) => `$${value}`}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="ingresos"
                fill="var(--color-success)"
                radius={[4, 4, 0, 0]}
                name="Ingresos"
                minPointSize={5}
              />
            </BarChart>
          ) : (
            <LineChart data={getData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis
                dataKey="name"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                interval={0}
              />
              <YAxis
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={(value) => `$${value}`}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="ingresos"
                stroke="var(--color-success)"
                strokeWidth={3}
                dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'var(--color-success)', strokeWidth: 2 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-2xl font-bold text-success font-heading">
            {formatCurrency(getData()?.reduce((sum, item) => sum + item?.ingresos, 0))}
          </p>
          <p className="text-sm text-muted-foreground">
            Total {timeRange === 'month' ? 'Mensual' : 'Semanal'}
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-accent font-heading">
            {getData()?.reduce((sum, item) => sum + item?.citas, 0)}
          </p>
          <p className="text-sm text-muted-foreground">
            Citas Totales
          </p>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;