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
            // Fetch Products with Format names and Images
            const { data: pData, error: pError } = await supabase
                .from('products')
                .select('*, formats(name), product_images(image_url)')
                .order('created_at', { ascending: false });

            if (pError) throw pError;
            setProducts(pData || []);

            // Fetch Formats for the modal
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
                slug: currentProduct.name?.toLowerCase().replace(/ /g, '-'),
                description: currentProduct.description,
                price: Number(currentProduct.price),
                stock_status: currentProduct.stock_status || 'in_stock',
                is_featured: currentProduct.is_featured || false,
                // Removed image_url from here as it's now in a separate table
            };

            let productId = currentProduct.id;

            if (productId) {
                // Update Product
                const { error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', productId);
                if (error) throw error;

                // Handle Images: For simplicity, delete all and re-insert (or smarter diffing if needed)
                // Deleting all existing images for this product
                const { error: deleteImagesError } = await supabase
                    .from('product_images')
                    .delete()
                    .eq('product_id', productId);
                if (deleteImagesError) throw deleteImagesError;

            } else {
                // Insert Product
                const { data, error } = await supabase
                    .from('products')
                    .insert([productData])
                    .select()
                    .single();

                if (error) throw error;
                productId = data.id;
            }

            // Insert New Images
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
            alert("Erreur lors de l'enregistrement");
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
                images: []
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
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-[var(--admin-text-dim)]">Statut</th>
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
                                                        <Package className="absolute inset-0 m-auto text-earth-300" size={16} />
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
                                            <span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${p.stock_status === 'in_stock' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                                }`}>
                                                {p.stock_status === 'in_stock' ? 'En Stock' : 'Épuisé'}
                                            </span>
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
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-[var(--admin-card)] border border-[var(--admin-border)] shadow-2xl rounded-sm overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-8 border-b border-[var(--admin-border)] flex items-center justify-between flex-shrink-0">
                                <h3 className="text-xl font-serif text-[var(--admin-text)]">
                                    {currentProduct?.id ? 'Modifier le Produit' : 'Nouveau Produit'}
                                </h3>
                                <button onClick={() => setShowModal(false)} className="text-[var(--admin-text-dim)] hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-6">
                                <MultiImageUpload
                                    value={currentProduct.images || []}
                                    onChange={(urls: string[]) => setCurrentProduct({ ...currentProduct, images: urls })}
                                    folder="products"
                                />

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-[var(--admin-text-dim)]">Nom du produit</label>
                                        <input
                                            type="text"
                                            required
                                            value={currentProduct?.name || ""}
                                            onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                                            className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] px-4 py-3 text-xs text-[var(--admin-text)] outline-none focus:border-gold-500 transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-[var(--admin-text-dim)]">Format</label>
                                        <select
                                            required
                                            value={currentProduct?.format_id || ""}
                                            onChange={(e) => setCurrentProduct({ ...currentProduct, format_id: e.target.value })}
                                            className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] px-4 py-2.5 text-xs text-[var(--admin-text)] outline-none focus:border-gold-500 transition-colors appearance-none"
                                        >
                                            <option value="">Sélectionner un format</option>
                                            {formats.map(f => (
                                                <option key={f.id} value={f.id}>{f.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-[var(--admin-text-dim)]">Prix (MAD)</label>
                                        <input
                                            type="number"
                                            required
                                            value={currentProduct?.price || ""}
                                            onChange={(e) => setCurrentProduct({ ...currentProduct, price: Number(e.target.value) })}
                                            className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] px-4 py-3 text-xs text-[var(--admin-text)] outline-none focus:border-gold-500 transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-[var(--admin-text-dim)]">Statut du stock</label>
                                        <select
                                            value={currentProduct?.stock_status || "in_stock"}
                                            onChange={(e) => setCurrentProduct({ ...currentProduct, stock_status: e.target.value })}
                                            className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] px-4 py-2.5 text-xs text-[var(--admin-text)] outline-none focus:border-gold-500 transition-colors appearance-none"
                                        >
                                            <option value="in_stock">En Stock</option>
                                            <option value="out_of_stock">Épuisé</option>
                                            <option value="on_request">Sur demande</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-[var(--admin-text-dim)]">Description</label>
                                    <textarea
                                        rows={4}
                                        value={currentProduct?.description || ""}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                                        className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] px-4 py-3 text-xs text-[var(--admin-text)] outline-none focus:border-gold-500 transition-colors resize-none"
                                    ></textarea>
                                </div>

                                <div className="flex items-center space-x-6">
                                    <label className="flex items-center space-x-3 cursor-pointer group">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                className="sr-only"
                                                checked={currentProduct?.is_featured || false}
                                                onChange={(e) => setCurrentProduct({ ...currentProduct, is_featured: e.target.checked })}
                                            />
                                            <div className={`w-10 h-6 rounded-full transition-colors ${currentProduct?.is_featured ? 'bg-gold-600' : 'bg-gray-700'}`}></div>
                                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${currentProduct?.is_featured ? 'translate-x-4' : ''}`}></div>
                                        </div>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-[var(--admin-text-dim)] group-hover:text-gold-500">Mettre en avant</span>
                                    </label>
                                </div>
                            </form>

                            <div className="p-8 border-t border-[var(--admin-border)] flex justify-end space-x-4 flex-shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-[var(--admin-text-dim)] hover:text-white transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleSave(e as any);
                                    }}
                                    disabled={isSaving}
                                    className="bg-gold-600 text-white px-8 py-4 rounded-sm text-[9px] font-black uppercase tracking-widest hover:bg-gold-500 transition-all flex items-center space-x-2 disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                    <span>Enregistrer</span>
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
