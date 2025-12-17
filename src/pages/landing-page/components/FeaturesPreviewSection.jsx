import React from 'react';
import { Link } from 'react-router-dom';
import { Map, MapPin, Gift, Star, CreditCard, ArrowRight } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { motion } from 'framer-motion';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

const FeaturesPreviewSection = () => {
    return (
        <section className="py-24 bg-gray-50">
            <div className="container mx-auto px-6 max-w-7xl">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
                    <h2 className="text-3xl md:text-4xl font-bold font-heading text-black">
                        Nuestras funcionalidades
                    </h2>
                    {/* Button moved to grid */}
                </div>

                {/* Bento Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >

                    {/* Item 1: Mapa interactivo (Standard Card) */}
                    <motion.div variants={item} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col gap-4 h-full">
                        <div className="bg-yellow-100 w-10 h-10 rounded-xl flex items-center justify-center">
                            <Map className="text-yellow-600 h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-bold text-black">Mapa interactivo</h3>
                        <p className="text-gray-500 leading-relaxed text-sm">
                            Encuentra fácilmente todas las propuestas gastronómicas de tu ciudad.
                        </p>
                    </motion.div>

                    {/* Item 2: Ofertas cercanas (Orange) */}
                    <motion.div variants={item} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col gap-4 h-full">
                        <div className="bg-orange-100 w-10 h-10 rounded-xl flex items-center justify-center">
                            <MapPin className="text-orange-600 h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-bold text-black">Ofertas cercanas</h3>
                        <p className="text-gray-500 leading-relaxed text-sm">
                            Explora todas las ofertas cercanas y encuentra la mejor opción.
                        </p>
                    </motion.div>

                    {/* Item 3: Premios (Purple) */}
                    <motion.div variants={item} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col gap-4 h-full">
                        <div className="bg-purple-100 w-10 h-10 rounded-xl flex items-center justify-center">
                            <Gift className="text-purple-600 h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-bold text-black">Premios</h3>
                        <p className="text-gray-500 leading-relaxed text-sm">
                            Acumula puntos en cada salida y obtén comida gratis!
                        </p>
                    </motion.div>

                    {/* Item 4: Reseñas (Blue) */}
                    <motion.div variants={item} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col gap-4 h-full">
                        <div className="bg-blue-100 w-10 h-10 rounded-xl flex items-center justify-center">
                            <Star className="text-blue-600 h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-bold text-black">Reseñas</h3>
                        <p className="text-gray-500 leading-relaxed text-sm">
                            Comparte tu experiencia y forma parte de la comunidad foodie.
                        </p>
                    </motion.div>

                    {/* Item 5: Compras seguras (Green) */}
                    <motion.div variants={item} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col gap-4 h-full">
                        <div className="bg-green-100 w-10 h-10 rounded-xl flex items-center justify-center">
                            <CreditCard className="text-green-600 h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-bold text-black">Compras seguras</h3>
                        <p className="text-gray-500 leading-relaxed text-sm">
                            Elige el método de pago que más te convenga con seguridad.
                        </p>
                    </motion.div>

                    {/* Item 6: Explorar más (Button Card) */}
                    <motion.div variants={item} className="h-full">
                        <Link to="/funcionalidades" className="h-full">
                            <div className="h-full min-h-[200px] bg-black rounded-[2rem] p-6 shadow-lg shadow-gray-200 hover:shadow-xl hover:bg-gray-900 transition-all flex flex-col justify-between items-start group cursor-pointer relative overflow-hidden">
                                <div className="z-10 bg-white/10 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
                                    <ArrowRight className="text-white h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </div>
                                <div className="space-y-2 z-10">
                                    <h3 className="text-2xl font-bold text-white">Explorar más</h3>
                                    <p className="text-gray-400 text-sm">Descubre todo lo que puedes hacer.</p>
                                </div>
                                {/* Decorative circle */}
                                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors"></div>
                            </div>
                        </Link>
                    </motion.div>

                </motion.div>
            </div>
        </section>
    );
};

export default FeaturesPreviewSection;
