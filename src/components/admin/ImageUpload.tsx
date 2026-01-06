"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

interface ImageUploadProps {
    value: string | null;
    onChange: (url: string | null) => void;
    folder?: string;
}

export default function ImageUpload({ value, onChange, folder = "products" }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${folder}/${fileName}`;

            // Upload to 'media' bucket
            const { error: uploadError } = await supabase.storage
                .from('media')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('media')
                .getPublicUrl(filePath);

            onChange(publicUrl);
        } catch (err) {
            console.error("Error uploading image:", err);
            alert("Erreur lors du téléchargement de l'image");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleRemove = async () => {
        // Just clear the URL in the database/parent state
        // In a real app, you might want to delete from storage too
        onChange(null);
    };

    return (
        <div className="space-y-4">
            <label className="text-[9px] font-black uppercase tracking-widest text-[var(--admin-text-dim)]">Image</label>

            <div className="relative group">
                {value ? (
                    <div className="relative aspect-video w-full rounded-sm overflow-hidden border border-[var(--admin-border)] bg-earth-900/10">
                        <Image
                            src={value}
                            alt="Preview"
                            fill
                            className="object-contain"
                        />
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ) : (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-video w-full border-2 border-dashed border-[var(--admin-border)] rounded-sm flex flex-col items-center justify-center space-y-3 cursor-pointer hover:border-gold-500/50 transition-all bg-[var(--admin-bg)]"
                    >
                        {isUploading ? (
                            <Loader2 className="w-8 h-8 text-gold-500 animate-spin" strokeWidth={1.5} />
                        ) : (
                            <>
                                <div className="p-3 bg-[var(--admin-border)] rounded-full text-gold-500">
                                    <Upload size={20} />
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--admin-text)]">Cliquer pour uploader</p>
                                    <p className="text-[9px] text-[var(--admin-text-dim)] mt-1">Images JPG, PNG ou WEBP</p>
                                </div>
                            </>
                        )}
                    </div>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleUpload}
                    accept="image/*"
                    className="hidden"
                />
            </div>
        </div>
    );
}
