import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WidgetLibrary = ({ onAddWidget, isOpen, onToggle }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const availableWidgets = [
    {
      id: 'staff-performance',
      name: 'Rendimiento del Personal',
      description: 'Métricas de productividad y evaluación del equipo',
      category: 'analytics',
      icon: 'UserCheck',
      preview: 'Gráficos de rendimiento individual y comparativo'
    },
    {
      id: 'inventory-status',
      name: 'Estado del Inventario',
      description: 'Control de productos y suministros',
      category: 'operations',
      icon: 'Package',
      preview: 'Niveles de stock y alertas de reposición'
    },
    {
      id: 'financial-summary',
      name: 'Resumen Financiero',
      description: 'Análisis detallado de ingresos y gastos',
      category: 'finance',
      icon: 'DollarSign',
      preview: 'Balance mensual y proyecciones'
    },
    {
      id: 'customer-feedback',
      name: 'Opiniones de Clientes',
      description: 'Reseñas y valoraciones recientes',
      category: 'customer',
      icon: 'MessageSquare',
      preview: 'Puntuaciones promedio y comentarios'
    },
    {
      id: 'marketing-campaigns',
      name: 'Campañas de Marketing',
      description: 'Rendimiento de promociones y ofertas',
      category: 'marketing',
      icon: 'Megaphone',
      preview: 'ROI de campañas y conversiones'
    },
    {
      id: 'service-analytics',
      name: 'Análisis de Servicios',
      description: 'Popularidad y rentabilidad por servicio',
      category: 'analytics',
      icon: 'Scissors',
      preview: 'Servicios más solicitados y márgenes'
    },
    {
      id: 'appointment-trends',
      name: 'Tendencias de Citas',
      description: 'Patrones de reserva y horarios pico',
      category: 'operations',
      icon: 'Clock',
      preview: 'Horas más ocupadas y estacionalidad'
    },
    {
      id: 'loyalty-program',
      name: 'Programa de Fidelidad',
      description: 'Seguimiento de puntos y recompensas',
      category: 'customer',
      icon: 'Award',
      preview: 'Clientes activos y canjes realizados'
    }
  ];

  const categories = [
    { id: 'all', name: 'Todos', icon: 'Grid3X3' },
    { id: 'analytics', name: 'Análisis', icon: 'BarChart3' },
    { id: 'operations', name: 'Operaciones', icon: 'Settings' },
    { id: 'finance', name: 'Finanzas', icon: 'DollarSign' },
    { id: 'customer', name: 'Clientes', icon: 'Users' },
    { id: 'marketing', name: 'Marketing', icon: 'Megaphone' }
  ];

  const filteredWidgets = availableWidgets?.filter(widget => {
    const matchesSearch = widget?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         widget?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || widget?.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddWidget = (widget) => {
    onAddWidget(widget);
    // Show success feedback
    console.log(`Widget "${widget?.name}" agregado al dashboard`);
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        iconName="Plus"
        iconPosition="left"
        onClick={onToggle}
        className="fixed bottom-6 right-6 z-40 shadow-lg"
      >
        Agregar Widget
      </Button>
    );
  }

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-card border-l border-border shadow-xl z-50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name="Plus" size={20} className="text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground font-heading">
                Biblioteca de Widgets
              </h2>
              <p className="text-sm text-muted-foreground">
                Personaliza tu dashboard
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Icon 
            name="Search" 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
          />
          <input
            type="text"
            placeholder="Buscar widgets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>
      </div>
      {/* Categories */}
      <div className="p-4 border-b border-border">
        <div className="flex flex-wrap gap-2">
          {categories?.map((category) => (
            <Button
              key={category?.id}
              variant={selectedCategory === category?.id ? 'default' : 'outline'}
              size="sm"
              iconName={category?.icon}
              iconPosition="left"
              onClick={() => setSelectedCategory(category?.id)}
            >
              {category?.name}
            </Button>
          ))}
        </div>
      </div>
      {/* Widgets List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {filteredWidgets?.map((widget) => (
            <div
              key={widget?.id}
              className="p-4 border border-border rounded-lg hover:border-accent/50 hover:shadow-sm transition-all duration-200"
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name={widget?.icon} size={20} className="text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground font-body mb-1">
                    {widget?.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {widget?.description}
                  </p>
                  <p className="text-xs text-muted-foreground italic">
                    {widget?.preview}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                  {categories?.find(cat => cat?.id === widget?.category)?.name}
                </span>
                <Button
                  variant="default"
                  size="sm"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={() => handleAddWidget(widget)}
                >
                  Agregar
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredWidgets?.length === 0 && (
          <div className="text-center py-12">
            <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No se encontraron widgets
            </h3>
            <p className="text-muted-foreground">
              Intenta con otros términos de búsqueda o categorías
            </p>
          </div>
        )}
      </div>
      {/* Footer */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{filteredWidgets?.length} widgets disponibles</span>
          <Button
            variant="ghost"
            size="sm"
            iconName="RefreshCw"
            iconPosition="left"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
          >
            Limpiar filtros
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WidgetLibrary;