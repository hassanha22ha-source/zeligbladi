"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) throw signInError;

            router.push("/"); // Redirect to home or dashboard after login
        } catch (err: any) {
            console.error("Login error:", err);
            setError(err.message || "Email ou mot de passe incorrect.");
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
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-earth-300">Bienvenue</span>
                    <h2 className="text-4xl font-serif text-earth-900 leading-tight">Connexion</h2>
                    <p className="text-earth-500 text-sm font-light italic">
                        Accédez à votre espace Zelige Bladi
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-sm text-xs font-bold uppercase tracking-widest text-center animate-shake">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8 space-y-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-earth-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                            <div className="text-right">
                                <Link href="#" className="text-[10px] uppercase tracking-widest text-secondary font-black hover:underline">Oublié ?</Link>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-earth-900 text-white py-5 font-black rounded-sm hover:bg-earth-800 transition-all duration-300 uppercase tracking-[0.3em] text-[10px] glare-effect shadow-xl active:scale-95 flex items-center justify-center disabled:opacity-50"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            "Se Connecter"
                        )}
                    </button>
                </form>

                <div className="text-center text-xs text-earth-400 pt-6 border-t border-earth-50 font-light">
                    Pas encore de compte ?{" "}
                    <Link href="/register" className="text-secondary font-black uppercase tracking-widest hover:underline ml-2">
                        Créer un compte
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
