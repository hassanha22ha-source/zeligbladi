import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface UseZelijGeneratorProps {
    onResult: (url: string) => void;
}

export function useZelijGenerator({ onResult }: UseZelijGeneratorProps) {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const generate = async (imageFile: File | null, selectedProduct: any, surface: 'sol' | 'mur') => {
        if (!imageFile || !selectedProduct) {
            setError("Veuillez sélectionner une image et un modèle de zellige.");
            return;
        }

        setLoading(true);
        setError(null);
        setStatus("Analyse de votre pièce par GPT-4o Vision...");

        try {
            // 1. Convert file to base64
            const base64Image = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve((e.target?.result as string).split(',')[1]);
                reader.readAsDataURL(imageFile);
            });

            // 2. Upload to Supabase to get a URL for FLUX
            setStatus("Préparation des textures haute-définition...");
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `temp_${Date.now()}.${fileExt}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('room-originals')
                .upload(fileName, imageFile);

            if (uploadError) throw uploadError;

            const { data: { publicUrl: originalImageUrl } } = supabase.storage
                .from('room-originals')
                .getPublicUrl(fileName);

            // 3. Call our API
            setStatus("Génération du Zellige par l'IA (FLUX)...");
            const response = await fetch('/api/generate-apercu', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    base64Image,
                    originalImageUrl,
                    product: selectedProduct,
                    surface
                })
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || "Une erreur est survenue lors de la génération.");

            setStatus("Restauration des détails et de l'éclairage...");
            if (data.url) {
                onResult(data.url);
            } else {
                throw new Error("Aucune image n'a été retournée.");
            }

        } catch (err: any) {
            console.error("Generator Error:", err);
            setError(err.message || "Une erreur inconnue est survenue.");
        } finally {
            setLoading(false);
            setStatus("");
        }
    };

    return { generate, loading, status, error };
}
