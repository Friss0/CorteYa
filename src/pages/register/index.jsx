import React, { useState } from 'react';
import { Mail, MessageCircle, Loader2, CheckCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import NavigationBar from '../../components/layout/NavigationBar';
import FooterSection from '../../components/layout/FooterSection';
import { userService } from '../../services/userService';
import { consultasService } from '../../services/consultasService';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        businessName: '',
        instagram: '',
        email: '',
        phone: '',
        province: '',
        message: ''
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Map form data to database schema for Consultas
            const newConsulta = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                businessName: formData.businessName,
                email: formData.email,
                phone: formData.phone,
                location: formData.province,
                instagram: formData.instagram,
                message: formData.message,
                type: 'business_registration_request'
            };

            await consultasService.createConsulta(newConsulta);
            setSuccess(true);
            setFormData({
                firstName: '',
                lastName: '',
                businessName: '',
                instagram: '',
                email: '',
                phone: '',
                province: '',
                message: ''
            });
        } catch (err) {
            console.error("Registration error:", err);
            setError("Hubo un error al enviar tu solicitud. Por favor intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <NavigationBar />

            {/* Main Content Area - Flex Grow to push footer down */}
            <div className="flex-grow relative flex items-center justify-center py-24 px-6 overflow-hidden">
                {/* Right Side Black Square/Background */}
                <div className="absolute top-0 right-0 bottom-0 w-[30%] lg:w-[35%] bg-black hidden lg:block z-0"></div>

                <div className="container mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-10 w-full max-w-5xl items-center mx-auto">

                        {/* Left Column: Info */}
                        <div className="flex flex-col space-y-8 text-center lg:text-left items-center lg:items-start">
                            <h1 className="text-4xl md:text-5xl font-bold font-heading text-black leading-tight">
                                Sumá tu local a <br /> <span className="text-[#3ea02c]">Corte Ya</span>
                            </h1>
                            <p className="text-xl text-gray-600 max-w-lg">
                                Si buscás potenciar tu negocio y generar mayores ventas, sumate a nuestra app.
                            </p>

                            <div className="space-y-4 max-w-md w-full pt-8">
                                {/* Mail Card */}
                                <div className="flex items-center gap-5 p-6 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all bg-white text-left">
                                    <div className="bg-orange-50 p-4 rounded-full shrink-0">
                                        <Mail className="h-6 w-6 text-orange-500" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-black text-lg">Por mail</p>
                                        <a href="mailto:ventas@corteya.app" className="text-gray-500 hover:text-black block font-medium">
                                            ventas@corteya.app
                                        </a>
                                    </div>
                                </div>

                                {/* WhatsApp Card */}
                                <div className="flex items-center gap-5 p-6 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all bg-white text-left">
                                    <div className="bg-green-50 p-4 rounded-full shrink-0">
                                        <MessageCircle className="h-6 w-6 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-black text-lg">Chatea con nosotros</p>
                                        <button className="text-gray-500 hover:text-black text-left font-medium">
                                            Abrir en Whatsapp
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Form */}
                        <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-2xl border border-gray-100 relative w-full lg:-ml-12 xl:-ml-0">

                            {success ? (
                                <div className="flex flex-col items-center justify-center text-center py-12 space-y-6">
                                    <div className="bg-green-100 p-6 rounded-full">
                                        <CheckCircle className="h-16 w-16 text-green-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-black">¡Solicitud Enviada!</h3>
                                    <p className="text-gray-600 max-w-xs">
                                        Hemos recibido tus datos correctamente. Nuestro equipo se pondrá en contacto pronto.
                                    </p>
                                    <Button onClick={() => setSuccess(false)} className="bg-black text-white px-8 py-3 rounded-xl hover:bg-gray-800 transition-all font-medium">
                                        Enviar otra solicitud
                                    </Button>
                                </div>
                            ) : (
                                <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-black">Nombre <span className="text-red-500">*</span></label>
                                            <Input
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                placeholder=""
                                                className="bg-gray-50 border-gray-200 focus:bg-white h-12 rounded-xl"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-black">Apellido <span className="text-red-500">*</span></label>
                                            <Input
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                placeholder=""
                                                className="bg-gray-50 border-gray-200 focus:bg-white h-12 rounded-xl"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-black">Nombre de tu local <span className="text-red-500">*</span></label>
                                            <Input
                                                name="businessName"
                                                value={formData.businessName}
                                                onChange={handleChange}
                                                placeholder=""
                                                className="bg-gray-50 border-gray-200 focus:bg-white h-12 rounded-xl"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-black">Instagram</label>
                                            <Input
                                                name="instagram"
                                                value={formData.instagram}
                                                onChange={handleChange}
                                                placeholder=""
                                                className="bg-gray-50 border-gray-200 focus:bg-white h-12 rounded-xl"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-black">Email <span className="text-red-500">*</span></label>
                                            <Input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder=""
                                                className="bg-gray-50 border-gray-200 focus:bg-white h-12 rounded-xl"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-black">Teléfono <span className="text-red-500">*</span></label>
                                            <Input
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder=""
                                                className="bg-gray-50 border-gray-200 focus:bg-white h-12 rounded-xl"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-black">Provincia <span className="text-red-500">*</span></label>
                                            <select
                                                name="province"
                                                value={formData.province}
                                                onChange={handleChange}
                                                className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus:bg-white"
                                                required
                                            >
                                                <option value="">Seleccionar...</option>
                                                <option>Buenos Aires</option>
                                                <option>CABA</option>
                                                <option>Córdoba</option>
                                                <option>Santa Fe</option>
                                                <option>Mendoza</option>
                                                <option>Otra</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-black">Mensaje</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            className="flex min-h-[120px] w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black resize-none focus:bg-white"
                                            placeholder="Contanos más acerca de tu local..."
                                        />
                                    </div>

                                    {error && (
                                        <div className="text-red-500 text-center text-sm font-medium p-2 bg-red-50 rounded-lg">
                                            {error}
                                        </div>
                                    )}

                                    <Button type="submit" size="lg" disabled={loading} className="w-full bg-black text-white hover:bg-gray-800 py-6 rounded-xl font-bold text-lg shadow-lg disabled:opacity-70 disabled:cursor-not-allowed">
                                        {loading ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                <span>Enviando...</span>
                                            </div>
                                        ) : (
                                            "Enviar"
                                        )}
                                    </Button>

                                </form>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            <FooterSection />
        </div>
    );
};

export default RegisterPage;
