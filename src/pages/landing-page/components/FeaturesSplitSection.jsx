import React from 'react';
import { Download, Compass, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

const FeaturesSplitSection = () => {

    const fadeInUpVariants = {
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
    };

    return (
        <section className="py-24 bg-gray-50 overflow-hidden">
            <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left Column: Mockup Card */}
                    <motion.div
                        className="bg-black rounded-[40px] p-8 md:p-12 flex items-center justify-center relative overflow-hidden min-h-[500px] md:min-h-[600px] shadow-2xl"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={fadeInUpVariants}
                    >
                        {/* Placeholder for Mockup - ANIMATED SEPARATELY WITH DELAY */}
                        {/* Mockup Image - Centered and Floating */}
                        <motion.img
                            src="/assets/images/map-mockup-v3.png"
                            alt="Corte Ya App Map"
                            className="relative z-10 w-full h-auto max-w-[280px] md:max-w-[340px] object-contain drop-shadow-2xl"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                        />

                        {/* Decorative circles */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
                    </motion.div>

                    {/* Right Column: Content */}
                    <div className="space-y-10">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={fadeInUpVariants}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold font-heading text-black leading-tight mb-6">
                                Una nueva forma de <br /> gestionar tus turnos
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                                Corte Ya es tu guía definitiva para encontrar las mejores barberías de tu ciudad, y disfrutar de una experiencia única sin esperas.
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
                                    <Download className="w-6 h-6 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-black mb-2">Descargá Corte Ya en tu celular</h3>
                                    <p className="text-gray-500 leading-relaxed">
                                        Rápido, fácil y gratuito. ¡Descubrí un mundo de opciones en la palma de tu mano!
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
                                    <Compass className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-black mb-2">Explorá y Elegí</h3>
                                    <p className="text-gray-500 leading-relaxed">
                                        Navegá nuestra amplia gama de locales y encontrá el lugar perfecto para tu próximo corte.
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
                                    <Wallet className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-black mb-2">Reservá y Ahorrá</h3>
                                    <p className="text-gray-500 leading-relaxed">
                                        Gestioná tus turnos a través de la app y ahorrá tiempo. Además, ¡sumá puntos para cortes gratis!
                                    </p>
                                </div>
                            </motion.div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default FeaturesSplitSection;
