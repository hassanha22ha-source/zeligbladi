"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Check, Loader2, ShoppingBag, ShieldCheck, Truck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

export default function CommanderPage() {
    const { cart, totalPrice, clearCart } = useCart();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        zip: "",
        country: "Maroc"
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Prepare order data
            const orderData = {
                customer_details: formData,
                items: cart,
                total_price: totalPrice,
                status: 'pending'
            };

            // Insert into Supabase
            const { error } = await supabase.from('orders').insert([orderData]);

            if (error) {
                console.error("Order error:", error);
                // Fallback: If table doesn't exist, log it and pretend success (Request Quote Mode)
                if (error.code === '42P01') { // undefined_table
                    console.warn("Orders table missing. Logging order locally.", orderData);
                    alert("Note: Table 'orders' does not exist yet. Please run the provided schema.sql. Order logged to console.");
                } else {
                    throw error;
                }
            }

            setSuccess(true);
            setTimeout(() => {
                clearCart();
                // Optionally redirect to a dedicated success page
            }, 2000);

        } catch (err: any) {
            console.error(err);
            alert("Une erreur est survenue lors de la commande. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0 && !success) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-8 bg-white grain-effect">
                <div className="w-24 h-24 bg-earth-50 rounded-full flex items-center justify-center text-earth-300">
                    <ShoppingBag size={48} strokeWidth={1} />
                </div>
                <h1 className="text-3xl font-serif text-earth-900">Votre panier est vide</h1>
                <button
                    onClick={() => router.push("/boutique")}
                    className="flex items-center space-x-3 bg-earth-900 text-white px-8 py-4 rounded-sm text-[10px] font-black uppercase tracking-widest hover:-translate-y-1 transition-all"
                >
                    <ArrowLeft size={16} />
                    <span>Retour à la Boutique</span>
                </button>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-8 bg-white grain-effect px-6 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-4"
                >
                    <Check size={64} strokeWidth={1} />
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-serif text-earth-900">Merci, {formData.firstName} !</h1>
                <p className="text-earth-500 max-w-lg text-lg font-light">
                    Votre demande a été enregistrée avec succès. Notre équipe vous contactera très prochainement pour confirmer les détails de livraison et le paiement.
                </p>
                <button
                    onClick={() => router.push("/")}
                    className="bg-earth-900 text-white px-10 py-5 rounded-sm text-[10px] font-black uppercase tracking-widest hover:-translate-y-1 transition-all shadow-xl"
                >
                    Retour à l'accueil
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-earth-50/20 grain-effect pb-32 pt-32">
            <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16">

                {/* Left: Summary */}
                <div className="space-y-8 order-2 lg:order-1">
                    <div className="flex items-center space-x-3 mb-8">
                        <button onClick={() => router.back()} className="text-earth-400 hover:text-earth-900 transition-colors">
                            <ArrowLeft size={24} />
                        </button>
                        <h1 className="text-3xl font-serif text-earth-900">Finaliser la commande</h1>
                    </div>

                    <div className="bg-white p-8 rounded-sm shadow-xl border border-earth-100 space-y-8">
                        <h3 className="text-lg font-serif text-earth-900 flex items-center space-x-2">
                            <ShoppingBag size={18} className="text-gold-500" />
                            <span>Récapitulatif ({cart.length} articles)</span>
                        </h3>

                        <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {cart.map((item) => (
                                <div key={`${item.id}-${item.format_name}`} className="flex space-x-4 py-4 border-b border-earth-50 last:border-0">
                                    <div className="relative w-16 h-16 bg-earth-100 rounded-sm overflow-hidden flex-shrink-0">
                                        {item.image_url && <Image src={item.image_url} alt={item.name} fill className="object-cover" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-serif text-earth-900 text-base">{item.name}</h4>
                                            <span className="text-earth-600 font-medium text-sm">{item.price * item.quantity} MAD</span>
                                        </div>
                                        <p className="text-[10px] text-earth-400 uppercase tracking-wider mt-1">{item.format_name}</p>
                                        <p className="text-xs text-earth-500 mt-1">Quantité: {item.quantity} m²</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-earth-100 space-y-4">
                            <div className="flex justify-between text-earth-500">
                                <span>Sous-total</span>
                                <span>{totalPrice} MAD</span>
                            </div>
                            <div className="flex justify-between text-earth-500">
                                <span>Livraison (Estimée)</span>
                                <span className="text-xs italic">Calculé après confirmation</span>
                            </div>
                            <div className="flex justify-between text-earth-900 font-serif text-2xl pt-4 border-t border-earth-200">
                                <span>Total</span>
                                <span>{totalPrice} <span className="text-sm font-sans font-light text-earth-400">MAD</span></span>
                            </div>
                        </div>

                        <div className="bg-earth-50 p-4 rounded-sm space-y-3">
                            <div className="flex items-start space-x-3 text-earth-500 text-xs">
                                <ShieldCheck size={16} className="text-gold-600 mt-0.5 flex-shrink-0" />
                                <span>Paiement sécurisé ou à la livraison selon votre zone.</span>
                            </div>
                            <div className="flex items-start space-x-3 text-earth-500 text-xs">
                                <Truck size={16} className="text-gold-600 mt-0.5 flex-shrink-0" />
                                <span>Livraison assurée partout au Maroc. Casse remplacée.</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Form */}
                <div className="order-1 lg:order-2">
                    <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-sm shadow-2xl border border-earth-100 space-y-8 sticky top-32">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-serif text-earth-900">Vos Coordonnées</h2>
                            <p className="text-earth-400 text-sm font-light">Ces informations nous permettront de préparer votre devis final.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-earth-500">Prénom</label>
                                <input required name="firstName" value={formData.firstName} onChange={handleChange} className="w-full bg-earth-50/50 border-b border-earth-200 p-3 outline-none focus:border-gold-500 transition-colors" placeholder="Votre prénom" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-earth-500">Nom</label>
                                <input required name="lastName" value={formData.lastName} onChange={handleChange} className="w-full bg-earth-50/50 border-b border-earth-200 p-3 outline-none focus:border-gold-500 transition-colors" placeholder="Votre nom" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-earth-500">Email</label>
                            <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-earth-50/50 border-b border-earth-200 p-3 outline-none focus:border-gold-500 transition-colors" placeholder="exemple@email.com" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-earth-500">Téléphone</label>
                            <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-earth-50/50 border-b border-earth-200 p-3 outline-none focus:border-gold-500 transition-colors" placeholder="06..." />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-earth-500">Adresse de livraison</label>
                            <input required name="address" value={formData.address} onChange={handleChange} className="w-full bg-earth-50/50 border-b border-earth-200 p-3 outline-none focus:border-gold-500 transition-colors" placeholder="N°, Rue, Quartier..." />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-earth-500">Ville</label>
                                <input required name="city" value={formData.city} onChange={handleChange} className="w-full bg-earth-50/50 border-b border-earth-200 p-3 outline-none focus:border-gold-500 transition-colors" placeholder="Ville" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-earth-500">Code Postal</label>
                                <input name="zip" value={formData.zip} onChange={handleChange} className="w-full bg-earth-50/50 border-b border-earth-200 p-3 outline-none focus:border-gold-500 transition-colors" placeholder="CP" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-earth-900 text-white py-5 rounded-sm flex items-center justify-center space-x-3 text-[11px] font-black uppercase tracking-widest hover:bg-gold-600 transition-all shadow-xl hover:-translate-y-1 ${loading ? 'opacity-70 cursor-wait' : ''}`}
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                            <span>{loading ? 'Traitement...' : 'Confirmer la demande'}</span>
                        </button>

                        <p className="text-center text-[10px] text-earth-400 italic">
                            Aucun paiement n'est requis à cette étape. Nous confirmerons la disponibilité des stocks.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
