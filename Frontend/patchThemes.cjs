const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src');

const replaceInFile = (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');

    // Make text respond to theme:
    content = content.replace(/text-white/g, 'text-foreground');
    content = content.replace(/text-zinc-300/g, 'text-foreground/80');
    content = content.replace(/text-zinc-400/g, 'text-foreground/60');
    content = content.replace(/text-zinc-500/g, 'text-foreground/50');
    
    // Background replacements:
    content = content.replace(/bg-\[#030303\]/g, 'bg-background');
    content = content.replace(/bg-\[#0d0d0d\]/g, 'bg-surface');
    content = content.replace(/bg-\[#161616\]/g, 'bg-[var(--card-hover)]');
    content = content.replace(/bg-\[#111624\]/g, 'bg-surface');
    content = content.replace(/bg-\[#1b1224\]/g, 'bg-surface');
    content = content.replace(/bg-\[#0f1d1a\]/g, 'bg-surface');
    content = content.replace(/bg-\[#1a1c12\]/g, 'bg-surface');
    content = content.replace(/bg-black/g, 'bg-background');

    // Borders:
    content = content.replace(/border-white\/5/g, 'border-foreground/5');
    content = content.replace(/border-white\/10/g, 'border-foreground/10');
    content = content.replace(/bg-white\/2/g, 'bg-foreground/5');
    content = content.replace(/bg-white\/5/g, 'bg-foreground/5');
    content = content.replace(/bg-white\/10/g, 'bg-foreground/10');
    
    // Glass specifically (though index.css handles `.glass` directly)
    // we just let the classes apply logic

    fs.writeFileSync(filePath, content);
};

const walk = (d) => {
    const items = fs.readdirSync(d);
    for (const item of items) {
        const fullPath = path.join(d, item);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            replaceInFile(fullPath);
        }
    }
};

walk(dir);
console.log('Files patched for theming.');
