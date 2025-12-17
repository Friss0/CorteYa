import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Tag, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';

const BusinessSection = () => {

    const fadeInUpVariants = {
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
    };

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left Column: Content */}
                    <div className="space-y-10 order-2 lg:order-1">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={fadeInUpVariants}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold font-heading text-black leading-tight mb-6">
                                Hacé que tu local <br /> brille en Corte Ya
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                                Unite a Corte Ya y accedé a una comunidad de clientes que buscan las mejores barberías. ¡La tuya puede ser una de ellas!
                            </p>
                        </motion.div>

                        {/* Feature List */}
                        <div className="space-y-8">
                            {/* Item 1 */}
                            <motion.div
                                className="flex gap-4 items-start"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={itemVariants}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shrink-0 mt-1">
                                    <Store className="w-6 h-6 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-black mb-2">Registrá tu barbería</h3>
                                    <p className="text-gray-500 leading-relaxed">
                                        Fácil y rápido. ¡Da el primer paso para darle visibilidad a tu negocio!
                                    </p>
                                </div>
                            </motion.div>

                            {/* Item 2 */}
                            <motion.div
                                className="flex gap-4 items-start"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={itemVariants}
                                transition={{ delay: 0.4 }}
                            >
                                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center shrink-0 mt-1">
                                    <Tag className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-black mb-2">Ofrecé promociones exclusivas</h3>
                                    <p className="text-gray-500 leading-relaxed">
                                        Atraé a los usuarios con ofertas irresistibles y mostrá tus mejores cortes.
                                    </p>
                                </div>
                            </motion.div>

                            {/* Item 3 */}
                            <motion.div
                                className="flex gap-4 items-start"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={itemVariants}
                                transition={{ delay: 0.6 }}
                            >
                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-1">
                                    <Users className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-black mb-2">Recibí cientos de clientes</h3>
                                    <p className="text-gray-500 leading-relaxed">
                                        Preparate para dar la bienvenida a una oleada de clientes listos para reservar.
                                    </p>
                                </div>
                            </motion.div>
                        </div>

                        {/* CTA Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.8 }}
                        >
                            <Link to="/registro">
                                <Button
                                    variant="default"
                                    className="bg-black text-white hover:bg-gray-800 px-8 py-4 rounded-xl text-lg font-medium shadow-lg hover:shadow-xl transition-all"
                                >
                                    Unite a Corte Ya
                                </Button>
                            </Link>
                        </motion.div>

                    </div>

                    {/* Right Column: Mockup Card */}
                    <motion.div
                        className="bg-black rounded-[40px] p-8 md:p-12 flex items-center justify-center relative overflow-hidden min-h-[500px] md:min-h-[600px] shadow-2xl order-1 lg:order-2"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={fadeInUpVariants}
                    >
                        {/* Placeholder for Mockup - ANIMATED SEPARATELY WITH DELAY */}
                        {/* Mockup Image - Centered and Floating */}
                        <motion.img
                            src="/assets/images/app-detail-mockup.png"
                            alt="Corte Ya Detail Screen"
                            className="relative z-10 w-full h-auto max-w-[280px] md:max-w-[340px] object-contain drop-shadow-2xl"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                        />
                        {/* Decorative circles */}
                        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-green-500/20 rounded-full translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default BusinessSection;
