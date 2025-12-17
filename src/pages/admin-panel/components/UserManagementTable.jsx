import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const UserManagementTable = ({ users, onUserAction, onBulkAction }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPlan, setFilterPlan] = useState('all');
  const [sortBy, setSortBy] = useState('registrationDate');
  const [sortOrder, setSortOrder] = useState('desc');

  const statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'active', label: 'Activo' },
    { value: 'inactive', label: 'Inactivo' },
    { value: 'suspended', label: 'Suspendido' }
  ];

  const planOptions = [
    { value: 'all', label: 'Todos los planes' },
    { value: 'basic', label: 'Plan Básico' },
    { value: 'premium', label: 'Plan Premium' },
    { value: 'trial', label: 'Prueba Gratuita' }
  ];

  const sortOptions = [
    { value: 'registrationDate', label: 'Fecha de registro' },
    { value: 'businessName', label: 'Nombre del negocio' },
    { value: 'ownerName', label: 'Nombre del propietario' },
    { value: 'lastActivity', label: 'Última actividad' }
  ];

  const filteredUsers = users?.filter(user => {
    const matchesSearch = user?.businessName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         user?.ownerName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         user?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user?.status === filterStatus;
    const matchesPlan = filterPlan === 'all' || user?.subscriptionPlan === filterPlan;
    
    return matchesSearch && matchesStatus && matchesPlan;
  })?.sort((a, b) => {
    const aValue = a?.[sortBy];
    const bValue = b?.[sortBy];
    const modifier = sortOrder === 'asc' ? 1 : -1;
    
    if (sortBy === 'registrationDate' || sortBy === 'lastActivity') {
      return (new Date(aValue) - new Date(bValue)) * modifier;
    }
    
    return aValue?.localeCompare(bValue) * modifier;
  });

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedUsers(filteredUsers?.map(user => user?.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId, checked) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers?.filter(id => id !== userId));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-success text-success-foreground', label: 'Activo' },
      inactive: { color: 'bg-muted text-muted-foreground', label: 'Inactivo' },
      suspended: { color: 'bg-error text-error-foreground', label: 'Suspendido' }
    };
    
    const config = statusConfig?.[status] || statusConfig?.inactive;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const getPlanBadge = (plan) => {
    const planConfig = {
      basic: { color: 'bg-secondary text-secondary-foreground', label: 'Básico' },
      premium: { color: 'bg-accent text-accent-foreground', label: 'Premium' },
      trial: { color: 'bg-warning text-warning-foreground', label: 'Prueba' }
    };
    
    const config = planConfig?.[plan] || planConfig?.basic;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Filters and Search */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Buscar por nombre de negocio, propietario o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select
              options={statusOptions}
              value={filterStatus}
              onChange={setFilterStatus}
              placeholder="Estado"
              className="w-full sm:w-40"
            />
            <Select
              options={planOptions}
              value={filterPlan}
              onChange={setFilterPlan}
              placeholder="Plan"
              className="w-full sm:w-40"
            />
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
              placeholder="Ordenar por"
              className="w-full sm:w-48"
            />
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUsers?.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 p-3 bg-muted rounded-md">
            <span className="text-sm font-medium text-foreground">
              {selectedUsers?.length} usuario(s) seleccionado(s)
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkAction('activate', selectedUsers)}
              iconName="CheckCircle"
              iconPosition="left"
            >
              Activar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkAction('deactivate', selectedUsers)}
              iconName="XCircle"
              iconPosition="left"
            >
              Desactivar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onBulkAction('delete', selectedUsers)}
              iconName="Trash2"
              iconPosition="left"
            >
              Eliminar
            </Button>
          </div>
        )}
      </div>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="p-4 text-left">
                <Checkbox
                  checked={selectedUsers?.length === filteredUsers?.length && filteredUsers?.length > 0}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                />
              </th>
              <th className="p-4 text-left text-sm font-semibold text-foreground">Negocio</th>
              <th className="p-4 text-left text-sm font-semibold text-foreground">Propietario</th>
              <th className="p-4 text-left text-sm font-semibold text-foreground">Plan</th>
              <th className="p-4 text-left text-sm font-semibold text-foreground">Estado</th>
              <th className="p-4 text-left text-sm font-semibold text-foreground">Registro</th>
              <th className="p-4 text-left text-sm font-semibold text-foreground">Última Actividad</th>
              <th className="p-4 text-left text-sm font-semibold text-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers?.map((user) => (
              <tr key={user?.id} className="border-b border-border hover:bg-muted/50 transition-micro">
                <td className="p-4">
                  <Checkbox
                    checked={selectedUsers?.includes(user?.id)}
                    onChange={(e) => handleSelectUser(user?.id, e?.target?.checked)}
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center">
                      <Icon name="Store" size={20} color="white" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{user?.businessName}</p>
                      <p className="text-sm text-muted-foreground">{user?.location}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div>
                    <p className="font-medium text-foreground">{user?.ownerName}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </td>
                <td className="p-4">
                  {getPlanBadge(user?.subscriptionPlan)}
                </td>
                <td className="p-4">
                  {getStatusBadge(user?.status)}
                </td>
                <td className="p-4">
                  <p className="text-sm text-foreground">{formatDate(user?.registrationDate)}</p>
                </td>
                <td className="p-4">
                  <p className="text-sm text-foreground">{formatDate(user?.lastActivity)}</p>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onUserAction('edit', user?.id)}
                      iconName="Edit"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onUserAction('delete', user?.id)}
                      iconName="Trash2"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="lg:hidden">
        {filteredUsers?.map((user) => (
          <div key={user?.id} className="p-4 border-b border-border">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={selectedUsers?.includes(user?.id)}
                  onChange={(e) => handleSelectUser(user?.id, e?.target?.checked)}
                />
                <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center">
                  <Icon name="Store" size={20} color="white" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{user?.businessName}</p>
                  <p className="text-sm text-muted-foreground">{user?.ownerName}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onUserAction('edit', user?.id)}
                  iconName="Edit"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onUserAction('delete', user?.id)}
                  iconName="Trash2"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Email:</p>
                <p className="text-foreground">{user?.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Plan:</p>
                {getPlanBadge(user?.subscriptionPlan)}
              </div>
              <div>
                <p className="text-muted-foreground">Estado:</p>
                {getStatusBadge(user?.status)}
              </div>
              <div>
                <p className="text-muted-foreground">Registro:</p>
                <p className="text-foreground">{formatDate(user?.registrationDate)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Empty State */}
      {filteredUsers?.length === 0 && (
        <div className="p-12 text-center">
          <Icon name="Users" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No se encontraron usuarios</h3>
          <p className="text-muted-foreground">
            Intenta ajustar los filtros de búsqueda o crear un nuevo usuario.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserManagementTable;