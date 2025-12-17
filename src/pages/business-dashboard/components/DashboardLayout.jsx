import React, { useState, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ItemType = 'WIDGET';

const DraggableWidget = ({ id, index, children, moveWidget, onRemove }) => {
  const [dragState, drag] = useDrag({
    type: ItemType,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor?.isDragging(),
    }),
  });
  
  const { isDragging } = dragState;

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem?.index !== index) {
        moveWidget(draggedItem?.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`relative group ${isDragging ? 'opacity-50' : ''}`}
    >
      {/* Remove Button */}
      <Button
        variant="destructive"
        size="icon"
        className="absolute -top-2 -right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-6 h-6"
        onClick={() => onRemove(id)}
      >
        <Icon name="X" size={12} />
      </Button>
      
      {/* Widget Content */}
      {React.cloneElement(children, { isDragging, dragRef: drag })}
    </div>
  );
};

const DashboardLayout = ({ widgets, onMoveWidget, onRemoveWidget, onLayoutChange }) => {
  const [layout, setLayout] = useState('grid'); // 'grid' or 'masonry'

  const moveWidget = useCallback((fromIndex, toIndex) => {
    onMoveWidget(fromIndex, toIndex);
  }, [onMoveWidget]);

  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout);
    onLayoutChange(newLayout);
  };

  const getGridClasses = () => {
    switch (layout) {
      case 'masonry':
        return 'columns-1 md:columns-2 xl:columns-3 gap-8 space-y-8';
      default:
        return 'grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8';
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {/* Layout Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="Layout" size={20} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              Diseño del Dashboard
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex bg-muted rounded-lg p-1">
              <Button
                variant={layout === 'grid' ? 'default' : 'ghost'}
                size="sm"
                iconName="Grid3X3"
                onClick={() => handleLayoutChange('grid')}
                title="Vista en cuadrícula"
              />
              <Button
                variant={layout === 'masonry' ? 'default' : 'ghost'}
                size="sm"
                iconName="Columns"
                onClick={() => handleLayoutChange('masonry')}
                title="Vista en columnas"
              />
            </div>
            
            <Button
              variant="outline"
              size="sm"
              iconName="RotateCcw"
              onClick={() => {
                // Reset to default layout
                console.log('Restaurar diseño por defecto');
              }}
              title="Restaurar diseño por defecto"
            >
              Restaurar
            </Button>
          </div>
        </div>

        {/* Widgets Container */}
        {widgets?.length === 0 ? (
          <div className="text-center py-16 bg-card border border-dashed border-border rounded-lg">
            <Icon name="LayoutDashboard" size={64} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2 font-heading">
              Dashboard Vacío
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Tu dashboard está vacío. Agrega widgets desde la biblioteca para comenzar a visualizar tus datos de negocio.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
                onClick={() => console.log('Abrir biblioteca de widgets')}
              >
                Agregar Widgets
              </Button>
              <Button
                variant="outline"
                iconName="Zap"
                iconPosition="left"
                onClick={() => console.log('Usar plantilla predeterminada')}
              >
                Usar Plantilla
              </Button>
            </div>
          </div>
        ) : (
          <div className={getGridClasses()}>
            {widgets?.map((widget, index) => (
              <DraggableWidget
                key={widget?.id}
                id={widget?.id}
                index={index}
                moveWidget={moveWidget}
                onRemove={onRemoveWidget}
              >
                {widget?.component}
              </DraggableWidget>
            ))}
          </div>
        )}

        {/* Layout Info */}
        {widgets?.length > 0 && (
          <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground bg-muted/30 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Icon name="Move" size={16} />
              <span>Arrastra los widgets para reorganizar</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="X" size={16} />
              <span>Haz hover para eliminar</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Save" size={16} />
              <span>Los cambios se guardan automáticamente</span>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default DashboardLayout;