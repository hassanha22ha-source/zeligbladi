import Link from "next/link";
import { Instagram, Facebook, Mail, Phone } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-earth-900 text-earth-50 pt-16 pb-8 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                {/* Brand */}
                <div className="space-y-4 col-span-1 md:col-span-1">
                    <h3 className="text-xl font-serif font-bold text-white uppercase tracking-wider">
                        Zelige Bladi
                    </h3>
                    <p className="text-earth-300 text-sm leading-relaxed">
                        Spécialiste du zellige marocain authentique, fabriqué artisanalement à Fès pour sublimer vos intérieurs.
                    </p>
                    <div className="flex space-x-4 pt-2">
                        <a href="#" className="hover:text-secondary transition-colors">
                            <Instagram size={20} />
                        </a>
                        <a href="#" className="hover:text-secondary transition-colors">
                            <Facebook size={20} />
                        </a>
                    </div>
                </div>

                {/* Links */}
                <div>
                    <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">En savoir plus</h4>
                    <ul className="space-y-3 text-sm text-earth-300">
                        <li><Link href="/histoire" className="hover:text-white transition-colors">Notre Histoire</Link></li>
                        <li><Link href="/zellige" className="hover:text-white transition-colors">Le Zellige, c’est quoi ?</Link></li>
                        <li><Link href="/entretien" className="hover:text-white transition-colors">Pose et Entretien</Link></li>
                        <li><Link href="/inspirations" className="hover:text-white transition-colors">Inspirations</Link></li>
                    </ul>
                </div>

                {/* Informations */}
                <div>
                    <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Informations</h4>
                    <ul className="space-y-3 text-sm text-earth-300">
                        <li><Link href="/faq" className="hover:text-white transition-colors">Foire aux Questions</Link></li>
                        <li><Link href="/livraison" className="hover:text-white transition-colors">Livraison</Link></li>
                        <li><Link href="/cgv" className="hover:text-white transition-colors">Conditions Générales</Link></li>
                        <li><Link href="/mentions" className="hover:text-white transition-colors">Mentions Légales</Link></li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Contact</h4>
                    <ul className="space-y-4 text-sm text-earth-300">
                        <li className="flex items-center space-x-3">
                            <Phone size={16} className="text-secondary" />
                            <span>04.90.75.37.48</span>
                        </li>
                        <li className="flex items-center space-x-3">
                            <Mail size={16} className="text-secondary" />
                            <span>contact@terredezellige.com</span>
                        </li>
                        <li className="text-xs leading-relaxed italic">
                            À votre écoute du lundi au vendredi de 9h à 12h et de 12h30 à 17h
                        </li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto border-t border-earth-800 mt-16 pt-8 text-center text-xs text-earth-400">
                <p>Zelige Bladi © 2026. Tous droits réservés.</p>
            </div>
        </footer>
    );
}
