"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, LayoutGrid, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";

export default function Home() {
  const [dbFormats, setDbFormats] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isFormatsLoading, setIsFormatsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      // Fetch Formats
      const { data: formatsData } = await supabase
        .from('formats')
        .select('*')
        .order('created_at', { ascending: true });

      if (formatsData) {
        setDbFormats(formatsData);
      }

      // Fetch Products (Limited to 8)
      // Join product_images to get the main image
      const { data: productsData } = await supabase
        .from('products')
        .select('*, formats(name, category_id), product_images(image_url)')
        .order('created_at', { ascending: false })
        .limit(8);

      if (productsData) {
        setProducts(productsData);
      }

      setIsFormatsLoading(false);
    };

    fetchData();
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="flex flex-col gap-32 pb-32 grain-effect">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <Image
          src="/hero.png"
          alt="Luxury Zellige Interior"
          fill
          className="object-cover scale-105"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center text-white px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          >
            <span className="text-secondary uppercase tracking-[0.4em] text-[10px] sm:text-xs font-black mb-6 block drop-shadow-sm">L'Art de l'Argile</span>
            <h1 className="text-5xl md:text-8xl font-serif mb-8 leading-[1.1] tracking-tight">
              L'Art du Zellige <br /> <span className="text-gold-300 italic font-medium">Authentique</span>
            </h1>
            <p className="text-lg md:text-2xl font-sans mb-12 text-white/80 max-w-2xl mx-auto leading-relaxed">
              Une fabrication artisanale à Fès, perpétuant un savoir-faire millénaire pour des intérieurs d'exception.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/boutique"
                className="bg-gold-600 hover:bg-gold-500 text-white px-10 py-5 rounded-sm font-bold transition-all flex items-center justify-center gap-3 glare-effect shadow-2xl shadow-gold-600/20 active:scale-95 text-xs uppercase tracking-widest"
              >
                Découvrir la collection <ArrowRight size={16} />
              </Link>
              <Link
                href="/histoire"
                className="bg-white/5 hover:bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-sm font-bold transition-all active:scale-95 text-xs uppercase tracking-widest"
              >
                Notre Histoire
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Brand Story Snippet */}
      <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-24 items-center">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeIn}
          className="space-y-10"
        >
          <span className="text-secondary uppercase tracking-[0.3em] text-[10px] font-black">Un Voyage au Cœur de la tradition</span>
          <h2 className="text-4xl md:text-6xl font-serif text-earth-900 leading-tight">
            Une Fabrication <br />Artisanale et <span className="italic text-earth-400">Unique</span>
          </h2>
          <p className="text-earth-600 leading-relaxed text-xl font-sans font-light">
            Chaque carreau de zellige est une pièce unique, façonnée à la main par nos artisans à Fès.
            C'est dans cette imperfection que réside la véritable beauté : des variations de nuances,
            des surfaces vibrantes et une âme que seul le travail manuel peut insuflé.
          </p>
          <Link
            href="/histoire"
            className="inline-flex items-center gap-3 text-earth-900 font-black border-b-2 border-secondary pb-2 group hover:text-secondary transition-colors text-sm uppercase tracking-widest"
          >
            En savoir plus <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="relative aspect-[4/5] rounded-sm overflow-hidden shadow-[0_30px_60px_-15px_rgba(129,102,84,0.3)] group"
        >
          <Image
            src="/assets/images/tradition.jpg"
            alt="Artisanat Fès"
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-earth-900/5 group-hover:opacity-0 transition-opacity" />
        </motion.div>
      </section>

      {/* Nos Formats */}
      <section className="bg-earth-100/30 py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
            className="flex flex-col md:flex-row md:items-end justify-between mb-24 space-y-8 md:space-y-0"
          >
            <div className="space-y-6">
              <span className="text-secondary uppercase tracking-[0.4em] text-[10px] font-black">Collections de formes</span>
              <h2 className="text-4xl md:text-7xl font-serif text-earth-900">Nos Formats</h2>
            </div>
            <Link
              href="/formats"
              className="text-earth-900 font-black border-b-2 border-secondary pb-2 group hover:text-secondary transition-colors text-xs uppercase tracking-widest"
            >
              Voir tout les formats
            </Link>
          </motion.div>
        </div>

        <div className="relative w-full overflow-hidden mask-gradient-x">
          <div className="flex gap-10 w-max animate-marquee hover:pause-animation">
            {isFormatsLoading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="w-[30rem] h-[35rem] bg-white/50 animate-pulse rounded-sm" />
              ))
            ) : dbFormats.length > 0 ? (
              // Render items twice for infinite loop
              [...dbFormats, ...dbFormats].map((format, index) => (
                <div
                  key={`${format.id}-${index}`}
                  className="w-[20rem] h-[25rem] flex-shrink-0 p-4"
                >
                  <Link
                    href={`/boutique?format=${format.id}`}
                    className="group/card relative w-full h-full overflow-hidden rounded-sm bg-white shadow-2xl hover:shadow-gold-600/10 transition-all duration-700 flex flex-col justify-end p-10 glare-effect border border-earth-200/50 block"
                  >
                    <div className="absolute inset-0 bg-earth-200 transition-transform duration-1000 group-hover/card:scale-110">
                      {format.image_url ? (
                        <Image
                          src={format.image_url}
                          alt={format.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-earth-300 zellige-pattern opacity-30 uppercase tracking-widest text-[10px] font-black">
                          Format Artisanal
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-earth-950 via-earth-950/20 to-transparent opacity-40 group-hover/card:opacity-70 transition-all duration-700" />

                    <div className="relative z-10 space-y-4">
                      <div className="w-12 h-[1px] bg-secondary group-hover/card:w-full transition-all duration-1000" />
                      <h3 className="text-3xl font-serif text-white leading-tight">{format.name}</h3>
                      <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-gold-300 font-black opacity-0 group-hover/card:opacity-100 translate-y-4 group-hover/card:translate-y-0 transition-all duration-500 delay-100">
                        <span>Découvrir</span>
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-center w-full py-20 opacity-30">
                <p className="text-earth-900 uppercase tracking-widest text-xs font-black">Aucun format disponible</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Nos Créations (Products) */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeIn}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-8 md:space-y-0"
        >
          <div className="space-y-6">
            <span className="text-secondary uppercase tracking-[0.4em] text-[10px] font-black">Nos Créations</span>
            <h2 className="text-4xl md:text-7xl font-serif text-earth-900">Dernières Pièces</h2>
          </div>
          <Link
            href="/boutique"
            className="text-earth-900 font-black border-b-2 border-secondary pb-2 group hover:text-secondary transition-colors text-xs uppercase tracking-widest"
          >
            Voir toute la boutique
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {products.map((product, index) => {
            // Logic to find first valid image
            const displayImage = product.product_images?.[0]?.image_url || product.image_url;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group"
              >
                <div className="block space-y-6">
                  <div className="aspect-square bg-white shadow-lg relative overflow-hidden rounded-sm glare-effect border border-earth-100 group-hover:border-gold-500 transition-colors duration-500">
                    <Link href={`/boutique/${product.id}`} className="absolute inset-0">
                      <div className="absolute inset-0 zellige-pattern opacity-10 group-hover:opacity-20 transition-opacity z-20 pointer-events-none" />

                      {displayImage ? (
                        <Image
                          src={displayImage.replace('http://', 'https://')}
                          alt={product.name}
                          fill
                          unoptimized={true}
                          className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-earth-100">
                          <LayoutGrid size={60} strokeWidth={0.5} />
                        </div>
                      )}
                    </Link>

                    {/* Status Badge */}
                    <div className="absolute top-4 left-4 z-10 pointer-events-none">
                      {product.stock_status === 'out_of_stock' ? (
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-[7px] font-black uppercase tracking-widest">Épuisé</span>
                      ) : product.is_featured ? (
                        <span className="bg-gold-600 text-white px-2 py-1 rounded-full text-[7px] font-black uppercase tracking-widest">En Avant</span>
                      ) : null}
                    </div>

                    {/* Hover Overlay with Actions */}
                    <div className="absolute inset-0 bg-earth-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-30 pointer-events-none group-hover:pointer-events-auto">
                      <div className="flex flex-col gap-3 scale-90 group-hover:scale-100 transition-transform duration-500">
                        <Link
                          href={`/boutique/${product.id}`}
                          className="bg-white text-earth-900 px-6 py-3 rounded-sm shadow-xl flex items-center justify-center space-x-2 hover:bg-earth-50 transition-colors w-40"
                        >
                          <span className="text-[9px] font-black uppercase tracking-widest">Détails</span>
                          <ArrowRight size={12} />
                        </Link>

                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addToCart({
                              id: product.id,
                              name: product.name,
                              price: Number(product.price),
                              image_url: displayImage,
                              quantity: 1,
                              format_name: product.formats?.name
                            });
                          }}
                          className="bg-earth-900 text-white px-6 py-3 rounded-sm shadow-xl flex items-center justify-center space-x-2 hover:bg-gold-600 transition-colors w-40"
                        >
                          <span className="text-[9px] font-black uppercase tracking-widest">Ajouter</span>
                          <ShoppingBag size={12} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <Link href={`/boutique/${product.id}`} className="block space-y-2">
                    <p className="text-gold-600 text-[9px] font-black uppercase tracking-[0.2em]">
                      {product.formats?.name || "Format Artisanal"}
                    </p>
                    <h3 className="text-xl font-serif text-earth-900 group-hover:text-gold-600 transition-colors duration-300 line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between pt-2 border-t border-earth-100/50">
                      <span className="text-lg font-serif text-earth-900">
                        {product.price} <span className="text-xs font-light text-earth-400">MAD/m²</span>
                      </span>
                    </div>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center relative overflow-hidden rounded-sm">
        <div className="absolute inset-0 zellige-pattern opacity-30" />
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeIn}
          className="relative z-10 space-y-12"
        >
          <h2 className="text-5xl md:text-8xl font-serif text-earth-900 leading-tight tracking-tighter">Prêt à sublimer <br />votre espace ?</h2>
          <p className="text-earth-600 text-xl font-light max-w-2xl mx-auto leading-relaxed">
            Contactez-nous pour un devis personnalisé ou pour discuter de votre futur projet de décoration intérieure.
          </p>
          <div className="flex flex-wrap gap-8 justify-center">
            <Link
              href="/contact"
              className="bg-earth-900 text-white px-12 py-5 rounded-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 font-bold text-xs uppercase tracking-widest active:scale-95"
            >
              Nous Contacter
            </Link>
            <Link
              href="tel:+33490753748"
              className="border-2 border-earth-900 text-earth-900 px-12 py-5 rounded-sm hover:bg-earth-900 hover:text-white transition-all duration-300 font-bold text-xs uppercase tracking-widest active:scale-95"
            >
              04.90.75.37.48
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
