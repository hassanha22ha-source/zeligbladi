"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Filter,
    ArrowRight,
    Loader2,
    ShoppingBag,
    ChevronDown,
    LayoutGrid,
    Check
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

interface Category {
    id: string;
    name: string;
}

interface Format {
    id: string;
    name: string;
    category_id: string;
}

interface Product {
    id: string;
    name: string;
    price: number;
    image_url: string;
    stock_status: string;
    is_featured: boolean;
    format_id: string;
    formats?: {
        name: string;
        category_id: string;
    };
}

function BoutiqueContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { addToCart } = useCart();

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [formats, setFormats] = useState<Format[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filters state
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get("category") || "all");
    const [selectedFormat, setSelectedFormat] = useState<string>(searchParams.get("format") || "all");
    const [sortBy, setSortBy] = useState<string>("newest");
    const [isFilterMobileOpen, setIsFilterMobileOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Fetch Categories
            const { data: cData } = await supabase.from('categories').select('id, name');
            setCategories(cData || []);

            // Fetch Formats
            const { data: fData } = await supabase.from('formats').select('id, name, category_id');
            setFormats(fData || []);

            // Fetch Products
            const { data: pData, error: pError } = await supabase
                .from('products')
                .select('*, formats(name, category_id), product_images(image_url)')
                .order('created_at', { ascending: false });

            if (pError) throw pError;
            setProducts(pData || []);
        } catch (err) {
            console.error("Error fetching boutique data:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Filter Logic
    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "all" || p.formats?.category_id === selectedCategory;
        const matchesFormat = selectedFormat === "all" || p.format_id === selectedFormat;
        return matchesSearch && matchesCategory && matchesFormat;
    }).sort((a, b) => {
        if (sortBy === "price-asc") return Number(a.price) - Number(b.price);
        if (sortBy === "price-desc") return Number(b.price) - Number(a.price);
        return 0; // default newest
    });

    const resetFilters = () => {
        setSearchTerm("");
        setSelectedCategory("all");
        setSelectedFormat("all");
        setSortBy("newest");
        router.push("/boutique");
    };

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
    };

    return (
        <div className="min-h-screen bg-white grain-effect pb-32">
            {/* Header / Hero Section */}
            <section className="relative pt-40 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-earth-50/50 -skew-x-12 translate-x-1/4 -z-10" />
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-16 h-16 bg-gold-600/10 rounded-full flex items-center justify-center text-gold-600 mb-4"
                    >
                        <ShoppingBag size={32} strokeWidth={1.5} />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-8xl font-serif text-earth-900 tracking-tighter"
                    >
                        La Boutique <span className="italic text-gold-500">Zellige</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-earth-500 max-w-2xl mx-auto text-xl font-light leading-relaxed"
                    >
                        Explorez notre collection artisanale unique, façonnée à la main à Fès.
                        Chaque pièce raconte une histoire millénaire de passion et de savoir-faire.
                    </motion.p>
                </div>
            </section>

            {/* Filtration Hub */}
            <section className="max-w-7xl mx-auto px-6 z-40 mb-20 relative">
                <div className="bg-white/80 backdrop-blur-2xl border border-earth-100 shadow-2xl shadow-earth-900/5 rounded-sm p-4 md:p-6 flex flex-col md:flex-row gap-6 items-center">
                    {/* Search */}
                    <div className="flex-1 w-full relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-400" size={18} />
                        <input
                            type="text"
                            placeholder="Rechercher une nuance, un format..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-earth-50/50 border-none rounded-sm py-4 pl-12 pr-4 text-sm text-earth-900 outline-none focus:ring-1 focus:ring-gold-500 transition-all"
                        />
                    </div>

                    {/* Category Selector */}
                    <div className="w-full md:w-auto flex flex-wrap justify-center gap-2">
                        <button
                            onClick={() => setSelectedCategory("all")}
                            className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest rounded-sm transition-all ${selectedCategory === "all" ? "bg-earth-900 text-white shadow-lg" : "bg-white text-earth-400 hover:text-earth-900"
                                }`}
                        >
                            Tout
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest rounded-sm transition-all ${selectedCategory === cat.id ? "bg-earth-900 text-white shadow-lg" : "bg-white text-earth-400 hover:text-earth-900"
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Format Filter Dropdown (Custom) */}
                    <div className="hidden lg:block relative group">
                        <button className="px-6 py-4 flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-earth-800 border border-earth-100 rounded-sm hover:border-gold-500 transition-all">
                            <LayoutGrid size={14} />
                            <span>{selectedFormat === 'all' ? 'Format' : formats.find(f => f.id === selectedFormat)?.name}</span>
                            <ChevronDown size={14} />
                        </button>
                        <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-earth-100 shadow-2xl rounded-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 overflow-hidden">
                            <div className="p-2 space-y-1">
                                <button
                                    onClick={() => setSelectedFormat("all")}
                                    className="w-full text-left px-4 py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-earth-50 flex items-center justify-between"
                                >
                                    <span>Tous les formats</span>
                                    {selectedFormat === 'all' && <Check size={12} className="text-gold-600" />}
                                </button>
                                {formats.filter(f => selectedCategory === 'all' || f.category_id === selectedCategory).map(format => (
                                    <button
                                        key={format.id}
                                        onClick={() => setSelectedFormat(format.id)}
                                        className="w-full text-left px-4 py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-earth-50 flex items-center justify-between"
                                    >
                                        <span>{format.name}</span>
                                        {selectedFormat === format.id && <Check size={12} className="text-gold-600" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Active Filters Bar */}
                {(selectedCategory !== "all" || selectedFormat !== "all" || searchTerm !== "") && (
                    <div className="mt-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-earth-400">Filtres actifs:</span>
                        <button
                            onClick={resetFilters}
                            className="bg-gold-600/10 text-gold-600 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-gold-600 hover:text-white transition-all"
                        >
                            Réinitialiser tout ×
                        </button>
                    </div>
                )}
            </section>

            {/* Products Grid */}
            <section className="max-w-7xl mx-auto px-6">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-40 space-y-8">
                        <Loader2 className="w-16 h-16 text-gold-500 animate-spin" strokeWidth={1} />
                        <p className="font-serif italic text-2xl text-earth-300">Extraction de la terre précieuse...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-40 space-y-8">
                        <div className="w-32 h-32 bg-earth-50 rounded-full flex items-center justify-center mx-auto mb-8 text-earth-200">
                            <Search size={64} strokeWidth={1} />
                        </div>
                        <h2 className="text-4xl font-serif text-earth-900">Aucun zellige trouvé</h2>
                        <p className="text-earth-500 max-w-md mx-auto text-lg font-light leading-relaxed uppercase tracking-widest text-xs">
                            Essayez de modifier vos filtres ou de réinitialiser la recherche pour explorer d'autres collections.
                        </p>
                        <button
                            onClick={resetFilters}
                            className="bg-earth-900 text-white px-10 py-5 rounded-sm text-xs font-black uppercase tracking-widest hover:-translate-y-1 transition-all"
                        >
                            Tout Afficher
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-12">
                            <p className="text-[10px] font-black uppercase tracking-widest text-earth-400">
                                {filteredProducts.length} Modèle{filteredProducts.length > 1 ? 's' : ''} Trouvé{filteredProducts.length > 1 ? 's' : ''}
                            </p>
                            <div className="flex items-center space-x-4">
                                <label className="text-[9px] font-black uppercase tracking-widest text-earth-400">Trier par:</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-earth-900 focus:ring-0 outline-none cursor-pointer"
                                >
                                    <option value="newest">Nouveautés</option>
                                    <option value="price-asc">Prix Croissant</option>
                                    <option value="price-desc">Prix Décroissant</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                            {filteredProducts.map((product, index) => {
                                // Resolve valid image
                                const displayImage = (product as any).product_images?.[0]?.image_url || product.image_url;

                                return (
                                    <motion.div
                                        key={product.id}
                                        initial="initial"
                                        whileInView="animate"
                                        viewport={{ once: true }}
                                        variants={fadeIn}
                                        transition={{ delay: (index % 4) * 0.1 }}
                                        className="group"
                                    >
                                        <div className="block space-y-8">
                                            <div className="aspect-square bg-white shadow-2xl relative overflow-hidden rounded-sm glare-effect border border-earth-100 group-hover:border-gold-500 transition-colors duration-500">
                                                {/* Zellige Texture Overlay */}
                                                <div className="absolute inset-0 zellige-pattern opacity-10 group-hover:opacity-20 transition-opacity z-20 pointer-events-none" />

                                                <Link href={`/boutique/${product.id}`} className="absolute inset-0">
                                                    {displayImage ? (
                                                        <Image
                                                            src={displayImage.replace('http://', 'https://')}
                                                            alt={product.name}
                                                            fill
                                                            unoptimized={true}
                                                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                                        />
                                                    ) : (
                                                        <div className="absolute inset-0 flex items-center justify-center text-earth-100">
                                                            <LayoutGrid size={80} strokeWidth={0.5} />
                                                        </div>
                                                    )}
                                                </Link>

                                                {/* Status Badge */}
                                                <div className="absolute top-6 left-6 z-10 pointer-events-none">
                                                    {product.stock_status === 'out_of_stock' ? (
                                                        <span className="bg-red-500 text-white px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest">Épuisé</span>
                                                    ) : product.is_featured ? (
                                                        <span className="bg-gold-600 text-white px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest">En Avant</span>
                                                    ) : null}
                                                </div>

                                                {/* Quick View / Add Hint */}
                                                <div className="absolute inset-0 bg-earth-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-30 pointer-events-none group-hover:pointer-events-auto">
                                                    <div className="flex flex-col gap-3 scale-90 group-hover:scale-100 transition-transform duration-500">
                                                        <Link
                                                            href={`/boutique/${product.id}`}
                                                            className="bg-white text-earth-900 px-6 py-3 rounded-sm shadow-xl flex items-center justify-center space-x-2 hover:bg-earth-50 transition-colors w-40"
                                                        >
                                                            <span className="text-[9px] font-black uppercase tracking-widest">Détails</span>
                                                            <ArrowRight size={12} />
                                                        </Link>

                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                addToCart({
                                                                    id: product.id,
                                                                    name: product.name,
                                                                    price: Number(product.price),
                                                                    image_url: product.image_url,
                                                                    quantity: 1,
                                                                    format_name: product.formats?.name
                                                                });
                                                            }}
                                                            className="bg-earth-900 text-white px-6 py-3 rounded-sm shadow-xl flex items-center justify-center space-x-2 hover:bg-gold-600 transition-colors w-40"
                                                        >
                                                            <span className="text-[9px] font-black uppercase tracking-widest">Ajouter</span>
                                                            <ShoppingBag size={12} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <Link href={`/boutique/${product.id}`} className="block space-y-4 px-2">
                                                <div className="space-y-1">
                                                    <p className="text-gold-600 text-[10px] font-black uppercase tracking-[0.2em]">
                                                        {product.formats?.name || "Format Artisanal"}
                                                    </p>
                                                    <h3 className="text-2xl font-serif text-earth-900 group-hover:text-gold-600 transition-colors duration-300">
                                                        {product.name}
                                                    </h3>
                                                </div>
                                                <div className="flex items-center justify-between pt-2 border-t border-earth-100">
                                                    <span className="text-xl font-serif text-earth-900">
                                                        {product.price} <span className="text-sm font-light text-earth-400">MAD/m²</span>
                                                    </span>
                                                    <button className="w-10 h-10 rounded-full bg-earth-50 text-earth-900 flex items-center justify-center hover:bg-earth-900 hover:text-white transition-all active:scale-90">
                                                        <ArrowRight size={16} />
                                                    </button>
                                                </div>
                                            </Link>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}

export default function BoutiquePage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-40 space-y-8 min-h-screen">
                <Loader2 className="w-16 h-16 text-gold-500 animate-spin" strokeWidth={1} />
                <p className="font-serif italic text-2xl text-earth-300">Préparation de la boutique...</p>
            </div>
        }>
            <BoutiqueContent />
        </Suspense>
    );
}
