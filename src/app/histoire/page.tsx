"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function HistoirePage() {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
    };

    return (
        <div className="flex flex-col gap-32 pb-32 grain-effect">
            {/* Header */}
            <section className="bg-earth-100/30 py-32 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                    className="max-w-4xl mx-auto text-center space-y-8"
                >
                    <span className="text-secondary uppercase tracking-[0.4em] text-[10px] font-black">Notre Héritage</span>
                    <h1 className="text-5xl md:text-8xl font-serif text-earth-900 leading-tight">Un Voyage au Cœur <br /> de la Tradition</h1>
                    <div className="w-24 h-[1px] bg-earth-200 mx-auto" />
                    <p className="text-earth-500 text-xl font-light leading-relaxed max-w-3xl mx-auto">
                        Zelige Bladi est née d'une passion pour l'artisanat marocain et le désir de préserver un savoir-faire millénaire.
                        Découvrez l'histoire de la marque qui sublime vos espaces avec l'authenticité de la terre de Fès.
                    </p>
                </motion.div>
            </section>

            {/* Craftsmanship Section */}
            <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-24 items-center">
                <motion.div
                    {...fadeIn}
                    className="relative aspect-square bg-white shadow-2xl rounded-sm overflow-hidden zellige-pattern group"
                >
                    <Image
                        src="/assets/images/savoir-faire.jpg"
                        alt="Artisans à Fès - Le Savoir-Faire"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-earth-900/5 group-hover:bg-transparent transition-colors duration-500" />
                </motion.div>
                <motion.div
                    {...fadeIn}
                    className="space-y-10"
                >
                    <span className="text-secondary uppercase tracking-[0.3em] text-[10px] font-black">L'Art du Geste Précis</span>
                    <h2 className="text-4xl md:text-6xl font-serif text-earth-900 leading-tight">Le Savoir-Faire de Fès</h2>
                    <div className="space-y-6 text-earth-600 text-xl font-light leading-relaxed">
                        <p>
                            Le zellige est bien plus qu'un simple carrelage. C'est le fruit d'une patience infinie et d'un geste précis.
                            À Fès, nos artisans travaillent l'argile grise, unique à la région, pour créer des carreaux qui seront ensuite
                            émaillés puis taillés à la main, pièce par pièce.
                        </p>
                        <p>
                            Chaque imperfection — une nuance de couleur, une petite bulle dans l'émail, une arête légèrement irrégulière —
                            témoigne de l'authenticité du produit et de la main de l'homme.
                        </p>
                    </div>
                </motion.div>
            </section>

            {/* Values Section */}
            <section className="bg-earth-900 text-earth-50 py-32 px-6 relative overflow-hidden">
                <div className="absolute inset-0 zellige-pattern opacity-10" />
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-20 text-center relative z-10">
                    <motion.div {...fadeIn} className="space-y-6">
                        <h3 className="text-3xl font-serif text-white italic">Authenticité</h3>
                        <p className="text-earth-300 text-sm font-light leading-relaxed uppercase tracking-[0.1em]">
                            Nous garantissons un produit 100% fait main à Fès, dans le respect des traditions ancestrales du zellige.
                        </p>
                    </motion.div>
                    <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="space-y-6">
                        <h3 className="text-3xl font-serif text-white italic">Innovation</h3>
                        <p className="text-earth-300 text-sm font-light leading-relaxed uppercase tracking-[0.1em]">
                            Tout en préservant le passé, nous créons des formats et des palettes de couleurs contemporaines.
                        </p>
                    </motion.div>
                    <motion.div {...fadeIn} transition={{ delay: 0.4 }} className="space-y-6">
                        <h3 className="text-3xl font-serif text-white italic">Engagement</h3>
                        <p className="text-earth-300 text-sm font-light leading-relaxed uppercase tracking-[0.1em]">
                            Soutenir nos artisans et promouvoir leur art à l'international est au cœur de notre mission quotidienne.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Final Quote */}
            <section className="max-w-4xl mx-auto px-6 text-center py-20">
                <motion.div {...fadeIn}>
                    <p className="text-3xl md:text-5xl font-serif text-earth-800 leading-relaxed italic tracking-tight">
                        "Le zellige n'est pas un revêtement, <br /> c'est une âme qui habite vos murs et vos sols."
                    </p>
                    <div className="w-16 h-[1px] bg-secondary mx-auto mt-12" />
                </motion.div>
            </section>
        </div>
    );
}
