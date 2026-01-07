"use client";

import { useState, useEffect } from "react";
import { Sparkles, Download } from "lucide-react";

interface PreviewGeneratorProps {
    uploadedImage: File | null;
    selectedZellige: any | null;
}

export function PreviewGenerator({ uploadedImage, selectedZellige }: PreviewGeneratorProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedResult, setGeneratedResult] = useState<boolean>(false);

    useEffect(() => {
        if (uploadedImage) {
            const url = URL.createObjectURL(uploadedImage);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewUrl(null);
            setGeneratedResult(false);
        }
    }, [uploadedImage]);

    // Reset generated state when selection changes
    useEffect(() => {
        setGeneratedResult(false);
    }, [selectedZellige]);

    const handleGenerate = () => {
        setIsGenerating(true);
        // Simulate processing time
        setTimeout(() => {
            setIsGenerating(false);
            setGeneratedResult(true);
        }, 1500);
    };

    if (!previewUrl) return null;

    return (
        <div className="space-y-6">
            <div className="flex justify-center">
                <button
                    onClick={handleGenerate}
                    disabled={!selectedZellige || isGenerating}
                    className={`
                        px-8 py-4 rounded-sm flex items-center space-x-3 text-xs font-black uppercase tracking-widest transition-all
                        ${!selectedZellige
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-earth-900 text-white hover:bg-gold-600 shadow-xl hover:shadow-2xl hover:-translate-y-1"
                        }
                    `}
                >
                    {isGenerating ? (
                        <>
                            <Sparkles className="animate-spin" size={16} />
                            <span>Génération en cours...</span>
                        </>
                    ) : (
                        <>
                            <Sparkles size={16} />
                            <span>Générer l'aperçu</span>
                        </>
                    )}
                </button>
            </div>

            {generatedResult && selectedZellige && (
                <div className="relative rounded-lg overflow-hidden shadow-2xl border border-earth-100 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    {/* Perspective container */}
                    <div className="relative w-full h-[500px] bg-black">
                        {/* Background Image */}
                        <img
                            src={previewUrl}
                            alt="Original Room"
                            className="absolute inset-0 w-full h-full object-cover"
                        />

                        {/* Floor Overlay with Perspective */}
                        <div
                            className="absolute bottom-0 left-0 right-0 h-[35%] overflow-hidden opacity-90 mix-blend-multiply"
                            style={{
                                perspective: "1000px",
                            }}
                        >
                            <div
                                className="w-full h-[200%] origin-bottom"
                                style={{
                                    backgroundImage: `url(${selectedZellige.image_url})`,
                                    backgroundSize: "200px",
                                    transform: "rotateX(60deg) scale(2)",
                                }}
                            />
                        </div>
                    </div>

                    <div className="bg-white p-4 flex justify-between items-center border-t border-earth-100">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-earth-400">Rendu avec</p>
                            <p className="font-serif text-lg text-earth-900">{selectedZellige.name}</p>
                        </div>
                        <button className="flex items-center space-x-2 text-earth-900 hover:text-gold-600 transition-colors">
                            <Download size={16} />
                            <span className="text-[9px] font-black uppercase tracking-widest">Télécharger</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
