"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Package,
    Plus,
    Search,
    Edit,
    Trash2,
    Loader2,
    X,
    AlertCircle,
    Check,
    Image as ImageIcon
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import ImageUpload from "@/components/admin/ImageUpload";

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    image_url: string;
    created_at: string;
}

export default function AdminCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<Partial<Category> | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCategories(data || []);
        } catch (err) {
            console.error("Error fetching categories:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentCategory) return;

        setIsSaving(true);
        try {
            const categoryData = {
                name: currentCategory.name,
                slug: currentCategory.name?.toLowerCase().replace(/ /g, '-'),
                description: currentCategory.description,
                image_url: currentCategory.image_url || null
            };

            if (currentCategory.id) {
                const { error } = await supabase
                    .from('categories')
                    .update(categoryData)
                    .eq('id', currentCategory.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('categories')
                    .insert([categoryData]);
                if (error) throw error;
            }

            setShowModal(false);
            fetchCategories();
        } catch (err) {
            console.error("Error saving category:", err);
            alert("Erreur lors de l'enregistrement");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            const { error } = await supabase
                .from('categories')
                .delete()
                .eq('id', deleteId);
            if (error) throw error;
            setDeleteId(null);
            fetchCategories();
        } catch (err) {
            console.error("Error deleting category:", err);
            alert("Erreur lors de la suppression");
        }
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-12 transition-colors duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif text-[var(--admin-text)] tracking-tight">Gestion des Catégories</h1>
                    <p className="text-[var(--admin-text-dim)] text-xs font-black uppercase tracking-[0.3em] mt-2 italic">Organisation des collections</p>
                </div>
                <button
                    onClick={() => {
                        setCurrentCategory({});
                        setShowModal(true);
                    }}
                    className="bg-gold-600 text-white px-6 py-4 flex items-center space-x-3 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-gold-500 transition-all shadow-lg shadow-gold-600/20 active:scale-95"
                >
                    <Plus size={16} />
                    <span>Nouvelle Catégorie</span>
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--admin-text-dim)]" size={16} />
                <input
                    type="text"
                    placeholder="Rechercher une catégorie..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-sm py-4 pl-12 pr-4 text-xs text-[var(--admin-text)] focus:border-gold-500 outline-none transition-all shadow-sm"
                />
            </div>

            {/* Categories Table */}
            <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-sm overflow-hidden shadow-sm">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-20 space-y-4">
                        <Loader2 className="w-8 h-8 text-gold-500 animate-spin" strokeWidth={1.5} />
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--admin-text-dim)]">Chargement des catégories...</p>
                    </div>
                ) : filteredCategories.length === 0 ? (
                    <div className="text-center p-20 space-y-4 opacity-30">
                        <ImageIcon size={48} className="mx-auto text-gold-500" strokeWidth={1} />
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--admin-text)]">Aucune catégorie trouvée</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[var(--admin-border)] border-b border-[var(--admin-border)]">
                                <tr>
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-[var(--admin-text-dim)]">Catégorie</th>
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-[var(--admin-text-dim)]">Slug</th>
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-[var(--admin-text-dim)]">Description</th>
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-[var(--admin-text-dim)] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--admin-border)] text-[11px] font-light text-[var(--admin-text)]">
                                {filteredCategories.map((c) => (
                                    <tr key={c.id} className="hover:bg-[var(--admin-border)] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-earth-100 rounded-sm relative overflow-hidden flex-shrink-0 border border-[var(--admin-border)]">
                                                    {c.image_url ? (
                                                        <Image src={c.image_url} alt={c.name} fill className="object-cover" />
                                                    ) : (
                                                        <ImageIcon className="absolute inset-0 m-auto text-earth-300" size={16} />
                                                    )}
                                                </div>
                                                <p className="font-bold uppercase tracking-wider">{c.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-[10px] font-mono text-gold-600">{c.slug}</td>
                                        <td className="px-6 py-4 max-w-xs truncate">{c.description || 'Non renseignée'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setCurrentCategory(c);
                                                        setShowModal(true);
                                                    }}
                                                    className="p-2 hover:bg-gold-600/10 text-earth-400 hover:text-gold-500 transition-colors rounded-sm"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteId(c.id)}
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

            {/* Category Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-xl bg-[var(--admin-card)] border border-[var(--admin-border)] shadow-2xl rounded-sm overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-8 border-b border-[var(--admin-border)] flex items-center justify-between flex-shrink-0">
                                <h3 className="text-xl font-serif text-[var(--admin-text)]">{currentCategory?.id ? 'Modifier la Catégorie' : 'Nouvelle Catégorie'}</h3>
                                <button onClick={() => setShowModal(false)} className="text-[var(--admin-text-dim)] hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-6">
                                <div className="space-y-4">
                                    <ImageUpload
                                        value={currentCategory?.image_url!}
                                        onChange={(url: string | null) => setCurrentCategory({ ...currentCategory, image_url: url || undefined })}
                                        folder="categories"
                                    />

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-[var(--admin-text-dim)]">Nom de la catégorie</label>
                                        <input
                                            type="text"
                                            required
                                            value={currentCategory?.name || ""}
                                            onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                                            className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] px-4 py-3 text-xs text-[var(--admin-text)] outline-none focus:border-gold-500 transition-colors"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-[var(--admin-text-dim)]">Description</label>
                                        <textarea
                                            rows={3}
                                            value={currentCategory?.description || ""}
                                            onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
                                            className="w-full bg-[var(--admin-bg)] border border border-[var(--admin-border)] px-4 py-3 text-xs text-[var(--admin-text)] outline-none focus:border-gold-500 transition-colors resize-none"
                                        ></textarea>
                                    </div>
                                </div>
                            </form>

                            <div className="p-8 border-t border-[var(--admin-border)] flex justify-end space-x-4 flex-shrink-0">
                                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-[var(--admin-text-dim)] hover:text-white transition-colors">Annuler</button>
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
                            <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto"><AlertCircle size={40} /></div>
                            <div className="space-y-4">
                                <h3 className="text-2xl font-serif text-[var(--admin-text)]">Supprimer la catégorie ?</h3>
                                <p className="text-[10px] text-[var(--admin-text-dim)] leading-relaxed uppercase tracking-widest">Tous les formats et produits associés pourraient être affectés.</p>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-4 border border-[var(--admin-border)] text-[9px] font-black uppercase tracking-widest text-[var(--admin-text-dim)] hover:text-white transition-all">Annuler</button>
                                <button onClick={handleDelete} className="flex-1 px-4 py-4 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20">Supprimer</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
