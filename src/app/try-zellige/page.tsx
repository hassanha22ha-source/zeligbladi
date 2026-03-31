"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageUpload } from "@/components/TryZellige/ImageUpload";
import { ZelligeSelector } from "@/components/TryZellige/ZelligeSelector";
import GenerateButton, { AperçuResult } from "@/components/TryZellige/GenerateButton";

export default function TryZelligePage() {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedZellige, setSelectedZellige] = useState<any | null>(null);
    const [surface, setSurface] = useState<'sol' | 'mur'>('wall' as any === 'wall' ? 'mur' : 'sol'); // Sync with existing component's naming and provide defaults
    const [resultImage, setResultImage] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-white grain-effect pb-32">
            {/* Header */}
            <section className="relative pt-40 pb-12 px-6 bg-earth-50/30">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-serif text-earth-900"
                    >
                        Essayez le Zellige <span className="italic text-gold-600">Chez Vous</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-earth-500 text-lg font-light leading-relaxed max-w-2xl mx-auto"
                    >
                        Téléchargez une photo de votre pièce et visualisez instantanément nos créations artisanales dans votre espace grâce à l'IA.
                    </motion.p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Column: Upload & Result (8 cols) */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="bg-white p-8 rounded-lg shadow-sm border border-earth-100 min-h-[600px]">
                            <h2 className="text-sm font-black uppercase tracking-widest text-earth-400 mb-8 flex items-center gap-2">
                                <span className="bg-earth-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px]">1</span>
                                Votre Espace
                            </h2>
                            
                            <AnimatePresence mode="wait">
                                {!resultImage ? (
                                    <motion.div
                                        key="upload"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="space-y-8"
                                    >
                                        <ImageUpload
                                            onImageUpload={setUploadedFile}
                                            onUrlReady={setPreviewUrl}
                                        />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="result"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <AperçuResult
                                            originalImage={previewUrl}
                                            generatedImage={resultImage}
                                            productName={selectedZellige?.name || "Zellige"}
                                            productPrice={selectedZellige?.price || "—"}
                                            productSlug={selectedZellige?.slug}
                                            onReset={() => setResultImage(null)}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right Column: Selector & Generate (4 cols) */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white p-8 rounded-lg shadow-sm border border-earth-100 sticky top-32 space-y-8">
                            <h2 className="text-sm font-black uppercase tracking-widest text-earth-400 flex items-center gap-2">
                                <span className="bg-earth-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px]">2</span>
                                Nos Collections
                            </h2>
                            
                            <ZelligeSelector
                                onSelect={(z) => {
                                    setSelectedZellige(z);
                                    setResultImage(null); // Reset result when choosing new pattern
                                }}
                                selectedId={selectedZellige?.id}
                            />

                            <div className="pt-6 border-t border-earth-100">
                                <GenerateButton
                                    imageFile={uploadedFile}
                                    selectedProduct={selectedZellige}
                                    surface={surface}
                                    onResult={(url) => setResultImage(url)}
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
