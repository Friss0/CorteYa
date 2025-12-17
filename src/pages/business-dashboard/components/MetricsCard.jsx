import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'positive', 
  icon, 
  subtitle,
  isDragging = false,
  ...dragProps 
}) => {
  const formatValue = (val) => {
    if (typeof val === 'number') {
      if (val >= 1000) {
        return val?.toLocaleString('es-ES');
      }
      return val?.toString();
    }
    return val;
  };

  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive':
        return 'TrendingUp';
      case 'negative':
        return 'TrendingDown';
      default:
        return 'Minus';
    }
  };

  return (
    <div
      {...dragProps}
      className={`
        bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200
        ${isDragging ? 'opacity-50 rotate-2 scale-105' : ''}
        cursor-move
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name={icon} size={20} className="text-accent" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground font-body">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-3xl font-bold text-foreground font-heading">
              {formatValue(value)}
            </p>
            
            {change && (
              <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
                <Icon name={getChangeIcon()} size={16} />
                <span className="text-sm font-medium">
                  {change}
                </span>
                <span className="text-xs text-muted-foreground">
                  vs mes anterior
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="opacity-30 hover:opacity-100 transition-opacity">
          <Icon name="GripVertical" size={16} className="text-muted-foreground" />
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;