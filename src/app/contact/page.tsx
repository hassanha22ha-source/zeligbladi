"use client";

import { motion } from "framer-motion";

export default function ContactPage() {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-32 flex flex-col gap-32 grain-effect">
            <motion.header
                initial="initial"
                animate="animate"
                variants={fadeIn}
                className="text-center space-y-6"
            >
                <span className="text-secondary uppercase tracking-[0.4em] text-[10px] font-black">À Votre Écoute</span>
                <h1 className="text-5xl md:text-8xl font-serif text-earth-900 leading-tight">Contactez-nous</h1>
                <p className="text-earth-500 max-w-2xl mx-auto text-xl font-light leading-relaxed">
                    Vous avez un projet ou une question ? Notre équipe est à votre écoute pour vous accompagner dans votre sélection de zelliges.
                </p>
                <div className="w-24 h-[1px] bg-earth-200 mx-auto" />
            </motion.header>

            <div className="grid md:grid-cols-2 gap-32">
                {/* Contact Info */}
                <motion.div
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="space-y-16"
                >
                    <div className="space-y-6">
                        <h3 className="text-3xl font-serif text-earth-900 italic">Nos Coordonnées</h3>
                        <div className="space-y-6 text-earth-600 text-xl font-light">
                            <div className="flex items-center gap-4 group">
                                <span className="w-10 h-10 flex items-center justify-center bg-earth-50 text-secondary rounded-full group-hover:bg-secondary group-hover:text-white transition-colors duration-500">📍</span>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-earth-400">Adresse</p>
                                    <p>123 Rue de l'Artisanat, Fès, Maroc</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <span className="w-10 h-10 flex items-center justify-center bg-earth-50 text-secondary rounded-full group-hover:bg-secondary group-hover:text-white transition-colors duration-500">📞</span>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-earth-400">Téléphone</p>
                                    <p className="hover:text-secondary transition-colors">04.90.75.37.48</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <span className="w-10 h-10 flex items-center justify-center bg-earth-50 text-secondary rounded-full group-hover:bg-secondary group-hover:text-white transition-colors duration-500">✉️</span>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-earth-400">Email</p>
                                    <p className="hover:text-secondary transition-colors">contact@terredezellige.com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-3xl font-serif text-earth-900 italic">Horaires</h3>
                        <p className="text-earth-600 text-lg font-light">
                            Du lundi au vendredi : 09h00 – 12h00 / 12h30 – 17h00
                        </p>
                    </div>

                    <div className="p-10 bg-white shadow-2xl border border-earth-100 rounded-sm relative overflow-hidden group">
                        <div className="absolute inset-0 zellige-pattern opacity-10 group-hover:scale-110 transition-transform duration-1000" />
                        <h4 className="font-serif text-2xl mb-4 text-earth-900 relative z-10">Demande d'échantillons</h4>
                        <p className="text-earth-500 text-base leading-relaxed font-light relative z-10 italic">
                            Il est crucial de voir les variations de teintes en personne. Contactez-nous pour commander des échantillons physiques avant votre pose finale.
                        </p>
                    </div>
                </motion.div>

                {/* Contact Form */}
                <motion.form
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                    className="space-y-10 bg-white p-12 shadow-2xl rounded-sm border border-earth-50 relative"
                >
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.2em] text-earth-700">Nom Complet</label>
                            <input type="text" id="name" className="w-full px-0 py-3 bg-transparent border-b border-earth-200 focus:border-secondary transition-all outline-none font-light text-lg" placeholder="Votre nom" required />
                        </div>
                        <div className="space-y-3">
                            <label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-earth-700">Email</label>
                            <input type="email" id="email" className="w-full px-0 py-3 bg-transparent border-b border-earth-200 focus:border-secondary transition-all outline-none font-light text-lg" placeholder="Votre email" required />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label htmlFor="subject" className="text-[10px] font-black uppercase tracking-[0.2em] text-earth-700">Sujet du Message</label>
                        <input type="text" id="subject" className="w-full px-0 py-3 bg-transparent border-b border-earth-200 focus:border-secondary transition-all outline-none font-light text-lg" placeholder="L'objet de votre projet" />
                    </div>
                    <div className="space-y-3">
                        <label htmlFor="message" className="text-[10px] font-black uppercase tracking-[0.2em] text-earth-700">Votre Message</label>
                        <textarea id="message" rows={5} className="w-full px-0 py-3 bg-transparent border-b border-earth-200 focus:border-secondary transition-all outline-none resize-none font-light text-lg" placeholder="Dites-nous tout..." required></textarea>
                    </div>
                    <button type="submit" className="w-full bg-earth-900 text-white py-6 font-black rounded-sm hover:bg-earth-800 transition-all duration-300 uppercase tracking-[0.3em] text-[10px] shadow-xl glare-effect active:scale-95">
                        Envoyer le Message
                    </button>

                    <div className="absolute -bottom-1 -right-1 w-12 h-12 zellige-pattern opacity-20" />
                </motion.form>
            </div>
        </div>
    );
}
