import { Sparkles, Download, ArrowRight, X, Loader2 } from "lucide-react";
import { useZelijGenerator } from "@/hooks/useZelijGenerator";
import { motion, AnimatePresence } from "framer-motion";

interface GenerateButtonProps {
    imageFile: File | null;
    selectedProduct: any | null;
    surface: 'sol' | 'mur';
    onResult: (url: string) => void;
}

export default function GenerateButton({ imageFile, selectedProduct, surface, onResult }: GenerateButtonProps) {
    const { generate, loading, status, error } = useZelijGenerator({ onResult });

    return (
        <div className="space-y-4 w-full">
            <button
                onClick={() => generate(imageFile, selectedProduct, surface)}
                disabled={!imageFile || !selectedProduct || loading}
                className={`
                    relative overflow-hidden w-full py-5 rounded-sm flex items-center justify-center space-x-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all
                    ${(!imageFile || !selectedProduct)
                        ? "bg-earth-50 text-earth-300 cursor-not-allowed"
                        : "bg-earth-900 text-gold-500 hover:text-white hover:bg-gold-600 shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1 active:scale-95"
                    }
                `}
            >
                {loading ? (
                    <div className="flex flex-col items-center space-y-2 py-4">
                        <Loader2 className="animate-spin text-gold-500" size={24} />
                        <span className="text-[9px] animate-pulse">{status || "Magie en cours..."}</span>
                    </div>
                ) : (
                    <>
                        <Sparkles size={18} className="animate-pulse" />
                        <span>Transformer ma pièce par IA</span>
                    </>
                )}
            </button>

            {error && (
                <p className="text-[10px] text-red-500 font-medium text-center animate-pulse">
                    ⚠️ {error}
                </p>
            )}
        </div>
    );
}

export function AperçuResult({ 
    originalImage, 
    generatedImage, 
    productName, 
    productPrice, 
    productSlug,
    onReset 
}: { 
    originalImage: string | null, 
    generatedImage: string, 
    productName: string, 
    productPrice: string | number,
    productSlug?: string,
    onReset: () => void 
}) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-6 animate-in fade-in zoom-in duration-1000"
        >
            <div className="relative rounded-lg overflow-hidden shadow-2xl border border-earth-100 bg-earth-900 group">
                {/* Result Image */}
                <img
                    src={generatedImage}
                    alt={productName}
                    className="w-full h-auto block transition-transform duration-700 group-hover:scale-105"
                />

                {/* Back to original button on hover */}
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                    <button 
                        onClick={onReset}
                        className="bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg text-earth-900 hover:text-red-500 transition-colors"
                        title="Réinitialiser"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Info Bar */}
                <div className="bg-white p-6 flex flex-col md:flex-row justify-between items-center border-t border-earth-100 gap-6">
                    <div className="text-center md:text-left">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gold-600 mb-1">Résultat Personnalisé</p>
                        <p className="font-serif text-2xl text-earth-900">{productName}</p>
                        <p className="text-earth-400 text-xs font-medium">{productPrice} MAD/m² — Artisanat Fessi</p>
                    </div>

                    <div className="flex gap-4">
                        <a 
                            href={generatedImage} 
                            download 
                            className="flex items-center space-x-2 bg-earth-50 text-earth-900 px-6 py-3 rounded-sm hover:bg-earth-100 transition-colors"
                        >
                            <Download size={16} />
                            <span className="text-[9px] font-black uppercase tracking-widest">Télécharger</span>
                        </a>
                        
                        <a 
                            href={`/boutique/${productSlug || ''}`}
                            className="flex items-center space-x-2 bg-gold-600 text-white px-8 py-3 rounded-sm hover:bg-earth-900 transition-all shadow-xl hover:shadow-gold-600/20"
                        >
                            <span className="text-[9px] font-black uppercase tracking-widest">Voir le produit</span>
                            <ArrowRight size={16} />
                        </a>
                    </div>
                </div>
            </div>
            
            <p className="text-center text-[10px] text-earth-400 font-medium">
                * Note: Ce rendu est une simulation générée par IA. Les couleurs réelles peuvent varier légèrement.
            </p>
        </motion.div>
    );
}
