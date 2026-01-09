"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function FormatsPage() {
    const [formats, setFormats] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFormats = async () => {
            const { data, error } = await supabase
                .from('formats')
                .select('*, categories(name)')
                .order('created_at', { ascending: true });

            if (!error && data) {
                setFormats(data);
            }
            setIsLoading(false);
        };

        fetchFormats();
    }, []);

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-32 grain-effect min-h-screen">
            <motion.header
                initial="initial"
                animate="animate"
                variants={fadeIn}
                className="mb-24 text-center space-y-6"
            >
                <span className="text-secondary uppercase tracking-[0.4em] text-[10px] font-black">L'Art de la Forme</span>
                <h1 className="text-5xl md:text-7xl font-serif text-earth-900 leading-tight">Nos Formats</h1>
                <p className="text-earth-500 max-w-2xl mx-auto text-xl font-light leading-relaxed">
                    Découvrez l'élégance de nos différents formats de zellige, façonnés à la main pour capturer la lumière de manière unique.
                </p>
                <div className="w-24 h-[1px] bg-earth-200 mx-auto" />
            </motion.header>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 text-gold-500 animate-spin" />
                </div>
            ) : formats.length > 0 ? (
                <div className="relative w-full overflow-hidden mask-gradient-x">
                    <div className="flex gap-12 w-max animate-marquee hover:pause-animation">
                        {/* Render items twice for infinite loop */}
                        {[...formats, ...formats].map((format, index) => (
                            <div
                                key={`${format.id}-${index}`}
                                className="group cursor-pointer space-y-6 w-[350px] flex-shrink-0"
                            >
                                <Link href={`/boutique?format=${format.id}`} className="block">
                                    <div className="aspect-square bg-white shadow-xl relative overflow-hidden flex items-center justify-center glare-effect border border-earth-100 rounded-sm">
                                        <div className="absolute inset-0 zellige-pattern opacity-50 group-hover:scale-110 transition-transform duration-1000" />
                                        {format.image_url ? (
                                            <Image
                                                src={format.image_url.replace('http://', 'https://')}
                                                alt={format.name}
                                                fill
                                                unoptimized={true}
                                                className="object-cover relative z-10 transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <span className="relative z-10 text-earth-300 font-serif italic text-2xl group-hover:text-secondary transition-colors">
                                                {format.name}
                                            </span>
                                        )}
                                        <div className="absolute inset-x-8 bottom-8 h-[1px] bg-white z-20 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                                    </div>
                                </Link>
                                <div className="space-y-2 text-center">
                                    <span className="text-secondary uppercase tracking-[0.2em] text-[10px] font-black">{format.categories?.name || 'Artisanal'}</span>
                                    <Link href={`/boutique?format=${format.id}`}>
                                        <h3 className="text-2xl font-serif text-earth-900 group-hover:text-secondary transition-colors duration-300">{format.name}</h3>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 opacity-30">
                    <p className="text-earth-900 uppercase tracking-widest text-xs font-black">Aucun format disponible</p>
                </div>
            )}
        </div>
    );
}
