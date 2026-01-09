"use client";

import { useState, useEffect } from "react";
import { Sparkles, Download, AlertCircle } from "lucide-react";

interface PreviewGeneratorProps {
    uploadedImage: File | null;
    originalImageUrl: string | null;
    selectedZellige: any | null;
}

export function PreviewGenerator({ uploadedImage, originalImageUrl, selectedZellige }: PreviewGeneratorProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null); // Original preview
    const [generatedUrl, setGeneratedUrl] = useState<string | null>(null); // AI Result
    const [isGenerating, setIsGenerating] = useState(false);
    const [targetArea, setTargetArea] = useState<'floor' | 'wall'>('floor');

    useEffect(() => {
        if (uploadedImage) {
            const url = URL.createObjectURL(uploadedImage);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewUrl(null);
            setGeneratedUrl(null);
        }
    }, [uploadedImage]);

    // Reset generated state when selection changes
    useEffect(() => {
        setGeneratedUrl(null);
    }, [selectedZellige, targetArea]);

    const handleGenerate = async () => {
        if (!originalImageUrl || !selectedZellige) return;

        setIsGenerating(true);
        try {
            const response = await fetch('/api/generate-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    originalImageUrl,
                    zellige: selectedZellige,
                    targetArea
                })
            });

            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error('Raw API Response:', text);
                throw new Error('Le serveur a renvoyé une réponse invalide (HTML). Vérifiez les logs console.');
            }

            if (data.url) {
                setGeneratedUrl(data.url);
            } else {
                throw new Error(data.error || 'Generation failed');
            }
        } catch (error: any) {
            console.error('Error generating image:', error);
            alert(`Erreur: ${error.message}`);
        } finally {
            setIsGenerating(false);
        }
    };

    if (!previewUrl) return null;

    return (
        <div className="space-y-6">
            <div className="flex flex-col items-center gap-6">
                {/* Target Area Selection */}
                <div className="flex gap-4 p-1 bg-earth-50 rounded-lg">
                    <button
                        onClick={() => setTargetArea('floor')}
                        className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${targetArea === 'floor' ? 'bg-white text-earth-900 shadow-sm' : 'text-earth-400 hover:text-earth-600'}`}
                    >
                        Sol
                    </button>
                    <button
                        onClick={() => setTargetArea('wall')}
                        className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${targetArea === 'wall' ? 'bg-white text-earth-900 shadow-sm' : 'text-earth-400 hover:text-earth-600'}`}
                    >
                        Mur
                    </button>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={!selectedZellige || !originalImageUrl || isGenerating}
                    className={`
                        px-8 py-4 rounded-sm flex items-center space-x-3 text-xs font-black uppercase tracking-widest transition-all
                        ${(!selectedZellige || !originalImageUrl)
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-earth-900 text-white hover:bg-gold-600 shadow-xl hover:shadow-2xl hover:-translate-y-1"
                        }
                    `}
                >
                    {isGenerating ? (
                        <>
                            <Sparkles className="animate-spin" size={16} />
                            <span>IA en cours de création...</span>
                        </>
                    ) : (
                        <>
                            <Sparkles size={16} />
                            <span>Générer l'aperçu IA</span>
                        </>
                    )}
                </button>

                {/* Validation Feedback */}
                <div className="flex flex-col items-center gap-2">
                    {!originalImageUrl && uploadedImage && !isGenerating && (
                        <p className="text-[10px] text-red-500 font-medium animate-pulse flex items-center gap-1">
                            <AlertCircle size={10} />
                            L'image n'est pas encore prête (vérifiez vos buckets Supabase).
                        </p>
                    )}
                    {!selectedZellige && !isGenerating && (
                        <p className="text-[10px] text-earth-400 font-medium">
                            Sélectionnez un modèle de Zellige pour continuer.
                        </p>
                    )}
                </div>
            </div>

            {generatedUrl && (
                <div className="relative rounded-lg overflow-hidden shadow-2xl border border-earth-100 animate-in fade-in zoom-in duration-1000 bg-earth-900">
                    <div className="relative w-full">
                        <img
                            src={generatedUrl}
                            alt="Generated Zellige Interior"
                            className="w-full h-auto block"
                        />
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
