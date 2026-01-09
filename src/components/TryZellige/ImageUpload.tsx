"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface ImageUploadProps {
    onImageUpload: (file: File | null) => void;
    onUrlReady: (url: string | null) => void;
}

export function ImageUpload({ onImageUpload, onUrlReady }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (file: File) => {
        if (!file.type.match('image.*')) return;

        // 1. Show local preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        onImageUpload(file);

        // 2. Upload to Supabase
        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `originals/${fileName}`;

            const { error: uploadError, data } = await supabase.storage
                .from('room-originals')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('room-originals')
                .getPublicUrl(filePath);

            onUrlReady(publicUrl);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Erreur lors du chargement de l\'image. Vérifiez que le bucket "room-originals" existe.');
        } finally {
            setIsUploading(false);
        }
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files?.[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const clearImage = () => {
        setPreview(null);
        onImageUpload(null);
        onUrlReady(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="w-full">
            <AnimatePresence mode="wait">
                {!preview ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`
                            relative border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-300
                            ${isDragging
                                ? "border-gold-500 bg-gold-50/50"
                                : "border-earth-200 hover:border-gold-500 hover:bg-earth-50"
                            }
                        `}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            className="hidden"
                            accept="image/jpeg,image/png"
                            ref={fileInputRef}
                            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                        />
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-earth-100 rounded-full flex items-center justify-center text-earth-500">
                                {isUploading ? (
                                    <Loader2 size={32} className="animate-spin" />
                                ) : (
                                    <Upload size={32} strokeWidth={1.5} />
                                )}
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-serif text-earth-900">
                                    {isUploading ? "Chargement en cours..." : "Déposez votre photo ici"}
                                </h3>
                                <p className="text-xs text-earth-400 uppercase tracking-widest">
                                    JPG, PNG jusqu'à 10MB
                                </p>
                            </div>
                            <button
                                disabled={isUploading}
                                className="px-6 py-2 bg-earth-900 text-white text-[10px] font-black uppercase tracking-widest rounded-sm mt-4 hover:bg-gold-600 transition-colors disabled:opacity-50"
                            >
                                {isUploading ? "Patientez..." : "Parcourir les fichiers"}
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative rounded-lg overflow-hidden shadow-2xl border border-earth-100 group"
                    >
                        <img
                            src={preview}
                            alt="Room Preview"
                            className="w-full h-[400px] object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    clearImage();
                                }}
                                className="bg-white text-red-500 px-6 py-3 rounded-sm shadow-xl flex items-center space-x-2 hover:bg-red-50 transition-all"
                            >
                                <X size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Changer la photo</span>
                            </button>
                        </div>

                        {/* Status Badge */}
                        <div className="absolute top-4 right-4 z-10">
                            {isUploading ? (
                                <div className="bg-earth-900/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/20">
                                    <Loader2 size={12} className="animate-spin" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Envoi...</span>
                                </div>
                            ) : preview ? (
                                <div className="bg-green-600/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/20 shadow-lg">
                                    <Check size={12} strokeWidth={3} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Prêt pour l'IA</span>
                                </div>
                            ) : null}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
