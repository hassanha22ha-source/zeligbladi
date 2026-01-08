"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Check, Play, RefreshCw } from "lucide-react";
import Image from "next/image";

const PRODUCTS_TO_INSERT = [
    "SNOW WHITE ZELLIGE TILE N° 1",
    "WHITE FEZ N° 2",
    "WHITE BLEACHED N° 3",
    "TERRA COTTA ZELLIGE N° 4",
    "BLACK N° 5",
    "DARK BROWN ZELLIGE N° 7",
    "BLUE TURQUOISE N° 8",
    "MALDIVE LIGHT N° 9",
    "HONEY N° 10",
    "BLACK COFFEE N° 13",
    "SEAGREEN N° 15",
    "DUSKY PINK ZELLIGE N° 16",
    "OLD PINK N° 16 (10x10)",
    "PARME N° 17 (10x10)",
    "WINES PURPLE N° 19",
    "MALDIVE ZELLIGE N° 20",
    "GUSTAVIAN BLUE N° 21",
    "SOFT GREEN N° 22",
    "IMPERIAL GREEN N° 23",
    "BEIGE GREY N° 26",
    "BLUE ICE N° 29",
    "CIELO N° 32",
    "LAZULI N° 33",
    "AZUR BLUE N° 34",
    "MINT GREEN N° 36",
    "MAGIC BLUE N° 37",
    "BLUE FRANCE N° 38",
    "MIDNIGHT BLUE N° 39",
    "TILLEUL N° 42",
    "TAUPE N° 43",
    "TABAC N° 45",
    "SPARKLING RED N° 46"
];

const SCRAPED_URLS: Record<string, string> = {
    "../assets/css/master.css": "https://www.zellige-maroc.com/en/ajax-loader.gif",
    "snow white zellige tile n 1": "https://www.zellige-maroc.com/en/../produits/big/blanc_neige_10x10.jpg",
    "white fez n 2": "https://www.zellige-maroc.com/en/../produits/big/zellige_blanc_fes_n2_1.jpg",
    "white bleached n 3": "https://www.zellige-maroc.com/en/../produits/big/Blanc-Lave-N3-10x10.jpg",
    "terra cotta zellige n 4": "https://www.zellige-maroc.com/en/../produits/big/terra_cotta_10-10_1.jpg",
    "black n 5": "https://www.zellige-maroc.com/en/../produits/big/black_1.jpg",
    "dark brown zellige n 7": "https://www.zellige-maroc.com/en/../produits/big/marron_fonce_10-10_1.jpg",
    "blue turquoise n 8": "https://www.zellige-maroc.com/en/../produits/big/zellige_bleu_turquoise_n8_1_1_1.jpg",
    "maldive light n 9": "https://www.zellige-maroc.com/en/../produits/big/maldive_light10x10.jpg",
    "honey n 10": "https://www.zellige-maroc.com/en/../produits/big/Miel-N10_1.jpg",
    "black coffee n 13": "https://www.zellige-maroc.com/en/../produits/big/cafe_noir_10-10_1.jpg",
    "seag reen n 15": "https://www.zellige-maroc.com/en/../produits/big/VERT_DEAU_10-10_1.jpg",
    "dusky pink zellige n 16": "https://www.zellige-maroc.com/en/../produits/big/vieux_rose.jpg",
    "old pink n 16 10x10": "https://www.zellige-maroc.com/en/../produits/big/DSCN1033.jpg",
    "parme n 17 10x10": "https://www.zellige-maroc.com/en/../produits/big/Parme_N17.jpg",
    "wines purple n 19": "https://www.zellige-maroc.com/en/../produits/big/lie_de_vin_19.jpg",
    "maldive zellige n 20": "https://www.zellige-maroc.com/en/../produits/big/maldive_n20.jpg",
    "gustavian blue n 21": "https://www.zellige-maroc.com/en/../produits/big/bleu_gustavien.jpg",
    "soft green n 22": "https://www.zellige-maroc.com/en/../produits/big/vert_tendre_22.jpg",
    "imperial green n 23": "https://www.zellige-maroc.com/en/../produits/big/vert_imperial_10-10.jpg",
    "beige grey n 26": "https://www.zellige-maroc.com/en/../produits/big/gris_beige.jpg",
    "blue ice n 29": "https://www.zellige-maroc.com/en/../produits/big/blue_ice_10-10.jpg",
    "cielo n 32": "https://www.zellige-maroc.com/en/../produits/big/cielo-32_1.jpg",
    "lazuli n 33": "https://www.zellige-maroc.com/en/../produits/big/LAZULI_5-5.jpg",
    "azur blue n 34": "https://www.zellige-maroc.com/en/../produits/big/bleu_azure_34_10x10.jpg",
    "mint green n 36": "https://www.zellige-maroc.com/en/../produits/big/vert_menthe_36_10x10.jpg",
    "magic blue n 37": "https://www.zellige-maroc.com/en/../produits/big/MAGIC_BLUE_10-10_1.jpg",
    "blue france n 38": "https://www.zellige-maroc.com/en/../produits/big/bleu_fe_10x10.jpg",
    "midnight blue n 39": "https://www.zellige-maroc.com/en/../produits/big/bleu_nuit_10x10.jpg",
    "tilleul n 42": "https://www.zellige-maroc.com/en/../produits/big/tilleul_1_1.jpg",
    "taupe n 43": "https://www.zellige-maroc.com/en/../produits/big/taupe43_10x1.jpg",
    "tabac n 45": "https://www.zellige-maroc.com/en/../produits/big/tabac_10x10.jpg",
    "sparkling red n 46": "https://www.zellige-maroc.com/en/../produits/big/rouge_10x10.jpg",
    "sparkling orange n 48": "https://www.zellige-maroc.com/en/../produits/big/orange_10x10.jpg",
    "carbone zellige n 49": "https://www.zellige-maroc.com/en/../produits/big/carbone_10x10.jpg",
    "black metal n 52": "https://www.zellige-maroc.com/en/../produits/big/NOIR_METAL_10X10.jpg",
    "yellow bright n 53": "https://www.zellige-maroc.com/en/../produits/big/jaune_10x10.jpg",
    "light grey zellige n 56": "https://www.zellige-maroc.com/en/../produits/big/GRIS_CLAIR_N56_10X10.jpg",
    "green babylone n 60": "https://www.zellige-maroc.com/en/../produits/big/vert-babylon-n60-10x10_1.jpg",
    "amond green n 61": "https://www.zellige-maroc.com/en/../produits/big/vert_amande_n_61_fr_1.jpg",
    "iceberg n 62": "https://www.zellige-maroc.com/en/../produits/big/iceberg_N_62_1.jpg",
    "triangle cielo n 32": "https://www.zellige-maroc.com/en/../produits/big/Triangle_Cielo_N_32_1.jpg",
    "triangle blue magic n 37": "https://www.zellige-maroc.com/en/../produits/big/Triangle_Bleu_Magic_N_37__1.jpg",
    "triangle green babylone n 60": "https://www.zellige-maroc.com/en/../produits/big/Triangle_Vert_Babylone_N_60__1.jpg",
    "emerald green n 63": "https://www.zellige-maroc.com/en/../produits/big/zellige_emeraude_N_63_fr_1.jpg",
    "pacific green n 64": "https://www.zellige-maroc.com/en/../produits/big/vert_pacific_10-10_1.jpg",
    "lagon n 68": "https://www.zellige-maroc.com/en/../produits/big/Lagon_N_68_1.jpg",
    "indigo n 72": "https://www.zellige-maroc.com/en/../produits/big/Indigo_N_72_1.jpg",
    "green veine n 77": "https://www.zellige-maroc.com/en/../produits/big/vertanis-n77.jpg",
    "green absinthe n 80": "https://www.zellige-maroc.com/en/../produits/big/vert-absinthe-n80.jpg",
    "blue ocean n 81": "https://www.zellige-maroc.com/en/../produits/big/bleu-ocean-n81.jpg",
    "hexa black n 5": "https://www.zellige-maroc.com/en/../produits/big/Noir_N_5_1.jpg",
    "hexa dark brown n 7": "https://www.zellige-maroc.com/en/../produits/big/Marron_fonce_N_7_1.jpg",
    "hexa blue turquoise n 8": "https://www.zellige-maroc.com/en/../produits/big/Bleu_Turqoise_N_8.jpg",
    "hexa black coffee n 13": "https://www.zellige-maroc.com/en/../produits/big/Cafe_noir_N_13.jpg",
    "hexa green water n 15": "https://www.zellige-maroc.com/en/../produits/big/Vert_deau_N_15.jpg",
    "hexa burgundy n 19": "https://www.zellige-maroc.com/en/../produits/big/Lie_de_vin_N_19.jpg",
    "hexa maldive n 20": "https://www.zellige-maroc.com/en/../produits/big/Maldive_N_20_1.jpg",
    "hexa imperial green n 23": "https://www.zellige-maroc.com/en/../produits/big/Vert_Imperial_N_23.jpg",
    "hexa gris nocturne n 27": "https://www.zellige-maroc.com/en/../produits/big/Gris_Nocturne_N_27.jpg",
    "hexa storm grey n 28": "https://www.zellige-maroc.com/en/../produits/big/Gris_Orage_N_28.jpg",
    "hexa cielon 32": "https://www.zellige-maroc.com/en/../produits/big/Cielo_N_32.jpg",
    "hexa lazuli n 33": "https://www.zellige-maroc.com/en/../produits/big/Lazuli_N_33.jpg",
    "hexa blue azur n 34": "https://www.zellige-maroc.com/en/../produits/big/Bleu_Azur_N_34_1.jpg",
    "hexa magic blue n 37": "https://www.zellige-maroc.com/en/../produits/big/Bleu_magique_N_37.jpg",
    "hexa blue france n 38": "https://www.zellige-maroc.com/en/../produits/big/Bleu_France_N_38.jpg",
    "hexa taupen 43": "https://www.zellige-maroc.com/en/../produits/big/Taupe_N_43.jpg",
    "hexa sparkling red n 46": "https://www.zellige-maroc.com/en/../produits/big/Rouge_petillant_N_46.jpg",
    "hexa sparkling green n 47": "https://www.zellige-maroc.com/en/../produits/big/Vert_petillant_N_47.jpg",
    "hexa orange sparkling n 48": "https://www.zellige-maroc.com/en/../produits/big/Orange_petillant_N_48.jpg",
    "hexa yellow glow n 53": "https://www.zellige-maroc.com/en/../produits/big/Jaune_eclat_N_53.jpg",
    "hexa emraude n 63": "https://www.zellige-maroc.com/en/../produits/big/Emraude_N_63.jpg",
    "trapeze snow white n 1": "https://www.zellige-maroc.com/en/../produits/big/Trapeze_Blanc_Neige_N_1_1.jpg",
    "trapeze fes white n 2": "https://www.zellige-maroc.com/en/../produits/big/Trapeze_Blanc_Fes_N_2_1.jpg",
    "trapeze blue gustavian n 21": "https://www.zellige-maroc.com/en/../produits/big/Trapeze_Bleu_Gustavian_N_21__1.jpg",
    "trapeze blue magic n 37": "https://www.zellige-maroc.com/en/../produits/big/Trapeze_Bleu_Magic_N_37__1.jpg",
    "trapeze tilleul n 42": "https://www.zellige-maroc.com/en/../produits/big/Trapeze_Tilleul_N_42__1.jpg",
    "trapeze green babylone n 60": "https://www.zellige-maroc.com/en/../produits/big/Trapeze_Vert_Babylone_N_60_1.jpg",
    "z scaled white snow n 1": "https://www.zellige-maroc.com/en/../produits/big/Zellige_ecaille_Blanc_neige_N_1_1.jpg",
    "z scaled white fes n 2": "https://www.zellige-maroc.com/en/../produits/big/Zellige_ecaille_Blanc_Fes_N_2_1.jpg",
    "zellige chakeur black n 5": "https://www.zellige-maroc.com/en/../produits/big/Zellige_chakeur_Noir_N5_1.jpg",
    "z scaled water green n 15": "https://www.zellige-maroc.com/en/../produits/big/Zellige_ecaille_Vert_deau_N_15_1.jpg",
    "z scaled maldive n 20": "https://www.zellige-maroc.com/en/../produits/big/Zellige_ecaille_Maldive_N_20_1.jpg",
    "z scaled magic blue n 37": "https://www.zellige-maroc.com/en/../produits/big/Zellige_ecaille_Bleu_Magic_N_37__2.jpg",
    "z scaled tilleul n 42": "https://www.zellige-maroc.com/en/../produits/big/Zellige_ecaille_Tilleul_N_42_6.jpg",
    "z scaled black metal n 52": "https://www.zellige-maroc.com/en/../produits/big/Zellige_ecaille_Noir_Metal_N_52__1.jpg",
    "z s babylon green n 60": "https://www.zellige-maroc.com/en/../produits/big/Zellige_ecaille_Vert_Babylone_N_60__2.jpg",
    "traditional friese zellige 1": "https://www.zellige-maroc.com/en/../produits/big/2.jpg",
    "traditional friese zellige 2": "https://www.zellige-maroc.com/en/../produits/big/3_1.jpg",
    "traditional friese zellige 3": "https://www.zellige-maroc.com/en/../produits/big/7_1.jpg"
};

// Helper to clean URL
const cleanUrl = (url: string) => {
    // Resolve ".." manually
    // https://www.zellige-maroc.com/en/../produits/big/... -> https://www.zellige-maroc.com/produits/big/...
    return url.replace('/en/..', '');
};

// Smart matching logic
const findBestImage = (productName: string) => {
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const pNameRaw = productName.toLowerCase();

    // 1. Try Direct Match (Exact Key)
    // The keys in scraping result are lowercased and stripped of "vente-"
    // Let's try to match loosely against keys
    const keys = Object.keys(SCRAPED_URLS);

    // Try finding a key that "looks like" the product name
    const exactishMatch = keys.find(k => k === pNameRaw || k.includes(pNameRaw) || pNameRaw.includes(k));
    if (exactishMatch) return cleanUrl(SCRAPED_URLS[exactishMatch]);


    // 2. Number Match (Strongest heuristic for this dataset)
    const numberMatch = productName.match(/N°\s*(\d+)/i);
    if (numberMatch) {
        const num = numberMatch[1];
        // Look for number in KEY or VALUE
        const matchKey = keys.find(k => {
            // Check key for "n 1", "n 1 ", "n1"
            return k.includes(`n ${num}`) || k.includes(`n${num}`) || k.endsWith(` ${num}`);
        });

        if (matchKey) return cleanUrl(SCRAPED_URLS[matchKey]);

        // Also check value (filename)
        const matchValueKey = keys.find(k => {
            const val = SCRAPED_URLS[k].toLowerCase();
            return val.includes(`n${num}`) || val.includes(`_${num}_`) || val.includes(`-${num}.`) || val.includes(`n${num}-`) || val.endsWith(`${num}.jpg`);
        });
        if (matchValueKey) return cleanUrl(SCRAPED_URLS[matchValueKey]);
    }

    // 3. Normalized Fuzzy Text Match
    const pNameNorm = normalize(productName);
    const textMatchKey = keys.find(k => {
        const kNorm = normalize(k);
        // check if substantial overlap
        return kNorm.includes(pNameNorm) || pNameNorm.includes(kNorm);
    });
    if (textMatchKey) return cleanUrl(SCRAPED_URLS[textMatchKey]);

    return null;
};


export default function SetupProductsPage() {
    const [status, setStatus] = useState("Ready to start.");
    const [logs, setLogs] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [defaultPrice, setDefaultPrice] = useState(45); // Default start price

    const productsWithImages = PRODUCTS_TO_INSERT.map(name => ({
        name,
        imageUrl: findBestImage(name)
    }));

    const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

    const runInsertion = async () => {
        setIsLoading(true);
        setStatus("Running...");
        setLogs([]);
        addLog(`Initializing with price: ${defaultPrice} EUR...`);

        try {
            // 1. Get a default format
            addLog("Fetching formats...");
            const { data: formats, error: fmtError } = await supabase
                .from('formats')
                .select('id, name')
                .limit(1);

            if (fmtError) throw fmtError;
            if (!formats || formats.length === 0) {
                throw new Error("No formats found in database!");
            }

            const defaultFormatId = formats[0].id;
            addLog(`Using format ID: ${defaultFormatId} (${formats[0].name})`);

            // 2. Loop and Insert
            let successCount = 0;
            let skipCount = 0;

            for (const p of productsWithImages) {
                const productName = p.name;
                const imageUrl = p.imageUrl;

                const slug = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

                // Check if exists
                const { data: existing } = await supabase
                    .from('products')
                    .select('id')
                    .eq('slug', slug)
                    .single();

                let productId = existing?.id;

                if (existing) {
                    // Update price even if exists
                    const { error: updateProdError } = await supabase
                        .from('products')
                        .update({ price: defaultPrice })
                        .eq('id', existing.id);

                    if (updateProdError) addLog(`Error updating price for ${productName}`);
                    else addLog(`Updated price and verified: ${productName}`);

                    // We also want to UPDATE the image if it exists!
                } else {
                    addLog(`Inserting ${productName} (Price: ${defaultPrice})...`);
                    const { data: newProd, error: insertError } = await supabase
                        .from('products')
                        .insert([{
                            name: productName,
                            slug: slug,
                            format_id: defaultFormatId,
                            description: `Generic description for ${productName}`,
                            price: defaultPrice,
                            stock_status: 'in_stock',
                            is_featured: false
                        }])
                        .select()
                        .single();

                    if (insertError) {
                        addLog(`ERROR inserting ${productName}: ${insertError.message}`);
                        console.error(insertError);
                        continue;
                    }
                    productId = newProd.id;
                    successCount++;
                }

                // Insert/Update Image
                if (imageUrl && productId) {
                    // Check if image exists
                    const { data: imgData } = await supabase
                        .from('product_images')
                        .select('id')
                        .eq('product_id', productId)
                        .limit(1);

                    if (!imgData || imgData.length === 0) {
                        const { error: imgError } = await supabase
                            .from('product_images')
                            .insert({
                                product_id: productId,
                                image_url: imageUrl,
                                display_order: 0
                            });
                        if (imgError) addLog(`Failed to link image: ${imgError.message}`);
                        else addLog(`Linked image: ${imageUrl.split('/').pop()}`);
                    } else {
                        // FORCE UPDATE URL
                        const { error: updateError } = await supabase
                            .from('product_images')
                            .update({ image_url: imageUrl })
                            .eq('id', imgData[0].id);

                        if (updateError) addLog(`Failed to update image: ${updateError.message}`);
                        else addLog(`Updated image URL for ${productName}`);
                    }
                }
            }

            setStatus(`Done! processed products.`);

        } catch (error: any) {
            console.error(error);
            setStatus(`CRITICAL ERROR: ${error.message}`);
            addLog(`Stack: ${error.stack}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-10 max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif text-[var(--admin-text)]">Import Products & Images</h1>
                    <p className="text-[var(--admin-text-dim)]">Bulk insert zellige products with auto-matched images.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Control Panel */}
                <div className="space-y-6">
                    <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] p-8 rounded-sm shadow-sm space-y-6">
                        <div className="flex items-center space-x-4">
                            <div className="flex flex-col space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--admin-text-dim)]">Default Price (€)</label>
                                <input
                                    type="number"
                                    value={defaultPrice}
                                    onChange={(e) => setDefaultPrice(Number(e.target.value))}
                                    className="w-24 bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text)] px-3 py-2 rounded-sm focus:outline-none focus:border-gold-500"
                                />
                            </div>
                            <button
                                onClick={runInsertion}
                                disabled={isLoading}
                                className="bg-gold-600 text-white px-8 py-4 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-gold-500 transition-all shadow-lg shadow-gold-600/20 disabled:opacity-50 flex items-center space-x-3"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Play size={16} />}
                                <span>{isLoading ? "Processing..." : "Start Import"}</span>
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-4 border border-[var(--admin-border)] rounded-sm text-[var(--admin-text)] hover:bg-[var(--admin-border)] transition-colors"
                            >
                                <RefreshCw size={16} />
                            </button>
                            <div className="text-[10px] font-black uppercase tracking-widest text-[var(--admin-text)]">
                                Status: <span className="text-gold-500">{status}</span>
                            </div>
                        </div>

                        <div className="bg-black/90 text-green-400 p-6 rounded-sm font-mono text-xs h-[400px] overflow-auto border border-[var(--admin-border)] custom-scrollbar">
                            {logs.length === 0 ? (
                                <span className="opacity-50">Usage logs will appear here...</span>
                            ) : (
                                logs.map((log, i) => (
                                    <div key={i} className="mb-1 border-b border-white/10 pb-1 last:border-0">{log}</div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Preview Grid */}
                <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] p-8 rounded-sm shadow-sm">
                    <h3 className="text-lg font-serif mb-4">Preview ({productsWithImages.length} items)</h3>
                    <div className="grid grid-cols-3 gap-4 h-[600px] overflow-auto custom-scrollbar p-2">
                        {productsWithImages.map((p, i) => (
                            <div key={i} className="border border-[var(--admin-border)] p-2 rounded-sm bg-[var(--admin-bg)]">
                                <div className="aspect-square relative bg-gray-100 mb-2 overflow-hidden rounded-sm">
                                    {p.imageUrl ? (
                                        <Image
                                            src={p.imageUrl}
                                            alt={p.name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            unoptimized // For external URLs
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-xs text-gray-400">No Image</div>
                                    )}
                                </div>
                                <div className="text-[9px] font-bold uppercase truncate">{p.name}</div>
                                <div className="text-[8px] text-gray-500 break-all truncate">{p.imageUrl ? 'Found' : 'Missing'}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
