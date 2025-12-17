import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const HelpPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Centro de Ayuda</h1>
                        <p className="text-muted-foreground mt-2">Documentación y soporte para tu barbería</p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => navigate('/business-dashboard')}
                        iconName="ArrowLeft"
                        iconPosition="left"
                    >
                        Volver
                    </Button>
                </header>

                <div className="bg-card border border-border rounded-lg p-12 text-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Icon name="BookOpen" size={40} className="text-primary" />
                    </div>

                    <h2 className="text-2xl font-semibold text-foreground mb-4">
                        Manual de Usuario en Construcción
                    </h2>

                    <p className="text-muted-foreground max-w-lg mx-auto mb-8">
                        Estamos preparando una guía completa para ayudarte a sacar el máximo provecho de BarberTurn.
                        Próximamente encontrarás tutoriales paso a paso sobre cómo gestionar tus citas, configurar tu perfil y más.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto text-left">
                        <div className="p-4 border border-border rounded-lg bg-muted/30">
                            <div className="flex items-center space-x-3 mb-2">
                                <Icon name="Mail" size={20} className="text-primary" />
                                <h3 className="font-medium">Soporte por Email</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Si tienes dudas urgentes, contáctanos en: <br />
                                <a href="mailto:soporte@barberturn.com" className="text-primary hover:underline">soporte@barberturn.com</a>
                            </p>
                        </div>

                        <div className="p-4 border border-border rounded-lg bg-muted/30">
                            <div className="flex items-center space-x-3 mb-2">
                                <Icon name="MessageSquare" size={20} className="text-primary" />
                                <h3 className="font-medium">Chat de Soporte</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Nuestro equipo de soporte está disponible de Lunes a Viernes de 9hs a 18hs.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpPage;
