"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Search, FileDown } from "lucide-react";

export default function AdminOrders() {
    return (
        <div className="space-y-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif text-[var(--admin-text)] tracking-tight">Suivi des Commandes</h1>
                    <p className="text-[var(--admin-text-dim)] text-xs font-black uppercase tracking-[0.3em] mt-2 italic">Gestion & Expéditions</p>
                </div>
                <button className="border border-gold-600/30 text-gold-500 px-6 py-4 flex items-center space-x-3 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-gold-600 hover:text-white transition-all active:scale-95">
                    <FileDown size={16} />
                    <span>Exporter (CSV)</span>
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--admin-text-dim)]" size={16} />
                <input
                    type="text"
                    placeholder="Filtrer par numéro de commande ou client..."
                    className="w-full bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-sm py-4 pl-12 pr-4 text-xs text-[var(--admin-text)] focus:border-gold-500 outline-none transition-all shadow-sm"
                />
            </div>

            {/* Orders Table Placeholder */}
            <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-sm overflow-hidden min-h-[400px] flex items-center justify-center shadow-sm">
                <div className="text-center space-y-4 opacity-30">
                    <ShoppingBag size={48} className="mx-auto text-gold-500" strokeWidth={1} />
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--admin-text)]">Aucune commande trouvée</p>
                </div>
            </div>
        </div>
    );
}
