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

interface Format {
    id: string;
    category_id: string;
    name: string;
    slug: string;
    image_url: string;
    created_at: string;
    categories?: {
        name: string;
    };
}

interface Category {
    id: string;
    name: string;
}

export default function AdminFormats() {
    const [formats, setFormats] = useState<Format[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [currentFormat, setCurrentFormat] = useState<Partial<Format> | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Fetch Formats with Category names
            const { data: fData, error: fError } = await supabase
                .from('formats')
                .select('*, categories(name)')
                .order('created_at', { ascending: false });

            if (fError) throw fError;
            setFormats(fData || []);

            // Fetch Categories for the modal
            const { data: cData, error: cError } = await supabase
                .from('categories')
                .select('id, name');

            if (cError) throw cError;
            setCategories(cData || []);
        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentFormat) return;

        setIsSaving(true);
        try {
            const formatData = {
                category_id: currentFormat.category_id,
                name: currentFormat.name,
                slug: currentFormat.name?.toLowerCase().replace(/ /g, '-'),
                image_url: currentFormat.image_url || null
            };

            if (currentFormat.id) {
                const { error } = await supabase
                    .from('formats')
                    .update(formatData)
                    .eq('id', currentFormat.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('formats')
                    .insert([formatData]);
                if (error) throw error;
            }

            setShowModal(false);
            fetchData();
        } catch (err) {
            console.error("Error saving format:", err);
            alert("Erreur lors de l'enregistrement");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            const { error } = await supabase
                .from('formats')
                .delete()
                .eq('id', deleteId);
            if (error) throw error;
            setDeleteId(null);
            fetchData();
        } catch (err) {
            console.error("Error deleting format:", err);
            alert("Erreur lors de la suppression. Assurez-vous qu'aucun produit n'utilise ce format.");
        }
    };

    const filteredFormats = formats.filter(f =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-12 transition-colors duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif text-[var(--admin-text)] tracking-tight">Gestion des Formats</h1>
                    <p className="text-[var(--admin-text-dim)] text-xs font-black uppercase tracking-[0.3em] mt-2 italic">Types de carreaux disponibles</p>
                </div>
                <button
                    onClick={() => {
                        setCurrentFormat({});
                        setShowModal(true);
                    }}
                    className="bg-gold-600 text-white px-6 py-4 flex items-center space-x-3 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-gold-500 transition-all shadow-lg shadow-gold-600/20 active:scale-95"
                >
                    <Plus size={16} />
                    <span>Nouveau Format</span>
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--admin-text-dim)]" size={16} />
                <input
                    type="text"
                    placeholder="Rechercher un format..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-sm py-4 pl-12 pr-4 text-xs text-[var(--admin-text)] focus:border-gold-500 outline-none transition-all shadow-sm"
                />
            </div>

            {/* Formats Table */}
            <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-sm overflow-hidden shadow-sm">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-20 space-y-4">
                        <Loader2 className="w-8 h-8 text-gold-500 animate-spin" strokeWidth={1.5} />
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--admin-text-dim)]">Chargement des formats...</p>
                    </div>
                ) : filteredFormats.length === 0 ? (
                    <div className="text-center p-20 space-y-4 opacity-30">
                        <Package size={48} className="mx-auto text-gold-500" strokeWidth={1} />
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--admin-text)]">Aucun format trouvé</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[var(--admin-border)] border-b border-[var(--admin-border)]">
                                <tr>
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-[var(--admin-text-dim)]">Format</th>
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-[var(--admin-text-dim)]">Catégorie</th>
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-[var(--admin-text-dim)] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--admin-border)] text-[11px] font-light text-[var(--admin-text)]">
                                {filteredFormats.map((f) => (
                                    <tr key={f.id} className="hover:bg-[var(--admin-border)] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-earth-100 rounded-sm relative overflow-hidden flex-shrink-0 border border-[var(--admin-border)]">
                                                    {f.image_url ? (
                                                        <Image src={f.image_url} alt={f.name} fill className="object-cover" />
                                                    ) : (
                                                        <ImageIcon className="absolute inset-0 m-auto text-earth-300" size={16} />
                                                    )}
                                                </div>
                                                <p className="font-bold uppercase tracking-wider">{f.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-[10px] uppercase font-medium">{f.categories?.name || 'N/A'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setCurrentFormat(f);
                                                        setShowModal(true);
                                                    }}
                                                    className="p-2 hover:bg-gold-600/10 text-earth-400 hover:text-gold-500 transition-colors rounded-sm"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteId(f.id)}
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

            {/* Format Modal */}
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
                                <h3 className="text-xl font-serif text-[var(--admin-text)]">{currentFormat?.id ? 'Modifier le Format' : 'Nouveau Format'}</h3>
                                <button onClick={() => setShowModal(false)} className="text-[var(--admin-text-dim)] hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-6">
                                <div className="space-y-4">
                                    <ImageUpload
                                        value={currentFormat?.image_url!}
                                        onChange={(url: string | null) => setCurrentFormat({ ...currentFormat, image_url: url || undefined })}
                                        folder="formats"
                                    />

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-[var(--admin-text-dim)]">Nom du format</label>
                                        <input
                                            type="text"
                                            required
                                            value={currentFormat?.name || ""}
                                            onChange={(e) => setCurrentFormat({ ...currentFormat, name: e.target.value })}
                                            className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] px-4 py-3 text-xs text-[var(--admin-text)] outline-none focus:border-gold-500 transition-colors"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-[var(--admin-text-dim)]">Catégorie parente</label>
                                        <select
                                            required
                                            value={currentFormat?.category_id || ""}
                                            onChange={(e) => setCurrentFormat({ ...currentFormat, category_id: e.target.value })}
                                            className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] px-4 py-2.5 text-xs text-[var(--admin-text)] outline-none focus:border-gold-500 transition-colors appearance-none"
                                        >
                                            <option value="">Sélectionner une catégorie</option>
                                            {categories.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
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
                                <h3 className="text-2xl font-serif text-[var(--admin-text)]">Supprimer le format ?</h3>
                                <p className="text-[10px] text-[var(--admin-text-dim)] leading-relaxed uppercase tracking-widest">Tous les produits utilisant ce format pourraient être affectés.</p>
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
