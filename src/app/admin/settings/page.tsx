"use client";

import { motion } from "framer-motion";
import { Settings as SettingsIcon, Shield, Bell, Palette, Database } from "lucide-react";

export default function AdminSettings() {
    const sections = [
        { name: "Sécurité & Accès", icon: Shield, desc: "Gérer les mots de passe et droits admin" },
        { name: "Notifications", icon: Bell, desc: "Alertes de commandes et emails" },
        { name: "Apparence", icon: Palette, desc: "Personnalisation du dashboard" },
        { name: "Données & Backup", icon: Database, desc: "Maintenance de la base de données" },
    ];

    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-3xl font-serif text-[var(--admin-text)] tracking-tight">Paramètres Système</h1>
                <p className="text-[var(--admin-text-dim)] text-xs font-black uppercase tracking-[0.3em] mt-2 italic">Configuration Globale</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sections.map((section, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-[var(--admin-card)] border border-[var(--admin-border)] p-8 rounded-sm hover:border-gold-500/30 transition-all cursor-pointer group shadow-sm"
                    >
                        <div className="flex items-start justify-between">
                            <div className="space-y-4">
                                <div className="p-3 bg-[var(--admin-border)] rounded-sm group-hover:bg-gold-600/10 transition-colors w-fit text-gold-500">
                                    <section.icon size={24} strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h3 className="text-[var(--admin-text)] text-sm font-bold uppercase tracking-widest">{section.name}</h3>
                                    <p className="text-[var(--admin-text-dim)] text-[10px] mt-2 font-light">{section.desc}</p>
                                </div>
                            </div>
                            <div className="text-gold-500/20 group-hover:text-gold-500 transition-colors">
                                <SettingsIcon size={20} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
