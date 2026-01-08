"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    ShoppingBag,
    Check,
    Loader2,
    Info,
    Package,
    ShieldCheck,
    Truck,
    ArrowRight
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    stock_status: string;
    is_featured: boolean;
    format_id: string;
    formats?: {
        name: string;
        categories: {
            name: string;
        };
    };
}

export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { addToCart } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("description");
    const [isAdded, setIsAdded] = useState(false);

    useEffect(() => {
        if (id) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*, formats(name, categories(name)), product_images(image_url)')
                .eq('id', id)
                .single();

            if (error) throw error;
            setProduct(data);
        } catch (err) {
            console.error("Error fetching product detail:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!product) return;

        // Resolve valid image
        const displayImage = (product as any).product_images?.[0]?.image_url || product.image_url;

        addToCart({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image_url: displayImage,
            quantity: quantity,
            format_name: product.formats?.name
        });

        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 3000);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-8 bg-white">
                <Loader2 className="w-16 h-16 text-gold-500 animate-spin" strokeWidth={1} />
                <p className="font-serif italic text-2xl text-earth-300">Révélation de la pièce unique...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-8 bg-white">
                <div className="w-24 h-24 bg-earth-50 rounded-full flex items-center justify-center text-earth-200">
                    <Package size={48} strokeWidth={1} />
                </div>
                <h1 className="text-4xl font-serif text-earth-900">Modèle introuvable</h1>
                <p className="text-earth-500 max-w-md uppercase tracking-widest text-xs font-black">
                    Il semble que ce zellige ne soit plus dans notre collection actuelle.
                </p>
                <button
                    onClick={() => router.push("/boutique")}
                    className="flex items-center space-x-3 bg-earth-900 text-white px-10 py-5 rounded-sm text-[10px] font-black uppercase tracking-widest hover:-translate-y-1 transition-all"
                >
                    <ArrowLeft size={16} />
                    <span>Retour à la Boutique</span>
                </button>
            </div>
        );
    }

    // Resolve valid image for render
    const displayImage = (product as any).product_images?.[0]?.image_url || product.image_url;

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
    };

    return (
        <div className="min-h-screen bg-white pb-32">
            {/* Header Navigation */}
            <div className="pt-32 pb-8 px-6 max-w-7xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="flex items-center space-x-3 text-earth-400 hover:text-earth-900 transition-colors group"
                >
                    <div className="w-10 h-10 border border-earth-100 rounded-full flex items-center justify-center group-hover:bg-earth-900 group-hover:text-white group-hover:border-earth-900 transition-all">
                        <ArrowLeft size={18} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Retour aux collections</span>
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20">
                {/* Visuals Column */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                    className="space-y-6"
                >
                    <div className="aspect-square relative bg-white shadow-3xl rounded-sm overflow-hidden border border-earth-100 group">
                        {/* Zellige Texture Overlay */}
                        <div className="absolute inset-0 zellige-pattern opacity-10 z-20 pointer-events-none" />

                        {displayImage ? (
                            <Image
                                src={displayImage}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-earth-100">
                                <Package size={120} strokeWidth={0.5} />
                            </div>
                        )}

                        {/* Status Badge */}
                        <div className="absolute top-8 left-8 z-30">
                            {product.stock_status === 'out_of_stock' ? (
                                <span className="bg-red-500 text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">Épuisé</span>
                            ) : product.is_featured ? (
                                <span className="bg-gold-600 text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">Collection Exclusive</span>
                            ) : null}
                        </div>
                    </div>

                    {/* Thumbnails / Alternate views (Placeholder) */}
                    <div className="grid grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-square bg-earth-50 rounded-sm border border-earth-100/50 cursor-pointer hover:border-gold-500 transition-all relative overflow-hidden">
                                {displayImage && <Image src={displayImage} alt="" fill className="object-cover opacity-50 group-hover:opacity-100" />}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Details Column */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                    className="flex flex-col justify-center space-y-12"
                >
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <span className="text-gold-600 text-[10px] font-black uppercase tracking-[0.3em]">
                                {product.formats?.categories?.name} — {product.formats?.name}
                            </span>
                            <h1 className="text-5xl md:text-7xl font-serif text-earth-900 tracking-tighter leading-tight">
                                {product.name}
                            </h1>
                        </div>

                        <div className="flex items-baseline space-x-4">
                            <span className="text-4xl font-serif text-earth-900">{product.price} MAD</span>
                            <span className="text-earth-400 font-light text-xl">/ Le mètre carré</span>
                        </div>

                        <p className="text-earth-500 text-lg font-light leading-relaxed max-w-xl italic">
                            {product.description || "Un zellige d'exception, teinté dans la masse et façonné à la main, offrant des variations chromatiques subtiles qui captent la lumière de manière unique."}
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-3 gap-8 py-8 border-y border-earth-100">
                        <div className="space-y-2">
                            <ShieldCheck className="text-gold-600" size={20} strokeWidth={1.5} />
                            <p className="text-[9px] font-black uppercase tracking-widest text-earth-900">Qualité Fès</p>
                        </div>
                        <div className="space-y-2">
                            <Truck className="text-gold-600" size={20} strokeWidth={1.5} />
                            <p className="text-[9px] font-black uppercase tracking-widest text-earth-900">Livr. Sécurisée</p>
                        </div>
                        <div className="space-y-2">
                            <Check className="text-gold-600" size={20} strokeWidth={1.5} />
                            <p className="text-[9px] font-black uppercase tracking-widest text-earth-900">Sur Mesure</p>
                        </div>
                    </div>

                    {/* Configuration / CTA */}
                    <div className="space-y-8">
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center border border-earth-200 rounded-sm">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-6 py-4 text-earth-600 hover:text-earth-900 transition-colors"
                                >-</button>
                                <span className="w-12 text-center text-xs font-black uppercase tracking-widest text-earth-900">{quantity} m²</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-6 py-4 text-earth-600 hover:text-earth-900 transition-colors"
                                >+</button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={isAdded || product.stock_status === 'out_of_stock'}
                                className={`flex-1 px-10 py-5 rounded-sm text-[11px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center space-x-3 group ${isAdded
                                    ? "bg-green-600 text-white shadow-green-600/20"
                                    : "bg-gold-600 text-white shadow-gold-600/20 hover:bg-earth-900 hover:shadow-earth-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                    }`}
                            >
                                {isAdded ? (
                                    <>
                                        <Check size={16} />
                                        <span>Ajouté au Panier</span>
                                    </>
                                ) : (
                                    <>
                                        <ShoppingBag size={16} />
                                        <span>{product.stock_status === 'out_of_stock' ? 'Épuisé' : 'Ajouter au Panier'}</span>
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>

                        <p className="text-[10px] text-earth-400 font-bold uppercase tracking-widest flex items-center space-x-2">
                            <Info size={12} className="text-gold-600" />
                            <span>Conseil : Calculez 10% de perte supplémentaire pour vos découpes.</span>
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Content Tabs */}
            <section className="max-w-7xl mx-auto px-6 mt-32">
                <div className="flex space-x-12 border-b border-earth-100 mb-12 overflow-x-auto scrollbar-hide">
                    {["description", "caractéristiques", "entretien", "fiches-tech"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-6 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === tab ? "text-earth-900" : "text-earth-300 hover:text-earth-600"
                                }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-gold-600" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="max-w-3xl">
                    {activeTab === 'description' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-earth-600 text-lg leading-relaxed font-light">
                            <p>
                                Ce {product.name} incarne l'essence même du zellige marocain. Chaque carreau est unique, présentant de légères variations de surface, de teinte et des bords volontairement irréguliers, gages d'une fabrication purement artisanale.
                            </p>
                            <p>
                                Idéal pour les crédences de cuisine, les murs de salle de bain ou les fontaines, il apporte une profondeur lumineuse incomparable grâce à son émaillage traditionnel au four à bois.
                            </p>
                        </motion.div>
                    )}
                    {/* Other tabs placeholder */}
                    {activeTab !== 'description' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-12 bg-earth-50/50 rounded-sm border border-earth-100 text-center italic text-earth-400">
                            Information technique en cours de rédaction par nos maîtres artisans.
                        </motion.div>
                    )}
                </div>
            </section>
        </div>
    );
}
