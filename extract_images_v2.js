const fs = require('fs');

const html = fs.readFileSync('temp_zellige_list.html', 'utf8');

// Looking for <a href="vente-..."> <img src="..."> </a> structure
const regex = /<a[^>]+href="([^"]+)"[^>]*>[\s\S]*?<img[^>]+src="([^"]+)"/g;

let match;
const found = {};

while ((match = regex.exec(html)) !== null) {
    const href = match[1];
    const src = match[2];

    // Clean keys
    const key = href.replace('vente-', '').replace(/_\d+\.html.*/, '').replace(/-/g, ' ');
    // Clean src
    // usually starts with "../"
    const fullSrc = 'https://www.zellige-maroc.com/en/' + src;

    // We want to see the raw values first
    console.log(`${key} | ${href} | ${src}`);
    found[key] = src;
}
fs.writeFileSync('extracted_list.json', JSON.stringify(found, null, 2));
