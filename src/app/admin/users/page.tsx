"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Search, Mail, Phone, Calendar, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface UserProfile {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    telephone: string;
    created_at: string;
}

export default function AdminUsers() {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (err) {
            console.error("Error fetching users:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        `${user.first_name} ${user.last_name} ${user.email} ${user.telephone}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-12 transition-colors duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif text-[var(--admin-text)] tracking-tight">Liste des Utilisateurs</h1>
                    <p className="text-[var(--admin-text-dim)] text-xs font-black uppercase tracking-[0.3em] mt-2 italic">Comptes enregistrés sur la plateforme</p>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gold-500 bg-gold-600/10 px-3 py-1 rounded-full">
                        {users.length} Total
                    </span>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--admin-text-dim)]" size={16} />
                <input
                    type="text"
                    placeholder="Rechercher par nom, email ou téléphone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-sm py-4 pl-12 pr-4 text-xs text-[var(--admin-text)] focus:border-gold-500 outline-none transition-all"
                />
            </div>

            {/* Users Table */}
            <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-sm overflow-hidden shadow-sm">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-20 space-y-4">
                        <Loader2 className="w-8 h-8 text-gold-500 animate-spin" strokeWidth={1.5} />
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--admin-text-dim)]">Chargement des utilisateurs...</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="text-center p-20 space-y-4 opacity-30">
                        <Users size={48} className="mx-auto text-gold-500" strokeWidth={1} />
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--admin-text)]">Aucun utilisateur enregistré</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[var(--admin-border)] border-b border-[var(--admin-border)]">
                                <tr>
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-[var(--admin-text-dim)]">Nom Complet</th>
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-[var(--admin-text-dim)]">Contact</th>
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-[var(--admin-text-dim)]">Inscrit le</th>
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-[var(--admin-text-dim)] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--admin-border)] text-[11px] font-light text-[var(--admin-text)]">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-[var(--admin-border)] transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-full bg-gold-600/10 flex items-center justify-center text-gold-500 font-bold border border-gold-600/20 uppercase">
                                                    {user.first_name?.[0]}{user.last_name?.[0]}
                                                </div>
                                                <div>
                                                    <p className="font-bold uppercase tracking-wider">{user.first_name} {user.last_name}</p>
                                                    <p className="text-[9px] text-[var(--admin-text-dim)] font-mono truncate max-w-[150px]">{user.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 space-y-1">
                                            <div className="flex items-center space-x-2">
                                                <Mail size={12} className="text-gold-500/50" />
                                                <span>{user.email}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Phone size={12} className="text-gold-500/50" />
                                                <span>{user.telephone || "N/A"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center space-x-2">
                                                <Calendar size={12} className="text-gold-500/50" />
                                                <span>{new Date(user.created_at).toLocaleDateString('fr-FR')}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button className="text-[9px] font-black text-gold-500 uppercase tracking-widest hover:underline px-3 py-1 bg-gold-600/5 rounded-sm transition-all hover:bg-gold-600/10">
                                                Voir Profil
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
