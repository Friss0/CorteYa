import React from 'react';
import { motion } from 'framer-motion';
import NavigationBar from '../../components/layout/NavigationBar';
import FooterSection from '../../components/layout/FooterSection';

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

const AboutUsPage = () => {
    return (
        <div className="min-h-screen bg-white">
            <NavigationBar />

            <main className="pt-24 pb-12">
                {/* Hero / Group Description */}
                <motion.section
                    className="container mx-auto px-6 py-12 text-center"
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    <div className="max-w-4xl mx-auto">
                        <motion.h1 variants={item} className="text-4xl md:text-5xl font-bold font-heading text-black mb-6">
                            Sobre Nosotros
                        </motion.h1>
                        <motion.p variants={item} className="text-[18px] text-gray-500 mb-8 leading-relaxed max-w-2xl mx-auto">
                            Somos un grupo de 4 personas entusiastas comprometidas con transformar la experiencia de las barberías.
                            Nuestra app busca conectar a clientes con los mejores profesionales de manera simple, rápida y confiable.
                        </motion.p>
                    </div>
                </motion.section>

                {/* Values Section (Matches Image 0) */}
                <section className="container mx-auto px-6 py-12">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Photo Placeholder */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="rounded-[40px] overflow-hidden shadow-2xl h-[400px] md:h-[500px] bg-gray-100 flex items-center justify-center relative group"
                        >
                            <img
                                src="/assets/images/team-about-us.jpg"
                                alt="Equipo de BarberTurn"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>

                        {/* Values Text */}
                        <motion.div
                            className="space-y-8"
                            variants={container}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: "-100px" }}
                        >
                            <motion.h2 variants={item} className="text-4xl font-bold text-black font-heading mb-8">Nuestros valores</motion.h2>

                            <div className="space-y-6">
                                <motion.div variants={item}>
                                    <h3 className="font-bold text-black text-lg mb-2">Innovación constante</h3>
                                    <p className="text-gray-600">Siempre estamos explorando nuevas maneras de mejorar la experiencia en nuestra app, anticipándonos a las necesidades de nuestros usuarios.</p>
                                </motion.div>

                                <motion.div variants={item}>
                                    <h3 className="font-bold text-black text-lg mb-2">Confianza y transparencia</h3>
                                    <p className="text-gray-600">Construimos relaciones sólidas siendo claros, sinceros y confiables en todo lo que hacemos.</p>
                                </motion.div>

                                <motion.div variants={item}>
                                    <h3 className="font-bold text-black text-lg mb-2">Comunidad y cercanía</h3>
                                    <p className="text-gray-600">Nos enfocamos en crear vínculos cercanos entre usuarios, barberos y nuestro equipo, porque creemos en el poder de las conexiones humanas.</p>
                                </motion.div>

                                <motion.div variants={item}>
                                    <h3 className="font-bold text-black text-lg mb-2">Compromiso con las barberías</h3>
                                    <p className="text-gray-600">Apoyamos activamente el crecimiento y la visibilidad de los locales, siendo aliados estratégicos en su desarrollo comercial.</p>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>
            <FooterSection />
        </div>
    );
};

export default AboutUsPage;
