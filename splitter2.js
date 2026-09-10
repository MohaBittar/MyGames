const fs = require('fs');
const content = fs.readFileSync('C:/Users/moham/Downloads/websites/games/original_flat.txt', 'utf8');

let result = '';
let i = 0;
while (i < content.length) {
    result += content[i];
    const next = i < content.length - 1 ? content[i + 1] : '';
    const rem = content.substring(i + 1);
    
    // Always insert newline after these patterns
    if (content[i] === ';' && rem.length > 0) {
        // Check if next char starts a new line (indent + keyword/tag/comment)
        if (rem.match(/^[\r\n]/)) { /* already has newline */ }
        else if (rem.match(/^\s{0,6}(const |let |var |function |class |return |if |else |for |while |switch |case |break |this\.|document\.|player\.|ctx\.|cx\.|\/\*|\/\/|<\/|<[a-z]|var )/)) {
            result += '\n';
        }
        else if (rem.match(/^\s{0,6}\}/)) {
            result += '\n';
        }
    }
    // After } new line
    else if (content[i] === '}' && rem.length > 0) {
        if (rem.match(/^\s{0,6}(const |let |var |function |class |return |if |else |for |while |switch |case |break |\/\*|\/\/|<\/|<[a-z]|var |else )/)) {
            result += '\n';
        }
        else if (rem.match(/^\s{0,6}\}/)) {
            result += '\n';
        }
    }
    // Before section markers /* ====
    else if (content[i] === ' ' && content.substring(i, i+5) === ' ===' && i > 0 && content[i-1] === '/') {
        // Make sure there's a newline before this
        if (result.length > 0 && result[result.length-1] !== '\n') {
            result += '\n';
        }
    }
    // After HTML > before new tag or text
    else if (content[i] === '>') {
        if (rem.match(/^\s{4,}</) || rem.match(/^\s{4,}[A-Z]/) || rem.match(/^\s{4,}document/)) {
            result += '\n';
        }
    }
    // After HTML > before </ closing tag at lower indent
    else if (content[i] === '>') {
        if (rem.match(/^<\/(div|span|button|canvas|script|style|head|body|html)/)) {
            result += '\n';
        }
    }
    // Newline before <style>, <body>, <script>, </style>, </head>, </body>, </html>
    else if (content[i] === '<' && (rem.startsWith('style') || rem.startsWith('body') || rem.startsWith('script') || rem.startsWith('/style') || rem.startsWith('/head') || rem.startsWith('/body') || rem.startsWith('/html'))) {
        if (result.length > 0 && result[result.length-1] !== '\n') {
            result += '\n';
        }
    }
    // Before CSS property (8 spaces + property name after {)
    else if (content[i] === '{' && rem.match(/^\s{8}[a-z-]+\s*:/) && !rem.match(/^\s{8}atk|^\s{8}def|^\s{8}hp|^\s{8}mp/)) {
        result += '\n';
    }
    // After } in CSS before next selector
    else if (content[i] === '}' && rem.match(/^\s{4}(@|[.#a-z])/) && !rem.match(/^\s{4}(atk|def|hp|mp)/)) {
        result += '\n';
    }
    // Before CSS comment
    else if (content[i] === '/' && rem.startsWith('*') && i > 0 && content[i-1] !== ' ' && content[i-1] !== '\n') {
        if (result.length > 0 && result[result.length-1] !== '\n') {
            result += '\n';
        }
    }
    
    i++;
}

fs.writeFileSync('C:/Users/moham/Downloads/websites/games/original_reconstructed.txt', result, 'utf8');
const lines = result.split('\n');
console.log('Lines: ' + lines.length);
console.log('Line 1: ' + lines[0].substring(0, 80));
console.log('Line 2: ' + lines[1].substring(0, 80));
console.log('Line 3: ' + lines[2].substring(0, 80));
