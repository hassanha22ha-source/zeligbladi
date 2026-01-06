"use client";

import { motion } from "framer-motion";
import {
    TrendingUp,
    ShoppingBag,
    Users,
    Package,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    CreditCard
} from "lucide-react";

export default function AdminDashboard() {
    const stats = [
        {
            name: "Ventes Totales",
            value: "128,450.00 MAD",
            change: "+12.5%",
            trending: "up",
            icon: CreditCard,
            color: "gold"
        },
        {
            name: "Commandes",
            value: "142",
            change: "+8.2%",
            trending: "up",
            icon: ShoppingBag,
            color: "blue"
        },
        {
            name: "Nouveaux Clients",
            value: "45",
            change: "-2.4%",
            trending: "down",
            icon: Users,
            color: "purple"
        },
        {
            name: "Produits Actifs",
            value: "86",
            change: "+4",
            trending: "up",
            icon: Package,
            color: "green"
        }
    ];

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
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-12 transition-colors duration-500">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-serif text-[var(--admin-text)] tracking-tight">Vue d'ensemble</h1>
                <p className="text-[var(--admin-text-dim)] text-xs font-black uppercase tracking-[0.3em] mt-2 italic">Statistiques & Activités</p>
            </div>

            {/* Stats Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        variants={item}
                        className="bg-[var(--admin-card)] border border-[var(--admin-border)] p-6 rounded-sm relative group hover:border-gold-500/30 transition-all duration-500 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div className="p-3 bg-[var(--admin-border)] rounded-sm group-hover:bg-gold-600/10 transition-colors">
                                <stat.icon size={20} className="text-gold-500" />
                            </div>
                            <div className={`flex items-center space-x-1 text-[10px] font-black ${stat.trending === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                                <span>{stat.change}</span>
                                {stat.trending === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                            </div>
                        </div>
                        <div className="mt-6">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--admin-text-dim)]">{stat.name}</p>
                            <h3 className="text-xl font-bold text-[var(--admin-text)] mt-1">{stat.value}</h3>
                        </div>
                        <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-gold-600 group-hover:w-full transition-all duration-700" />
                    </motion.div>
                ))}
            </motion.div>

            {/* Dashboard Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Recent Orders Table */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[var(--admin-text)]">Commandes Récentes</h3>
                        <button className="text-[9px] font-black text-gold-500 uppercase tracking-widest hover:underline">Voir tout</button>
                    </div>
                    <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-sm overflow-hidden shadow-sm">
                        <table className="w-full text-left">
                            <thead className="bg-[var(--admin-border)] border-b border-[var(--admin-border)]">
                                <tr>
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-[var(--admin-text-dim)]">ID</th>
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-[var(--admin-text-dim)]">Client</th>
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-[var(--admin-text-dim)]">Statut</th>
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-[var(--admin-text-dim)] text-right">Montant</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--admin-border)] text-[11px] font-light text-[var(--admin-text)]">
                                {[1, 2, 3, 4, 5].map((order) => (
                                    <tr key={order} className="hover:bg-[var(--admin-border)] transition-colors group">
                                        <td className="px-6 py-4 font-mono text-gold-500/70">#ORD-2024-{order}</td>
                                        <td className="px-6 py-4">Client {order}</td>
                                        <td className="px-6 py-4 text-xs">
                                            <span className="px-2 py-1 rounded-full bg-gold-600/10 text-gold-500 text-[8px] font-black uppercase tracking-widest">En cours</span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium">450.00 MAD</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Panel: Performance Graph Placeholder */}
                <div className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[var(--admin-text)]">Performance</h3>
                    <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] p-8 rounded-sm aspect-square flex flex-col items-center justify-center text-center space-y-4 shadow-sm">
                        <div className="w-20 h-20 bg-[var(--admin-border)] rounded-full flex items-center justify-center relative">
                            <Activity size={32} className="text-gold-500 animate-pulse" />
                            <div className="absolute inset-0 border-4 border-gold-600 border-t-transparent rounded-full animate-spin duration-[3s]" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--admin-text)]">Flux d'activité</p>
                            <p className="text-[9px] text-[var(--admin-text-dim)] mt-2 leading-relaxed">Le backoffice est prêt pour la gestion en temps réel.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
