"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        telephone: "",
        email: "",
        password: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id === 'first-name' ? 'firstName' : id === 'last-name' ? 'lastName' : id]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // 1. Sign up user with Supabase Auth + Metadata
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                        telephone: formData.telephone,
                    }
                }
            });

            if (authError) throw authError;

            if (authData.user) {
                // Profile is now handled by the database trigger!
                setSuccess(true);
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            }
        } catch (err: any) {
            console.error("Registration error:", err);
            setError(err.message || "Une erreur est survenue lors de l'inscription.");
        } finally {
            setIsLoading(false);
        }
    };

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center px-6 py-20 grain-effect">
            <motion.div
                initial="initial"
                animate="animate"
                variants={fadeIn}
                className="w-full max-w-md space-y-10 bg-white p-12 shadow-2xl rounded-sm border border-earth-100 relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent opacity-50" />

                <div className="text-center space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-earth-300">Rejoignez-nous</span>
                    <h2 className="text-4xl font-serif text-earth-900 leading-tight">Inscription</h2>
                    <p className="text-earth-500 text-sm font-light italic">
                        Créez votre compte Zelige Bladi
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-sm text-xs font-bold uppercase tracking-widest text-center animate-shake">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border border-green-100 text-green-600 px-4 py-3 rounded-sm text-xs font-bold uppercase tracking-widest text-center animate-fade-in">
                        Compte créé avec succès !
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8 space-y-8">
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label htmlFor="first-name" className="text-[10px] font-black uppercase tracking-[0.2em] text-earth-700">Prénom</label>
                                <input
                                    type="text"
                                    id="first-name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full px-0 py-3 bg-transparent border-b border-earth-100 focus:border-secondary transition-all outline-none font-light text-lg text-earth-900"
                                    placeholder="Jane"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="last-name" className="text-[10px] font-black uppercase tracking-[0.2em] text-earth-700">Nom</label>
                                <input
                                    type="text"
                                    id="last-name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full px-0 py-3 bg-transparent border-b border-earth-100 focus:border-secondary transition-all outline-none font-light text-lg text-earth-900"
                                    placeholder="Doe"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="telephone" className="text-[10px] font-black uppercase tracking-[0.2em] text-earth-700">Téléphone</label>
                            <input
                                type="tel"
                                id="telephone"
                                value={formData.telephone}
                                onChange={handleChange}
                                className="w-full px-0 py-3 bg-transparent border-b border-earth-100 focus:border-secondary transition-all outline-none font-light text-lg text-earth-900"
                                placeholder="0612345678"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-earth-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-0 py-3 bg-transparent border-b border-earth-100 focus:border-secondary transition-all outline-none font-light text-lg text-earth-900"
                                placeholder="votre@email.com"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-earth-700">Mot de passe</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-0 py-3 bg-transparent border-b border-earth-100 focus:border-secondary transition-all outline-none font-light text-lg text-earth-900"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-earth-400 hover:text-secondary transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || success}
                        className="w-full bg-earth-900 text-white py-5 font-black rounded-sm hover:bg-earth-800 transition-all duration-300 uppercase tracking-[0.3em] text-[10px] glare-effect shadow-xl active:scale-95 flex items-center justify-center disabled:opacity-50"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            "Créer mon compte"
                        )}
                    </button>
                </form>

                <div className="text-center text-xs text-earth-400 pt-6 border-t border-earth-50 font-light">
                    Déjà un compte ?{" "}
                    <Link href="/login" className="text-secondary font-black uppercase tracking-widest hover:underline ml-2">
                        Se connecter
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
