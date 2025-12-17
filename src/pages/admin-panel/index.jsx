import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from './components/AdminHeader';
import UserManagementTable from './components/UserManagementTable';
import SystemAnalytics from './components/SystemAnalytics';
import UserCreationModal from './components/UserCreationModal';
import AdminToolsPanel from './components/AdminToolsPanel';
import SystemDiagnostics from './components/SystemDiagnostics';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { userService } from '../../services/userService';
import { MetricsService } from '../../services/metricsService';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [error, setError] = useState(null);

  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('barberTurnUser');
    if (!savedUser) {
      navigate('/user-login');
      return;
    }
    try {
      const user = JSON.parse(savedUser);
      if (user.role !== 'admin') {
        navigate('/business-dashboard');
      }
    } catch (e) {
      navigate('/user-login');
    }
  }, [navigate]);

  useEffect(() => {
    // Fetch analytics on mount and when users change
    const loadAnalytics = async () => {
      try {
        const data = await MetricsService.getAdminMetrics();
        setAnalyticsData(data);
      } catch (err) {
        console.error("Error loading analytics:", err);
      }
    };
    loadAnalytics();
  }, [users]); // Re-calc when users list updates

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    // Subscribe to real-time updates
    const unsubscribe = userService.subscribeToUsers(
      (data) => {
        setUsers(data);
        setLastUpdated(new Date());
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Subscription error:", err);
        setError("Error al conectar con la base de datos: " + (err.message || "Permisos insuficientes"));
        setIsLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleCreateUser = async (newUser) => {
    try {
      // Remove mock ID if present, let Firestore generate it
      // eslint-disable-next-line no-unused-vars
      const { id, ...userData } = newUser;
      await userService.createUser(userData);
      // No need to manually refresh, subscription handles it
    } catch (error) {
      console.error("Failed to create user", error);
      alert("Error al crear usuario: " + error.message);
      throw error;
    }
  };

  const handleEditUser = async (updatedUser) => {
    try {
      const { id, ...data } = updatedUser;
      await userService.updateUser(id, data);
    } catch (error) {
      console.error("Failed to update user", error);
      alert("Error al actualizar usuario: " + error.message);
      throw error;
    }
  };

  const handleUserAction = async (action, userId) => {
    console.log(`Admin action: ${action} for user ${userId}`);

    switch (action) {
      case 'edit':
        const userToEdit = users?.find(user => user?.id === userId);
        if (userToEdit) {
          setEditingUser(userToEdit);
          setIsEditModalOpen(true);
        }
        break;
      case 'delete':
        if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
          try {
            await userService.deleteUser(userId);
          } catch (error) {
            console.error("Failed to delete user", error);
            alert("Error al eliminar usuario");
          }
        }
        break;
      default:
        break;
    }
  };

  const handleBulkAction = async (action, userIds) => {
    console.log(`Bulk action: ${action} for users:`, userIds);

    try {
      switch (action) {
        case 'activate':
          await userService.bulkUpdateStatus(userIds, 'active');
          break;
        case 'deactivate':
          await userService.bulkUpdateStatus(userIds, 'inactive');
          break;
        case 'delete':
          if (window.confirm(`¿Estás seguro de que deseas eliminar ${userIds?.length} usuario(s)?`)) {
            await userService.bulkDelete(userIds);
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Failed to perform bulk action ${action}`, error);
      alert(`Error al ejecutar acción masiva: ${action}`);
    }
  };

  const handleToolAction = (action, data) => {
    console.log(`Tool action: ${action}`, data);
  };

  const handleRefresh = () => {
    console.log('Refreshing admin panel data... (Auto-handled by subscription)');
  };

  const tabs = [
    { id: 'users', label: 'Gestión de Usuarios', icon: 'Users' },
    { id: 'analytics', label: 'Análisis del Sistema', icon: 'BarChart3' },
    { id: 'tools', label: 'Herramientas Admin', icon: 'Settings' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content - Full width without sidebar */}
      <div className="w-full">
        {/* Header */}
        <AdminHeader
          onCreateUser={() => setIsCreateModalOpen(true)}
          onRefresh={handleRefresh}
          lastUpdated={lastUpdated}
        />

        {/* Content Area - Full width layout */}
        <div className="p-4">
          {/* Tab Navigation */}
          <div className="mb-4">
            <div className="border-b border-border">
              <nav className="flex space-x-6">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`
                      flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-micro
                      ${activeTab === tab?.id
                        ? 'border-error text-error' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                      }
                    `}
                  >
                    <Icon name={tab?.icon} size={18} />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            {activeTab === 'users' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Gestión de Usuarios</h2>
                    <p className="text-muted-foreground">
                      Administra las cuentas de barbería registradas en el sistema
                    </p>
                  </div>
                  <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    iconName="UserPlus"
                    iconPosition="left"
                  >
                    Nuevo Usuario
                  </Button>
                </div>

                {error && (
                  <div className="bg-error/10 border border-error text-error p-4 rounded-md mb-4 flex items-center">
                    <Icon name="AlertCircle" size={20} className="mr-2" />
                    <span>{error}</span>
                  </div>
                )}

                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <UserManagementTable
                    users={users}
                    onUserAction={handleUserAction}
                    onBulkAction={handleBulkAction}
                  />
                )}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div>
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-foreground">Análisis del Sistema</h2>
                  <p className="text-muted-foreground">
                    Métricas y estadísticas de la plataforma BarberTurn
                  </p>
                </div>

                <SystemAnalytics analyticsData={analyticsData} />
              </div>
            )}

            {activeTab === 'tools' && (
              <div>
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-foreground">Herramientas Administrativas</h2>
                  <p className="text-muted-foreground">
                    Utilidades y configuraciones avanzadas del sistema
                  </p>
                </div>

                <AdminToolsPanel onToolAction={handleToolAction} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Creation Modal */}
      <UserCreationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateUser={handleCreateUser}
      />

      {/* User Edit Modal */}
      <UserCreationModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingUser(null);
        }}
        onCreateUser={handleEditUser}
        editMode={true}
        userData={editingUser}
      />

      {/* System Diagnostics Tool */}
      <SystemDiagnostics />
    </div>
  );
};

export default AdminPanel;