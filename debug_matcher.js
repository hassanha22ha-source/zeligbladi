
const SCRAPED_URLS = {
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
    "sparkling red n 46": "https://www.zellige-maroc.com/en/../produits/big/rouge_10x10.jpg"
};

const PRODUCTS_TO_INSERT = [
    "GUSTAVIAN BLUE N° 21",
    "SOFT GREEN N° 22",
    "IMPERIAL GREEN N° 23",
    "BEIGE GREY N° 26"
];

const cleanUrl = (url) => {
    return url.replace('/en/..', '');
};

const findBestImage = (productName) => {
    const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const pNameRaw = productName.toLowerCase();

    const keys = Object.keys(SCRAPED_URLS);

    // 1. Exactish match
    const exactishMatch = keys.find(k => k === pNameRaw || k.includes(pNameRaw) || pNameRaw.includes(k));
    if (exactishMatch) return { type: 'exact', url: cleanUrl(SCRAPED_URLS[exactishMatch]), key: exactishMatch };

    // 2. Number Match
    const numberMatch = productName.match(/N°\s*(\d+)/i);
    if (numberMatch) {
        const num = numberMatch[1];
        const matchKey = keys.find(k => {
            return k.includes(`n ${num}`) || k.includes(`n${num}`) || k.endsWith(` ${num}`);
        });

        if (matchKey) return { type: 'number', url: cleanUrl(SCRAPED_URLS[matchKey]), key: matchKey };
    }

    return null;
};

// Run Test
PRODUCTS_TO_INSERT.forEach(p => {
    const result = findBestImage(p);
    console.log(`Product: ${p}`);
    if (result) {
        console.log(`  Match Type: ${result.type}`);
        console.log(`  Key: ${result.key}`);
        console.log(`  URL: ${result.url}`);
    } else {
        console.log(`  NO MATCH FOUND`);
    }
    console.log('---');
});
