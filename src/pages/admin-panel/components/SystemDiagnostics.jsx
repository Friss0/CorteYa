import React, { useState, useEffect } from 'react';
import { Activity, Server, Wifi, Database, CheckCircle, AlertCircle } from 'lucide-react';

const SystemDiagnostics = () => {
    const [stats, setStats] = useState({
        serverStatus: 'online',
        latency: '24ms',
        database: 'connected',
        lastCheck: new Date().toLocaleTimeString()
    });

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => ({
                ...prev,
                latency: Math.floor(Math.random() * (45 - 15) + 15) + 'ms',
                lastCheck: new Date().toLocaleTimeString()
            }));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <Activity className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Estado del Sistema</h3>
                        <p className="text-sm text-gray-500">Monitoreo en tiempo real</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span>Sistema Operativo</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Server Status */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-500 text-sm font-medium">Servidor API</span>
                        <Server className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-lg font-bold text-gray-800">Online</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-green-500 h-1.5 rounded-full w-full"></div>
                    </div>
                </div>

                {/* Database Status */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-500 text-sm font-medium">Base de Datos</span>
                        <Database className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-blue-500" />
                        <span className="text-lg font-bold text-gray-800">Conectado</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-blue-500 h-1.5 rounded-full w-[98%]"></div>
                    </div>
                </div>

                {/* Network Status */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-500 text-sm font-medium">Latencia</span>
                        <Wifi className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-800">{stats.latency}</span>
                        <span className="text-xs text-gray-400">ms</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-indigo-500 h-1.5 rounded-full w-[95%] animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemDiagnostics;
