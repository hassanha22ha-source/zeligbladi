"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

export function CartSidebar() {
    const {
        cart,
        isCartOpen,
        setIsCartOpen,
        removeFromCart,
        updateQuantity,
        totalPrice
    } = useCart();

    const sidebarRef = useRef<HTMLDivElement>(null);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsCartOpen(false);
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [setIsCartOpen]);

    // Prevent body scroll when cart is open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isCartOpen]);

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-earth-950/40 backdrop-blur-sm z-[60]"
                    />

                    {/* Sidebar */}
                    <motion.div
                        ref={sidebarRef}
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col border-l border-earth-100"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-earth-100 flex items-center justify-between bg-white">
                            <div className="flex items-center space-x-3">
                                <ShoppingBag className="text-earth-900" size={20} />
                                <h2 className="text-xl font-serif text-earth-900">Votre Panier</h2>
                                <span className="bg-earth-100 text-earth-900 text-[10px] font-black px-2 py-1 rounded-full">
                                    {cart.reduce((acc, item) => acc + item.quantity, 0)}
                                </span>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 hover:bg-earth-50 rounded-full transition-colors text-earth-500 hover:text-earth-900"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center space-y-4 text-center">
                                    <div className="w-20 h-20 bg-earth-50 rounded-full flex items-center justify-center text-earth-300">
                                        <ShoppingBag size={40} strokeWidth={1} />
                                    </div>
                                    <p className="text-earth-900 font-serif text-lg">Votre panier est vide</p>
                                    <button
                                        onClick={() => setIsCartOpen(false)}
                                        className="text-gold-600 text-xs font-black uppercase tracking-widest hover:text-gold-700 underline underline-offset-4"
                                    >
                                        Continuer vos achats
                                    </button>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <div key={`${item.id}-${item.format_name}`} className="flex space-x-4 animate-in slide-in-from-right-4 duration-500">
                                        <div className="relative w-20 h-20 bg-earth-50 rounded-sm overflow-hidden flex-shrink-0 border border-earth-100">
                                            {item.image_url ? (
                                                <Image
                                                    src={item.image_url}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-earth-300">
                                                    <ShoppingBag size={20} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-serif text-earth-900 line-clamp-1">{item.name}</h3>
                                                <button
                                                    onClick={() => removeFromCart(item.id, item.format_name || '')}
                                                    className="text-earth-300 hover:text-red-500 transition-colors p-1"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gold-600">
                                                {item.format_name || "Format Standard"}
                                            </p>
                                            <div className="flex items-center justify-between pt-2">
                                                <p className="text-sm font-light text-earth-900">
                                                    {item.price * item.quantity} MAD
                                                </p>
                                                <div className="flex items-center space-x-3 bg-earth-50 rounded-full px-2 py-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.format_name || '', item.quantity - 1)}
                                                        className="p-1 hover:text-earth-900 text-earth-500 transition-colors"
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.format_name || '', item.quantity + 1)}
                                                        className="p-1 hover:text-earth-900 text-earth-500 transition-colors"
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cart.length > 0 && (
                            <div className="p-6 border-t border-earth-100 bg-earth-50/50 space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-earth-500 text-sm">
                                        <span>Sous-total</span>
                                        <span>{totalPrice} MAD</span>
                                    </div>
                                    <div className="flex justify-between text-earth-900 font-serif text-xl border-t border-earth-200 pt-2">
                                        <span>Total</span>
                                        <span>{totalPrice} MAD</span>
                                    </div>
                                </div>
                                <Link
                                    href="/commander"
                                    onClick={() => setIsCartOpen(false)}
                                    className="w-full bg-earth-900 text-white py-4 rounded-sm flex items-center justify-center space-x-2 hovered-button group overflow-hidden relative"
                                >
                                    <span className="relative z-10 text-xs font-black uppercase tracking-widest">Commander</span>
                                    <ArrowRight className="relative z-10 transition-transform group-hover:translate-x-1" size={16} />
                                </Link>
                                <p className="text-center text-[10px] text-earth-400 font-light">
                                    Taxes et frais de livraison calculés à l'étape suivante
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
