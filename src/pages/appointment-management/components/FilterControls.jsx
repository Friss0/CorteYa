import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const FilterControls = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  services, 
  staff 
}) => {
  const statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'confirmed', label: 'Confirmadas' },
    { value: 'in-progress', label: 'En Progreso' },
    { value: 'completed', label: 'Completadas' },
    { value: 'cancelled', label: 'Canceladas' }
  ];

  const serviceOptions = [
    { value: '', label: 'Todos los servicios' },
    ...services?.map(service => ({
      value: service?.name,
      label: service?.name
    }))
  ];

  const staffOptions = [
    { value: '', label: 'Todo el personal' },
    ...staff?.map(member => ({
      value: member?.name,
      label: member?.name
    }))
  ];

  const priorityOptions = [
    { value: '', label: 'Todas las prioridades' },
    { value: 'normal', label: 'Normal' },
    { value: 'medium', label: 'Media' },
    { value: 'high', label: 'Alta' }
  ];

  const hasActiveFilters = Object.values(filters)?.some(value => value !== '');

  return (
    <div className="bg-card rounded-lg border border-border p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
          <Icon name="Filter" size={20} />
          <span>Filtros</span>
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            iconName="X"
            iconPosition="left"
          >
            Limpiar
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Input
            label="Buscar cliente"
            type="search"
            placeholder="Nombre del cliente..."
            value={filters?.search}
            onChange={(e) => onFilterChange('search', e?.target?.value)}
          />
          <Icon 
            name="Search" 
            size={16} 
            className="absolute right-3 top-9 text-muted-foreground pointer-events-none" 
          />
        </div>

        {/* Status Filter */}
        <Select
          label="Estado"
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => onFilterChange('status', value)}
        />

        {/* Service Filter */}
        <Select
          label="Servicio"
          options={serviceOptions}
          value={filters?.service}
          onChange={(value) => onFilterChange('service', value)}
        />

        {/* Staff Filter */}
        <Select
          label="Personal"
          options={staffOptions}
          value={filters?.staff}
          onChange={(value) => onFilterChange('staff', value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Date Range */}
        <Input
          label="Fecha desde"
          type="date"
          value={filters?.dateFrom}
          onChange={(e) => onFilterChange('dateFrom', e?.target?.value)}
        />

        <Input
          label="Fecha hasta"
          type="date"
          value={filters?.dateTo}
          onChange={(e) => onFilterChange('dateTo', e?.target?.value)}
        />

        {/* Priority Filter */}
        <Select
          label="Prioridad"
          options={priorityOptions}
          value={filters?.priority}
          onChange={(value) => onFilterChange('priority', value)}
        />
      </div>
      {/* Quick Filter Buttons */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
        <span className="text-sm font-medium text-muted-foreground mr-2">Filtros rápidos:</span>
        
        <Button
          variant={filters?.quickFilter === 'today' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange('quickFilter', filters?.quickFilter === 'today' ? '' : 'today')}
        >
          Hoy
        </Button>

        <Button
          variant={filters?.quickFilter === 'tomorrow' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange('quickFilter', filters?.quickFilter === 'tomorrow' ? '' : 'tomorrow')}
        >
          Mañana
        </Button>

        <Button
          variant={filters?.quickFilter === 'week' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange('quickFilter', filters?.quickFilter === 'week' ? '' : 'week')}
        >
          Esta Semana
        </Button>

        <Button
          variant={filters?.quickFilter === 'pending' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange('quickFilter', filters?.quickFilter === 'pending' ? '' : 'pending')}
        >
          Pendientes
        </Button>

        <Button
          variant={filters?.quickFilter === 'completed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange('quickFilter', filters?.quickFilter === 'completed' ? '' : 'completed')}
        >
          Completadas
        </Button>
      </div>
      {/* Filter Summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          <span className="text-sm font-medium text-muted-foreground">Filtros activos:</span>
          
          {filters?.search && (
            <div className="flex items-center space-x-1 bg-accent/10 text-accent px-2 py-1 rounded text-xs">
              <span>Búsqueda: "{filters?.search}"</span>
              <button
                onClick={() => onFilterChange('search', '')}
                className="hover:bg-accent/20 rounded p-0.5"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}

          {filters?.status && (
            <div className="flex items-center space-x-1 bg-accent/10 text-accent px-2 py-1 rounded text-xs">
              <span>Estado: {statusOptions?.find(opt => opt?.value === filters?.status)?.label}</span>
              <button
                onClick={() => onFilterChange('status', '')}
                className="hover:bg-accent/20 rounded p-0.5"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}

          {filters?.service && (
            <div className="flex items-center space-x-1 bg-accent/10 text-accent px-2 py-1 rounded text-xs">
              <span>Servicio: {filters?.service}</span>
              <button
                onClick={() => onFilterChange('service', '')}
                className="hover:bg-accent/20 rounded p-0.5"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}

          {filters?.staff && (
            <div className="flex items-center space-x-1 bg-accent/10 text-accent px-2 py-1 rounded text-xs">
              <span>Personal: {filters?.staff}</span>
              <button
                onClick={() => onFilterChange('staff', '')}
                className="hover:bg-accent/20 rounded p-0.5"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterControls;