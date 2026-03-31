"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Package,
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    Loader2,
    X,
    AlertCircle,
    Check
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import MultiImageUpload from "@/components/admin/MultiImageUpload";

interface Product {
    id: string;
    format_id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    stock_status: string;
    is_featured: boolean;
    color_palette: string;
    pattern_description: string;
    material_finish: string;
    created_at: string;
    formats?: {
        name: string;
    };
    product_images?: {
        image_url: string;
    }[];
}

interface Format {
    id: string;
    name: string;
}

export default function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [formats, setFormats] = useState<Format[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Partial<Product> & { images: string[] }>({ images: [] });
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const { data: pData, error: pError } = await supabase
                .from('products')
                .select('*, formats(name), product_images(image_url)')
                .order('created_at', { ascending: false });

            if (pError) throw pError;
            setProducts(pData || []);

            const { data: fData, error: fError } = await supabase
                .from('formats')
                .select('id, name');

            if (fError) throw fError;
            setFormats(fData || []);
        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsSaving(true);
        try {
            const productData = {
                name: currentProduct.name,
                format_id: currentProduct.format_id,
                slug: currentProduct.name?.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                description: currentProduct.description,
                price: Number(currentProduct.price),
                stock_status: currentProduct.stock_status || 'in_stock',
                is_featured: currentProduct.is_featured || false,
                // AI Fields
                color_palette: currentProduct.color_palette,
                pattern_description: currentProduct.pattern_description,
                material_finish: currentProduct.material_finish,
            };

            let productId = currentProduct.id;

            if (productId) {
                const { error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', productId);
                if (error) throw error;

                const { error: deleteImagesError } = await supabase
                    .from('product_images')
                    .delete()
                    .eq('product_id', productId);
                if (deleteImagesError) throw deleteImagesError;

            } else {
                const { data, error } = await supabase
                    .from('products')
                    .insert([productData])
                    .select()
                    .single();

                if (error) throw error;
                productId = data.id;
            }

            if (currentProduct.images && currentProduct.images.length > 0) {
                const imagesToInsert = currentProduct.images.map((url, index) => ({
                    product_id: productId,
                    image_url: url,
                    display_order: index
                }));

                const { error: imagesError } = await supabase
                    .from('product_images')
                    .insert(imagesToInsert);

                if (imagesError) throw imagesError;
            }

            setShowModal(false);
            fetchData();
        } catch (err) {
            console.error("Error saving product:", err);
            alert("Erreur lors de l'enregistrement. Vérifiez que les colonnes IA existent dans la DB.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', deleteId);
            if (error) throw error;
            setDeleteId(null);
            fetchData();
        } catch (err) {
            console.error("Error deleting product:", err);
            alert("Erreur lors de la suppression");
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openModal = (product?: Product) => {
        if (product) {
            setCurrentProduct({
                ...product,
                images: product.product_images?.map(img => img.image_url) || []
            });
        } else {
            setCurrentProduct({
                stock_status: 'in_stock',
                is_featured: false,
                images: [],
                material_finish: 'Brillant (Émaillé)',
            });
        }
        setShowModal(true);
    };

    return (
        <div className="space-y-12 transition-colors duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif text-[var(--admin-text)] tracking-tight">Gestion des Produits</h1>
                    <p className="text-[var(--admin-text-dim)] text-xs font-black uppercase tracking-[0.3em] mt-2 italic">Inventaire & Collections</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="bg-gold-600 text-white px-6 py-4 flex items-center space-x-3 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-gold-500 transition-all shadow-lg shadow-gold-600/20 active:scale-95"
                >
                    <Plus size={16} />
                    <span>Ajouter un Produit</span>
                </button>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--admin-text-dim)]" size={16} />
                    <input
                        type="text"
                        placeholder="Rechercher un produit..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-sm py-4 pl-12 pr-4 text-xs text-[var(--admin-text)] focus:border-gold-500 outline-none transition-all shadow-sm"
                    />
                </div>
                <button className="px-6 py-4 border border-[var(--admin-border)] bg-[var(--admin-card)] rounded-sm flex items-center space-x-3 text-[var(--admin-text-dim)] hover:text-[var(--admin-text)] transition-colors shadow-sm">
                    <Filter size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Filtres</span>
                </button>
            </div>

            {/* Products Table */}
            <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-sm overflow-hidden shadow-sm">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-20 space-y-4">
                        <Loader2 className="w-8 h-8 text-gold-500 animate-spin" strokeWidth={1.5} />
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--admin-text-dim)]">Chargement de l'inventaire...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center p-20 space-y-4 opacity-30">
                        <Package size={48} className="mx-auto text-gold-500" strokeWidth={1} />
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--admin-text)]">Aucun produit trouvé</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[var(--admin-border)] border-b border-[var(--admin-border)]">
                                <tr>
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-[var(--admin-text-dim)]">Produit</th>
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-[var(--admin-text-dim)]">Format</th>
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-[var(--admin-text-dim)]">Prix</th>
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-[var(--admin-text-dim)]">IA Config</th>
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-[var(--admin-text-dim)] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--admin-border)] text-[11px] font-light text-[var(--admin-text)]">
                                {filteredProducts.map((p) => (
                                    <tr key={p.id} className="hover:bg-[var(--admin-border)] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-earth-100 rounded-sm relative overflow-hidden flex-shrink-0 border border-[var(--admin-border)]">
                                                    {p.product_images && p.product_images.length > 0 ? (
                                                        <Image src={p.product_images[0].image_url} alt={p.name} fill className="object-cover" />
                                                    ) : (
                                                        <X className="absolute inset-0 m-auto text-earth-300" size={16} />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold uppercase tracking-wider">{p.name}</p>
                                                    {p.is_featured && (
                                                        <span className="text-[8px] bg-gold-600/10 text-gold-500 px-1.5 py-0.5 rounded-full font-black tracking-widest">EN AVANT</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-[10px] uppercase font-medium">{p.formats?.name || 'N/A'}</td>
                                        <td className="px-6 py-4 font-bold text-gold-600">{p.price} MAD</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5">
                                                <div className={`w-2 h-2 rounded-full ${p.color_palette && p.pattern_description ? 'bg-green-500' : 'bg-red-500'}`} />
                                                <span className="text-[8px] font-black uppercase tracking-[0.1em] opacity-60">
                                                    {p.color_palette && p.pattern_description ? 'Optimisé' : 'Incomplet'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => openModal(p)}
                                                    className="p-2 hover:bg-gold-600/10 text-earth-400 hover:text-gold-500 transition-colors rounded-sm"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteId(p.id)}
                                                    className="p-2 hover:bg-red-500/10 text-earth-400 hover:text-red-500 transition-colors rounded-sm"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Product Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="relative w-full max-w-4xl bg-[var(--admin-card)] border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] rounded-lg overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            {/* Modal Header */}
                            <div className="p-8 bg-earth-900 border-b border-white/5 flex items-center justify-between flex-shrink-0">
                                <div className="space-y-1">
                                    <p className="text-gold-500 text-[9px] font-black uppercase tracking-[0.5em]">Catalogue Artisanal</p>
                                    <h3 className="text-2xl font-serif text-white uppercase tracking-wider font-light">
                                        {currentProduct?.id ? 'Modifier le Produit' : 'Création Magistrale'}
                                    </h3>
                                </div>
                                <button 
                                    onClick={() => setShowModal(false)} 
                                    className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-12 bg-earth-900/50 backdrop-blur-3xl">
                                
                                {/* Section 1: Visuals */}
                                <div className="space-y-6">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 border-l-2 border-gold-600 pl-4">01 Gallerie d'Excellence</h4>
                                    <div className="bg-black/20 p-6 rounded-lg border border-white/5">
                                        <MultiImageUpload
                                            value={currentProduct.images || []}
                                            onChange={(urls: string[]) => setCurrentProduct({ ...currentProduct, images: urls })}
                                            folder="products"
                                        />
                                    </div>
                                </div>

                                {/* Section 2: Core Info */}
                                <div className="space-y-6">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 border-l-2 border-gold-600 pl-4">02 Identité & Valeur</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-gold-500/50">Nom du chef-d'œuvre</label>
                                            <input
                                                type="text"
                                                required
                                                value={currentProduct?.name || ""}
                                                onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                                                placeholder="ex: Sparkling Red N°46"
                                                className="w-full bg-white/5 border border-white/10 px-0 py-4 text-sm text-white outline-none focus:border-gold-500 transition-all border-b rounded-t-lg pl-4 font-light"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-gold-500/50">Format Artisanal</label>
                                            <select
                                                required
                                                value={currentProduct?.format_id || ""}
                                                onChange={(e) => setCurrentProduct({ ...currentProduct, format_id: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 px-4 py-4 text-sm text-white outline-none focus:border-gold-500 transition-all border-b rounded-t-lg appearance-none cursor-pointer"
                                            >
                                                <option value="" className="bg-earth-900">Origine du format...</option>
                                                {formats.map(f => (
                                                    <option key={f.id} value={f.id} className="bg-earth-900">{f.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-gold-500/50">Prix de Vente (MAD/m²)</label>
                                            <input
                                                type="number"
                                                required
                                                value={currentProduct?.price || ""}
                                                onChange={(e) => setCurrentProduct({ ...currentProduct, price: Number(e.target.value) })}
                                                className="w-full bg-white/5 border border-white/10 px-4 py-4 text-sm text-white outline-none focus:border-gold-500 transition-all border-b rounded-t-lg font-bold"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-gold-500/50">État des Stocks</label>
                                            <select
                                                value={currentProduct?.stock_status || "in_stock"}
                                                onChange={(e) => setCurrentProduct({ ...currentProduct, stock_status: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 px-4 py-4 text-sm text-white outline-none focus:border-gold-500 transition-all border-b rounded-t-lg appearance-none"
                                            >
                                                <option value="in_stock" className="bg-earth-900">Disponible Immédiatement</option>
                                                <option value="out_of_stock" className="bg-earth-900">Production Suspendue</option>
                                                <option value="on_request" className="bg-earth-900">Fabrication sur Mesure</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-3 pt-4">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-gold-500/50">Récit du Produit (Description)</label>
                                        <textarea
                                            rows={3}
                                            value={currentProduct?.description || ""}
                                            onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 px-4 py-4 text-sm text-white outline-none focus:border-gold-500 transition-all border-b rounded-t-lg resize-none italic font-light"
                                        ></textarea>
                                    </div>
                                </div>

                                {/* Section 3: AI CONFIGURATION (THE GAME CHANGER) */}
                                <div className="space-y-6 pt-6 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold-600/5 blur-3xl -z-10 group-hover:bg-gold-600/10 transition-all duration-1000" />
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gold-500 border-l-2 border-gold-600 pl-4">03 Optimisation Vision IA</h4>
                                        <span className="text-[8px] bg-gold-600/20 text-gold-500 px-3 py-1 rounded-full font-black tracking-widest animate-pulse">RECOMMANDÉ POUR FLUX</span>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gold-600/5 p-8 rounded-lg border border-gold-600/10">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-gold-500/70">Palette de Couleurs Précise</label>
                                                <span className="text-[7px] text-white/30 uppercase tracking-widest">Aide l'IA à voir</span>
                                            </div>
                                            <input
                                                type="text"
                                                value={currentProduct?.color_palette || ""}
                                                onChange={(e) => setCurrentProduct({ ...currentProduct, color_palette: e.target.value })}
                                                placeholder="ex: Deep Emerald Green, Forest Mist, Ochre Flecks"
                                                className="w-full bg-white/5 border border-white/20 px-4 py-4 text-sm text-white outline-none focus:border-gold-500 transition-all border-b rounded-md font-mono text-[11px]"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-gold-500/70">Géo-Pattern (Formes)</label>
                                                <span className="text-[7px] text-white/30 uppercase tracking-widest">Structure du zellige</span>
                                            </div>
                                            <input
                                                type="text"
                                                value={currentProduct?.pattern_description || ""}
                                                onChange={(e) => setCurrentProduct({ ...currentProduct, pattern_description: e.target.value })}
                                                placeholder="ex: 8-point geometric star, interlocking polygons"
                                                className="w-full bg-white/5 border border-white/20 px-4 py-4 text-sm text-white outline-none focus:border-gold-500 transition-all border-b rounded-md font-mono text-[11px]"
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-gold-500/70">Finition & Réflectivité</label>
                                                <span className="text-[7px] text-white/30 uppercase tracking-widest">Texture de surface</span>
                                            </div>
                                            <input
                                                type="text"
                                                value={currentProduct?.material_finish || ""}
                                                onChange={(e) => setCurrentProduct({ ...currentProduct, material_finish: e.target.value })}
                                                placeholder="ex: Ultra-glossy glazed ceramic with natural clay highlights"
                                                className="w-full bg-white/5 border border-white/20 px-4 py-4 text-sm text-white outline-none focus:border-gold-500 transition-all border-b rounded-md font-mono text-[11px]"
                                            />
                                        </div>
                                    </div>
                                    <p className="text-[9px] text-white/20 uppercase tracking-[0.2em] italic pl-4">
                                        * Ces champs techniques garantissent que la prévisualisation FLUX reste fidèle à 99% à votre produit artisanal.
                                    </p>
                                </div>

                                {/* Section 4: Settings */}
                                <div className="space-y-6 pt-6">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 border-l-2 border-gold-600 pl-4">04 Paramètres d'Affichage</h4>
                                    <div className="flex items-center space-x-12 bg-white/5 p-6 rounded-lg border border-white/5">
                                        <label className="flex items-center space-x-4 cursor-pointer group">
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only"
                                                    checked={currentProduct?.is_featured || false}
                                                    onChange={(e) => setCurrentProduct({ ...currentProduct, is_featured: e.target.checked })}
                                                />
                                                <div className={`w-12 h-6 rounded-full transition-all duration-300 ${currentProduct?.is_featured ? 'bg-gold-600 shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-white/10'}`}></div>
                                                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${currentProduct?.is_featured ? 'translate-x-6' : ''}`}></div>
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 group-hover:text-gold-500 transition-colors">Exposer en Vitrine (Mettre en avant)</span>
                                        </label>
                                    </div>
                                </div>
                            </form>

                            {/* Modal Footer */}
                            <div className="p-10 bg-earth-900 border-t border-white/5 flex justify-end space-x-6 flex-shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-white transition-all hover:bg-white/5 rounded-sm"
                                >
                                    Conserver en brouillon (Annuler)
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleSave(e as any);
                                    }}
                                    disabled={isSaving}
                                    className="bg-gold-600 text-white px-12 py-5 rounded-sm text-[10px] font-black uppercase tracking-[0.3em] hover:bg-gold-500 transition-all shadow-[0_20px_40px_rgba(212,175,55,0.2)] hover:shadow-[0_20px_50px_rgba(212,175,55,0.4)] hover:-translate-y-1 active:scale-95 flex items-center justify-center space-x-3 disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                    <span>Inscrire au Catalogue</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation */}
            <AnimatePresence>
                {deleteId && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center px-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteId(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-[var(--admin-card)] border border-[var(--admin-border)] p-10 max-w-md w-full text-center space-y-8 shadow-2xl">
                            <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto">
                                <AlertCircle size={40} />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-2xl font-serif text-[var(--admin-text)]">Confirmer la suppression ?</h3>
                                <p className="text-[10px] text-[var(--admin-text-dim)] leading-relaxed uppercase tracking-widest">
                                    Cette action est irréversible. Le produit sera définitivement supprimé de la base de données.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-4 border border-[var(--admin-border)] text-[9px] font-black uppercase tracking-widest text-[var(--admin-text-dim)] hover:text-white transition-all">
                                    Annuler
                                </button>
                                <button onClick={handleDelete} className="flex-1 px-4 py-4 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20">
                                    Supprimer
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
