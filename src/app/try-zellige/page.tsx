"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ImageUpload } from "@/components/TryZellige/ImageUpload";
import { ZelligeSelector } from "@/components/TryZellige/ZelligeSelector";
import { PreviewGenerator } from "@/components/TryZellige/PreviewGenerator";

export default function TryZelligePage() {
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [selectedZellige, setSelectedZellige] = useState<any | null>(null);

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
                        Téléchargez une photo de votre pièce et visualisez instantanément nos créations artisanales dans votre espace.
                    </motion.p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Column: Upload & Preview (8 cols) */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-earth-100">
                            <h2 className="text-sm font-black uppercase tracking-widest text-earth-400 mb-6 flex items-center gap-2">
                                <span className="bg-earth-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px]">1</span>
                                Votre Espace
                            </h2>
                            <ImageUpload onImageUpload={setUploadedImage} />

                            {/* Use Preview Generator simply to show the result below the upload after generation */}
                            <div className="mt-8">
                                <PreviewGenerator
                                    uploadedImage={uploadedImage}
                                    selectedZellige={selectedZellige}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Selector (4 cols) */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-earth-100 sticky top-32">
                            <h2 className="text-sm font-black uppercase tracking-widest text-earth-400 mb-6 flex items-center gap-2">
                                <span className="bg-earth-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px]">2</span>
                                Nos Collections
                            </h2>
                            <ZelligeSelector
                                onSelect={setSelectedZellige}
                                selectedId={selectedZellige?.id}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
