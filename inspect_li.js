const fs = require('fs');
const html = fs.readFileSync('temp_zellige_list.html', 'utf8');

// Find the index of the target
const target = 'vente-wines-purple';
const idx = html.indexOf(target);

if (idx === -1) {
    console.log('Target not found');
} else {
    // Search backwards for opening <li>
    const start = html.lastIndexOf('<li', idx);
    // Search forwards for closing </li>
    const end = html.indexOf('</li>', idx);

    if (start !== -1 && end !== -1) {
        console.log(html.substring(start, end + 5)); // +5 for </li>
    } else {
        console.log('Could not find wrapping li');
        console.log(html.substring(idx - 200, idx + 200));
    }
}
