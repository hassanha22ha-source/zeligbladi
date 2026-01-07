"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageUploadProps {
    onImageUpload: (file: File | null) => void;
}

export function ImageUpload({ onImageUpload }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File) => {
        if (!file.type.match('image.*')) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target?.result as string);
            onImageUpload(file);
        };
        reader.readAsDataURL(file);
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
                                <Upload size={32} strokeWidth={1.5} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-serif text-earth-900">
                                    Déposez votre photo ici
                                </h3>
                                <p className="text-xs text-earth-400 uppercase tracking-widest">
                                    JPG, PNG jusqu'à 10MB
                                </p>
                            </div>
                            <button className="px-6 py-2 bg-earth-900 text-white text-[10px] font-black uppercase tracking-widest rounded-sm mt-4 hover:bg-gold-600 transition-colors">
                                Parcourir les fichiers
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
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
