const fs = require('fs');
const html = fs.readFileSync('temp_zellige_list.html', 'utf8');
const index = html.indexOf('vente-wines-purple');
if (index !== -1) {
    // Print 500 chars before and after
    console.log(html.substring(index - 500, index + 500));
} else {
    console.log("Not found");
}
