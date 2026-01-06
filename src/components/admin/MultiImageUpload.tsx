"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

interface MultiImageUploadProps {
    value: string[];
    onChange: (urls: string[]) => void;
    folder?: string;
}

export default function MultiImageUpload({ value = [], onChange, folder = "products" }: MultiImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        const newUrls: string[] = [];

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
                const filePath = `${folder}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('media')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('media')
                    .getPublicUrl(filePath);

                newUrls.push(publicUrl);
            }

            onChange([...value, ...newUrls]);
        } catch (err) {
            console.error("Error uploading image:", err);
            alert("Erreur lors du téléchargement de l'image");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleRemove = (urlToRemove: string) => {
        onChange(value.filter(url => url !== urlToRemove));
    };

    return (
        <div className="space-y-4">
            <label className="text-[9px] font-black uppercase tracking-widest text-[var(--admin-text-dim)]">
                Galerie d'Images ({value.length})
            </label>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {value.map((url, index) => (
                    <div key={index} className="relative aspect-square w-full rounded-sm overflow-hidden border border-[var(--admin-border)] bg-earth-900/10 group">
                        <Image
                            src={url}
                            alt={`Image ${index + 1}`}
                            fill
                            className="object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => handleRemove(url)}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}

                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square w-full border-2 border-dashed border-[var(--admin-border)] rounded-sm flex flex-col items-center justify-center space-y-3 cursor-pointer hover:border-gold-500/50 transition-all bg-[var(--admin-bg)] hover:bg-[var(--admin-border)]/50"
                >
                    {isUploading ? (
                        <Loader2 className="w-6 h-6 text-gold-500 animate-spin" strokeWidth={1.5} />
                    ) : (
                        <div className="text-center p-4">
                            <div className="w-10 h-10 bg-[var(--admin-border)] rounded-full text-gold-500 flex items-center justify-center mx-auto mb-2">
                                <Plus size={20} />
                            </div>
                            <p className="text-[8px] font-black uppercase tracking-widest text-[var(--admin-text)]">Ajouter</p>
                        </div>
                    )}
                </div>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleUpload}
                accept="image/*"
                multiple
                className="hidden"
            />
        </div>
    );
}

import { Plus } from "lucide-react";
