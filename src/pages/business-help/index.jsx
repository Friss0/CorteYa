
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarNavigation from '../../components/ui/SidebarNavigation';
import UserProfileDropdown from '../../components/ui/UserProfileDropdown';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { db } from '../../lib/firebase';
import { ref, get } from 'firebase/database';

const BusinessHelpPage = () => {
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [userData, setUserData] = useState(null);

    // Fetch user data for sidebar/header
    useEffect(() => {
        const loadData = async () => {
            const session = localStorage.getItem('barberTurnUser');
            if (!session) {
                navigate('/user-login');
                return;
            }
            if (session) {
                const sessionObj = JSON.parse(session);
                const uid = sessionObj.uid;
                const userRef = ref(db, `barbershops/${uid}`);
                const snapshot = await get(userRef);

                let currentUserData = {
                    name: sessionObj.name || "Propietario",
                    email: sessionObj.email || "",
                    role: "business",
                    businessName: sessionObj.businessName || "Mi Barbería"
                };

                if (snapshot.exists()) {
                    const data = snapshot.val();
                    currentUserData = {
                        name: data.ownerName || sessionObj.name || "Propietario",
                        email: data.email || sessionObj.email || "",
                        role: "business",
                        businessName: data.name || data.businessName || sessionObj.businessName || "Mi Barbería",
                        ...data
                    };
                }
                setUserData(currentUserData);
            }
        };
        loadData();
    }, [navigate]);

    const handleSidebarToggle = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="flex">
                <SidebarNavigation
                    isCollapsed={sidebarCollapsed}
                    onToggle={handleSidebarToggle}
                    userRole={userData?.role}
                />

                <div className={`flex-1 transition-all duration-200 ${sidebarCollapsed ? 'ml-14' : 'ml-52'}`}>
                    {/* Header */}
                    <header className="bg-card border-b border-border px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleSidebarToggle}
                                    className="hidden md:flex"
                                >
                                    <Icon name={sidebarCollapsed ? 'ChevronRight' : 'ChevronLeft'} size={20} />
                                </Button>
                                <div>
                                    <h1 className="text-xl font-semibold text-foreground font-heading">
                                        Ayuda y Documentación
                                    </h1>
                                    <p className="text-sm text-muted-foreground">
                                        Recursos y manuales para propietarioss
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <UserProfileDropdown
                                    userName={userData?.name}
                                    userRole={userData?.role}
                                    userEmail={userData?.email}
                                />
                            </div>
                        </div>
                    </header>

                    <main className="p-8 max-w-5xl mx-auto">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold font-heading mb-4">Manuales de Usuario</h2>
                            <p className="text-muted-foreground mb-6">
                                Descarga los manuales de usuario para aprender a utilizar todas las funcionalidades de CorteYa.
                            </p>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Mobile Manual Card */}
                                <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                            <Icon name="Smartphone" size={32} />
                                        </div>
                                        <span className="text-xs font-medium px-2 py-1 bg-muted rounded-full text-muted-foreground">PDF</span>
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">Manual Mobile</h3>
                                    <p className="text-sm text-muted-foreground mb-6">
                                        Guía completa para la gestión de tu barbería desde dispositivos móviles.
                                    </p>
                                    <a
                                        href="/assets/docs/manual-mobile.pdf"
                                        download="Manual_Usuario_Mobile.pdf"
                                        className="inline-flex items-center justify-center w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
                                    >
                                        <Icon name="Download" size={16} className="mr-2" />
                                        Descargar Manual
                                    </a>
                                </div>

                                {/* Web Manual Card */}
                                <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                                            <Icon name="Laptop" size={32} />
                                        </div>
                                        <span className="text-xs font-medium px-2 py-1 bg-muted rounded-full text-muted-foreground">PDF</span>
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">Manual Web</h3>
                                    <p className="text-sm text-muted-foreground mb-6">
                                        Documentación detallada para el uso del panel de administración web.
                                    </p>
                                    <a
                                        href="/assets/docs/manual-web.pdf"
                                        download="Manual_Usuario_Web.pdf"
                                        className="inline-flex items-center justify-center w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
                                    >
                                        <Icon name="Download" size={16} className="mr-2" />
                                        Descargar Manual
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Contact Support Section */}
                        <div className="bg-muted/30 border border-border rounded-xl p-8 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-background rounded-full shadow-sm mb-4">
                                <Icon name="HelpCircle" size={24} className="text-foreground" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">¿Necesitas ayuda adicional?</h3>
                            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                                Si no encuentras lo que buscas en los manuales, nuestro equipo de soporte está disponible para ayudarte.
                            </p>
                            <Button variant="outline" onClick={() => window.open('mailto:soporte@corteya.com')}>
                                Contactar Soporte
                            </Button>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default BusinessHelpPage;
