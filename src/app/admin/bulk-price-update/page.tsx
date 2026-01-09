"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, DollarSign, AlertTriangle, CheckCircle } from "lucide-react";

export default function BulkPriceUpdatePage() {
    const [newPrice, setNewPrice] = useState(289);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleBulkUpdate = async () => {
        if (!confirm(`Êtes-vous sûr de vouloir mettre à jour TOUS les produits à ${newPrice} MAD ?`)) return;

        setIsLoading(true);
        setStatus("loading");
        setMessage("Mise à jour des prix en cours...");

        try {
            const { error, count } = await supabase
                .from('products')
                .update({ price: newPrice })
                .neq('price', newPrice); // Update only if different

            if (error) throw error;

            setStatus("success");
            setMessage(`Succès ! Les prix de tous les produits ont été mis à jour à ${newPrice} MAD.`);
        } catch (err: any) {
            console.error(err);
            setStatus("error");
            setMessage(`Erreur: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-serif text-earth-900">Mise à jour Massive des Prix</h1>
                <p className="text-earth-500">Changer rapidement le prix de tous les produits en une seule opération.</p>
            </div>

            <div className="bg-white border border-earth-100 p-8 rounded-sm shadow-sm space-y-6">
                <div className="flex flex-col space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-earth-400">Nouveau Prix (MAD)</label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-300" size={16} />
                        <input
                            type="number"
                            value={newPrice}
                            onChange={(e) => setNewPrice(Number(e.target.value))}
                            className="w-full bg-earth-50 border border-earth-100 text-earth-900 px-10 py-4 rounded-sm focus:outline-none focus:border-gold-500 transition-all font-bold text-xl"
                        />
                    </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-100 rounded-sm flex items-start space-x-3">
                    <AlertTriangle className="text-amber-600 mt-1" size={20} />
                    <div className="text-xs text-amber-800 leading-relaxed">
                        <p className="font-bold mb-1">Attention</p>
                        <p>Cette action est irréversible. Tous les produits de votre base de données seront mis à jour avec le prix indiqué ci-dessus.</p>
                    </div>
                </div>

                <button
                    onClick={handleBulkUpdate}
                    disabled={isLoading}
                    className="w-full bg-earth-900 text-white py-5 rounded-sm font-black uppercase tracking-[0.2em] text-xs hover:bg-gold-600 transition-all shadow-xl hover:shadow-2xl disabled:opacity-50 flex items-center justify-center space-x-3 active:scale-[0.98]"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />}
                    <span>{isLoading ? "Traitement..." : "Mettre à jour tous les prix"}</span>
                </button>

                {status !== "idle" && (
                    <div className={`p-4 rounded-sm flex items-start space-x-3 animate-in fade-in slide-in-from-top-2 ${status === "success" ? "bg-green-50 border border-green-100 text-green-800" :
                            status === "error" ? "bg-red-50 border border-red-100 text-red-800" :
                                "bg-blue-50 border border-blue-100 text-blue-800"
                        }`}>
                        {status === "success" && <CheckCircle className="mt-0.5" size={16} />}
                        {status === "error" && <AlertTriangle className="mt-0.5" size={16} />}
                        {status === "loading" && <Loader2 className="mt-0.5 animate-spin" size={16} />}
                        <p className="text-sm">{message}</p>
                    </div>
                )}
            </div>

            <div className="text-center pt-8">
                <a href="/admin/produits" className="text-xs font-black uppercase tracking-widest text-earth-400 hover:text-earth-900 transition-colors">
                    Retour à la gestion des produits
                </a>
            </div>
        </div>
    );
}

// Minimal RefreshCw icon replacement if not available in project scope, 
// though lucide-react should have it.
function RefreshCw({ size = 18 }: { size?: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 2v6h-6" /><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M3 22v-6h6" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
        </svg>
    );
}
