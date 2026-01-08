const fs = require('fs');

const filenames = ['temp_zellige_list.html', 'temp_page_2.html', 'temp_page_3.html', 'temp_page_4.html', 'temp_page_5.html', 'temp_page_6.html'];

const found = {};

filenames.forEach(file => {
    if (!fs.existsSync(file)) return;
    const html = fs.readFileSync(file, 'utf8');

    // Split by product item to ensure we process one block at a time
    const items = html.split('<li class="products__item">');

    items.forEach(item => {
        // skip garbage before first item
        if (!item.includes('href') || !item.includes('img src')) return;

        const hrefMatch = item.match(/href="([^"]+)"/);
        const srcMatch = item.match(/img src="([^"]+)"/);

        if (hrefMatch && srcMatch) {
            const href = hrefMatch[1];
            const src = srcMatch[1];

            const key = href.replace('vente-', '').replace(/_\d+\.html.*/, '').replace(/-/g, ' ');
            // Fix relative path: ../produits -> /produits (already has a leading dot usually)
            // The src is like "../produits/big/..." OR "produits/..." if it came from loadres.php??
            // Let's normalize. 
            // loadres.php result likely returns straight HTML.
            // Let's assume the relative path is from the calling page context.

            let fullSrc = src;
            if (!src.startsWith('http')) {
                fullSrc = 'https://www.zellige-maroc.com/en/' + src;
            }

            found[key] = fullSrc;
            console.log(`${key} -> ${fullSrc}`);
        }
    });
});

fs.writeFileSync('extracted_list_comprehensive.json', JSON.stringify(found, null, 2));
console.log('Saved comprehensive list.');
