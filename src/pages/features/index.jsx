import React from 'react';
import { Search, Map, CreditCard, Wallet, Star, Gift } from 'lucide-react';
import { motion } from 'framer-motion';
import NavigationBar from '../../components/layout/NavigationBar';
import FooterSection from '../../components/layout/FooterSection';
import Button from '../../components/ui/Button';

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
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const FeaturesPage = () => {
    const features = [
        { icon: Search, title: "Búsqueda Inteligente", desc: "Encuentra fácilmente tus barberías favoritas con nuestra búsqueda avanzada." },
        { icon: Map, title: "Mapa Interactivo", desc: "Descubre los mejores lugares con nuestro mapa interactivo y filtros personalizables." },
        { icon: CreditCard, title: "Pagos seguros", desc: "Paga con débito, crédito o Mercado Pago de forma rápida y segura." },
        { icon: Wallet, title: "Ahorra en cada reserva", desc: "Controla cuánto ahorras en cada reserva que realizas con CorteYa." },
        { icon: Star, title: "Reseñas verificadas", desc: "Deja tu reseña y ayuda a otros usuarios a elegir dónde cortarse." },
        { icon: Gift, title: "Gana Recompensas", desc: "Acumula puntos y gana cortes gratis con cada reserva." }
    ];

    return (
        <div className="min-h-screen bg-white">
            <NavigationBar />

            <main className="pt-24 pb-12">
                {/* Hero Section */}
                <motion.section
                    className="container mx-auto px-6 py-16 text-center"
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    <motion.h1 variants={item} className="text-4xl md:text-5xl font-bold font-heading text-black mb-4 leading-tight">
                        Descubre las <br className="md:hidden" /> funcionalidades de <span className="text-[#3ea02c]">Corte Ya</span>
                    </motion.h1>
                    <motion.p variants={item} className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
                        La app más completa para encontrar tu próximo mejor corte.
                    </motion.p>
                    <motion.div variants={item} className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button className="bg-black text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 ml-1"><path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1527-.5676.416.416 0 00-.5676.1527l-2.0225 3.503c-1.4258-.6507-3.006-1.0267-4.7218-1.09l-.0273-.0004H11.603c-1.7456.0642-3.351.4483-4.7963 1.1119l-2.043-3.5249a.4158.4158 0 00-.5906-.1314.4156.4156 0 00-.1314.5906l2.0163 3.4796C2.651 11.2343.4334 14.2882.0294 17.8817h23.9412c-.404-3.5936-2.6217-6.6475-6.0232-9.5603" /></svg>
                            <span>Google Play</span>
                        </Button>
                        <Button className="bg-black text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 mb-1"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.78 1.18-.19 2.31-.89 3.51-.84 1.54.06 2.68.79 3.22 1.78-3.21 1.76-2.43 6.07.6 7.42-.35 1.4-1.12 3-2.41 3.83zm-1.85-15.4c.56-1.37 2.22-2.31 3.51-2.29.13 1.54-1.28 3.42-3.15 3.39-.24-1.29 0-1.29-.36-1.1z" /></svg>
                            <span>App Store</span>
                        </Button>
                    </motion.div>
                </motion.section>

                {/* Feature Section (Cards/Black Background) */}
                <motion.section
                    className="container max-w-6xl mx-auto px-6 pb-12"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="bg-black rounded-[40px] overflow-hidden text-white shadow-2xl relative">
                        <div className="grid md:grid-cols-2 gap-8 items-stretch p-6 md:p-10 lg:p-12 pb-0 md:pb-0">

                            <div className="flex flex-col justify-center space-y-6 text-left z-10 max-w-xl pb-12 md:pb-16">
                                <motion.h2
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                    className="text-3xl md:text-5xl font-bold font-heading leading-tight"
                                >
                                    Reservá de manera <br /> segura, rápida y <br /> a precios únicos
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 }}
                                    className="text-gray-300 text-lg leading-relaxed"
                                >
                                    No te preocupes más por dónde ir a cortarte o cómo pagar.
                                    Gestioná tus turnos desde un solo lugar con la mejor experiencia.
                                </motion.p>
                            </div>

                            {/* Phone Mockup Placeholder -- Aligned to bottom */}
                            <div className="flex flex-col justify-end h-full relative z-10">
                                <div className="flex justify-center md:justify-end translate-y-12 md:translate-y-20">
                                    <motion.div
                                        initial={{ opacity: 0, y: -50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.4, duration: 0.8 }}
                                        className="relative"
                                    >
                                        <motion.img
                                            src="/assets/images/features-mockup.png"
                                            alt="Funcionalidades Corte Ya"
                                            className="relative z-10 w-full h-auto max-w-[340px] object-contain drop-shadow-2xl"
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                        {/* Circle Background Element for Mockup */}
                                        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-[#3ea02c] rounded-full blur-[70px] opacity-20 -translate-x-1/2 -translate-y-1/2 -z-10"></div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative blob */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-[#3ea02c]/20 to-transparent blur-3xl rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
                    </div>
                </motion.section>

                {/* Grid Section */}
                <section className="container mx-auto px-6 py-24">
                    <motion.div
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                    >
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                variants={item}
                                className="bg-gray-50 p-8 rounded-3xl hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100 group"
                            >
                                <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm mb-6 text-black group-hover:scale-110 transition-transform">
                                    <feature.icon className="h-7 w-7 text-[#3ea02c]" />
                                </div>
                                <h3 className="font-bold text-xl mb-3 text-black">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>

            </main>

            <FooterSection />
        </div>
    );
};

export default FeaturesPage;
