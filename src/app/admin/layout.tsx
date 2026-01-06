"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    Sun,
    Moon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { ThemeProvider, useTheme } from "@/components/admin/ThemeProvider";

function AdminLayoutContent({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAdmin = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.push("/admin-login");
                return;
            }

            const { data: adminData } = await supabase
                .from('admins')
                .select('id')
                .eq('id', session.user.id)
                .single();

            if (!adminData) {
                await supabase.auth.signOut();
                router.push("/admin-login");
            } else {
                setIsLoading(false);
            }
        };

        checkAdmin();
    }, [router]);

    const menuItems = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Catégories", href: "/admin/categories", icon: Package },
        { name: "Formats", href: "/admin/formats", icon: Package },
        { name: "Produits", href: "/admin/produits", icon: Package },
        { name: "Commandes", href: "/admin/commandes", icon: ShoppingBag },
        { name: "Clients", href: "/admin/clients", icon: Users },
        { name: "Utilisateurs", href: "/admin/users", icon: Users },
        { name: "Paramètres", href: "/admin/settings", icon: Settings },
    ];

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/admin-login");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-earth-900 flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--admin-bg)] text-[var(--admin-text)] flex overflow-hidden font-sans transition-colors duration-500">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 bg-[var(--admin-card)] border-r border-[var(--admin-border)] transition-all duration-500 ease-in-out ${isSidebarOpen ? "w-72" : "w-20"
                    }`}
            >
                <div className="h-full flex flex-col">
                    {/* Logo Area */}
                    <div className="h-24 flex items-center px-6 border-b border-[var(--admin-border)]">
                        <div className="w-10 h-10 bg-gold-600 rounded-sm flex-shrink-0 flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg shadow-gold-600/20">
                            T
                        </div>
                        <AnimatePresence>
                            {isSidebarOpen && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="ml-4 overflow-hidden whitespace-nowrap"
                                >
                                    <h1 className="text-sm font-serif font-bold tracking-widest uppercase">Backoffice</h1>
                                    <p className="text-[9px] text-gold-500 font-black tracking-[0.3em] uppercase opacity-50">Zelige Bladi</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Nav Links */}
                    <nav className="flex-1 py-8 px-4 space-y-2">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center p-3 rounded-sm transition-all duration-300 group ${isActive
                                        ? "bg-gold-600 text-white shadow-lg shadow-gold-600/20"
                                        : "text-[var(--admin-text-dim)] hover:bg-[var(--admin-border)] hover:text-[var(--admin-text)]"
                                        }`}
                                >
                                    <Icon size={20} className={isActive ? "text-white" : "group-hover:text-gold-500 transition-colors"} />
                                    <AnimatePresence>
                                        {isSidebarOpen && (
                                            <motion.span
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                className="ml-4 text-[10px] font-black uppercase tracking-widest whitespace-nowrap"
                                            >
                                                {item.name}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom Actions */}
                    <div className="p-4 border-t border-[var(--admin-border)]">
                        <button
                            onClick={handleLogout}
                            className={`w-full flex items-center p-3 rounded-sm transition-all duration-300 group ${theme === 'dark' ? 'text-earth-500 hover:text-red-500 hover:bg-red-500/5' : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                                }`}
                        >
                            <LogOut size={20} />
                            <AnimatePresence>
                                {isSidebarOpen && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="ml-4 text-[10px] font-black uppercase tracking-widest whitespace-nowrap"
                                    >
                                        Déconnexion
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>
                    </div>
                </div>

                {/* Toggle Button */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute -right-3 top-10 w-6 h-6 bg-gold-600 rounded-full flex items-center justify-center text-white border-2 border-[var(--admin-bg)] hover:scale-110 transition-transform hidden lg:flex"
                >
                    {isSidebarOpen ? <X size={12} /> : <Menu size={12} />}
                </button>
            </aside>

            {/* Main Content Area */}
            <main className={`flex-1 flex flex-col transition-all duration-500 ${isSidebarOpen ? "ml-72" : "ml-20"}`}>
                {/* Header */}
                <header className="h-24 bg-[var(--admin-bg)]/80 backdrop-blur-md border-b border-[var(--admin-border)] flex items-center justify-between px-10 sticky top-0 z-40">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-xs font-black uppercase tracking-[0.4em] text-gold-500">
                            {menuItems.find(i => i.href === pathname)?.name || "Dashboard"}
                        </h2>
                    </div>

                    <div className="flex items-center space-x-6">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 hover:bg-[var(--admin-border)] rounded-full transition-colors text-[var(--admin-text-dim)] hover:text-gold-500"
                            title={theme === "dark" ? "Mode Clair" : "Mode Sombre"}
                        >
                            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        <button className="relative text-[var(--admin-text-dim)] hover:text-[var(--admin-text)] transition-colors">
                            <Bell size={18} />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-gold-500 rounded-full border border-[var(--admin-bg)]" />
                        </button>
                        <div className="h-8 w-[1px] bg-[var(--admin-border)]" />
                        <div className="flex items-center space-x-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-black uppercase tracking-widest">Administrateur</p>
                                <p className="text-[8px] text-[var(--admin-text-dim)] uppercase tracking-widest">Zelige Bladi</p>
                            </div>
                            <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-gold-600 to-gold-800 flex items-center justify-center font-bold text-white shadow-xl">
                                AD
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto bg-grid-pattern p-10 custom-scrollbar">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </ThemeProvider>
    );
}
