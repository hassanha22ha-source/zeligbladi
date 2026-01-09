"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Check, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ZelligeSelectorProps {
    onSelect: (zellige: any) => void;
    selectedId?: string;
}

export function ZelligeSelector({ onSelect, selectedId }: ZelligeSelectorProps) {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            const { data } = await supabase
                .from('products')
                .select('id, name, description, price, product_images(image_url)')
                .limit(40);

            if (data) setProducts(data);
            setIsLoading(false);
        };

        fetchProducts();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-serif text-earth-900 border-b border-earth-100 pb-2">
                Choisissez votre Zellige
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {products.map((product) => (
                    <button
                        key={product.id}
                        onClick={() => onSelect(product)}
                        className={`
                            relative aspect-square group rounded-sm overflow-hidden border-2 transition-all duration-300
                            ${selectedId === product.id
                                ? "border-gold-600 ring-2 ring-gold-600/20 scale-95"
                                : "border-transparent hover:border-gold-300"
                            }
                        `}
                    >
                        <Image
                            src={product.product_images?.[0]?.image_url || "/placeholder-zellige.jpg"}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                            <span className="text-white text-[10px] font-black uppercase tracking-widest truncate">
                                {product.name}
                            </span>
                        </div>
                        {selectedId === product.id && (
                            <div className="absolute top-2 right-2 bg-gold-600 text-white p-1 rounded-full shadow-lg">
                                <Check size={12} strokeWidth={3} />
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
