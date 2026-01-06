"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Eye, EyeOff, ShieldAlert } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // 1. Sign in with Supabase Auth
            const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) throw signInError;

            if (authData.user) {
                // 2. Verify if user exists in the 'admins' table
                const { data: adminData, error: adminError } = await supabase
                    .from('admins')
                    .select('id')
                    .eq('id', authData.user.id)
                    .single();

                if (adminError || !adminData) {
                    // Not an admin, sign them out immediately
                    await supabase.auth.signOut();
                    throw new Error("Accès refusé. Vous n'avez pas de droits administratifs.");
                }

                // Success
                router.push("/admin");
            }
        } catch (err: any) {
            console.error("Admin Login Error:", err);
            setError(err.message || "Identifiants invalides.");
        } finally {
            setIsLoading(false);
        }
    };

    const fadeIn = {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-earth-900 px-6 relative overflow-hidden">
            <div className="absolute inset-0 zellige-pattern opacity-10" />

            <motion.div
                initial="initial"
                animate="animate"
                variants={fadeIn}
                className="w-full max-w-sm space-y-12 bg-white/5 backdrop-blur-3xl p-16 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] rounded-sm border border-white/10 relative z-10"
            >
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gold-600 rounded-full mx-auto flex items-center justify-center text-white font-serif text-2xl shadow-2xl shadow-gold-600/40">
                        T
                    </div>
                    <div className="space-y-1">
                        <span className="text-[9px] font-black uppercase tracking-[0.5em] text-gold-500 block">Backoffice</span>
                        <h2 className="text-2xl font-serif text-white tracking-widest uppercase">Admin</h2>
                    </div>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-sm text-[10px] font-bold uppercase tracking-widest text-center flex items-center justify-center space-x-2"
                    >
                        <ShieldAlert size={14} />
                        <span>{error}</span>
                    </motion.div>
                )}

                <form onSubmit={handleAdminLogin} className="mt-8 space-y-10">
                    <div className="space-y-8">
                        <div className="space-y-3">
                            <label htmlFor="admin-email" className="text-[9px] font-black uppercase tracking-[0.3em] text-gold-500/50">Identifiant (Email)</label>
                            <input
                                type="email"
                                id="admin-email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-0 py-3 bg-transparent border-b border-white/10 focus:border-gold-500 outline-none transition-all rounded-sm font-mono text-xs text-white placeholder-white/20"
                                placeholder="admin@terredezellige.com"
                                required
                            />
                        </div>
                        <div className="space-y-3">
                            <label htmlFor="admin-password" className="text-[9px] font-black uppercase tracking-[0.3em] text-gold-500/50">Mot de passe</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="admin-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-0 py-3 bg-transparent border-b border-white/10 focus:border-gold-500 outline-none transition-all rounded-sm font-mono text-xs text-white placeholder-white/20"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-white/20 hover:text-gold-500 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gold-600 text-white py-5 font-black rounded-sm hover:bg-gold-500 transition-all duration-500 uppercase tracking-[0.4em] text-[9px] shadow-2xl shadow-gold-600/20 glare-effect active:scale-95 flex items-center justify-center"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            "Accéder au Dashboard"
                        )}
                    </button>
                </form>

                <div className="text-center">
                    <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-gold-500 transition-colors duration-500">
                        ← Retour au site
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
