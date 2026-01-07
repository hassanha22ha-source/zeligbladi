"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingBag, Menu, X, User, LogOut } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";
import { ThemeToggle } from "@/components/ThemeToggle";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function Navbar() {
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const { totalItems, setIsCartOpen } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        // Check current session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            subscription.unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsMobileMenuOpen(false);
        router.push("/");
    };

    const navLinks = [
        { name: "Accueil", href: "/" },
        { name: "La Boutique", href: "/boutique" },
        { name: "Nos Formats", href: "/formats" },
        { name: "Notre Histoire", href: "/histoire" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out px-8 py-5",
                isScrolled
                    ? "bg-white/70 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] py-4 border-b border-earth-100/50"
                    : "bg-transparent"
            )}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center group">
                    <Image
                        src="/logo.png"
                        alt="Zelige Bladi"
                        width={200}
                        height={60}
                        className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                        priority
                    />
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-xs font-bold uppercase tracking-[0.2em] text-earth-800 link-underline pb-1 transition-colors hover:text-secondary"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Icons */}
                <div className="flex items-center space-x-6">
                    <Link
                        href="/try-zellige"
                        className="hidden lg:flex items-center px-4 py-2 bg-gold-600 text-white rounded-sm text-[9px] font-black uppercase tracking-[0.2em] hover:bg-gold-700 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                        Simulateur 3D
                    </Link>
                    <ThemeToggle />
                    {user ? (
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/profile"
                                className="text-earth-800 hover:text-secondary transition-all duration-300 flex items-center space-x-2"
                                title="Mon Profil"
                            >
                                <div className="w-8 h-8 rounded-full border border-earth-200 flex items-center justify-center bg-earth-50 group transition-all hover:border-secondary">
                                    <User size={16} strokeWidth={1.5} className="group-hover:text-secondary" />
                                </div>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-earth-400 hover:text-red-500 transition-all duration-300"
                                title="Déconnexion"
                            >
                                <LogOut size={18} strokeWidth={1.5} />
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="hidden lg:flex items-center px-4 py-2 border border-earth-200 rounded-sm text-[9px] font-black uppercase tracking-[0.2em] text-earth-800 hover:bg-earth-900 hover:text-white hover:border-earth-900 transition-all duration-300 glare-effect"
                            >
                                Connexion
                            </Link>
                            <Link href="/login" className="lg:hidden text-earth-800 hover:text-secondary transition-all duration-300 hover:scale-110">
                                <User size={18} strokeWidth={1.5} />
                            </Link>
                        </>
                    )}

                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="text-earth-800 hover:text-secondary transition-all duration-300 relative hover:scale-110 group"
                    >
                        <ShoppingBag size={18} strokeWidth={1.5} />
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-secondary text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm shadow-secondary/50 animate-in zoom-in duration-300">
                                {totalItems}
                            </span>
                        )}
                    </button>
                    <button
                        className="md:hidden text-earth-800 p-1"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-2xl shadow-2xl border-t border-earth-100 p-8 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex flex-col space-y-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-lg font-serif text-earth-900 hover:text-secondary transition-all"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            href="/try-zellige"
                            className="text-lg font-serif text-gold-600 font-bold hover:text-gold-700 transition-all"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Simulateur 3D
                        </Link>
                        <div className="pt-6 border-t border-earth-100 flex flex-col space-y-4">
                            {user ? (
                                <>
                                    <Link
                                        href="/profile"
                                        className="w-full border border-earth-200 text-earth-900 py-4 text-center text-[10px] font-black uppercase tracking-[0.2em] rounded-sm"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Mon Profil
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full bg-earth-100 text-earth-900 py-4 text-center text-[10px] font-black uppercase tracking-[0.2em] rounded-sm"
                                    >
                                        Déconnexion
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    className="w-full bg-earth-900 text-white py-4 text-center text-[10px] font-black uppercase tracking-[0.2em] rounded-sm glare-effect"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Connexion / Inscription
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
