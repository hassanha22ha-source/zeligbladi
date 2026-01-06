"use client";

import { motion } from "framer-motion";
import { Users, Mail, UserPlus } from "lucide-react";

export default function AdminClients() {
    return (
        <div className="space-y-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif text-[var(--admin-text)] tracking-tight">Base de Données Clients</h1>
                    <p className="text-[var(--admin-text-dim)] text-xs font-black uppercase tracking-[0.3em] mt-2 italic">Gestion de la Relation Client</p>
                </div>
                <button className="bg-white/5 text-white px-6 py-4 flex items-center space-x-3 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95 border border-white/5">
                    <Mail size={16} className="text-gold-500" />
                    <span>Envoyer une Newsletter</span>
                </button>
            </div>

            {/* Clients Table Placeholder */}
            <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-sm overflow-hidden min-h-[400px] flex items-center justify-center shadow-sm">
                <div className="text-center space-y-4 opacity-30">
                    <Users size={48} className="mx-auto text-gold-500" strokeWidth={1} />
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--admin-text)]">0 client enregistré</p>
                </div>
            </div>
        </div>
    );
}
