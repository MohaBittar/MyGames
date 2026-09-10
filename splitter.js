const fs = require('fs');
const content = fs.readFileSync('C:/Users/moham/Downloads/websites/games/original_flat.txt', 'utf8');

// The original file used consistent indentation patterns
// Split based on: new lines start with whitespace followed by code tokens
// or after closing braces/brackets followed by new content

let result = '';
let i = 0;
while (i < content.length) {
    result += content[i];
    
    // Check if we should insert a newline after this character
    if (i < content.length - 1) {
        const remaining = content.substring(i + 1);
        
        // After ; followed by newline-indent pattern
        if (content[i] === ';' && remaining.match(/^\s{4}(const |let |var |function |class |return |if |else |for |while |switch |case |break |this\.|document\.|player\.|ctx\.|cx\.|\/\*|\/\/|\}|if\()/)) {
            result += '\n';
        }
        // After } followed by content at same or lower indent  
        else if (content[i] === '}' && remaining.match(/^\s{0,4}(const |let |var |function |class |return |if |else |for |while |\/\*|\/\/|\}|else)/)) {
            result += '\n';
        }
        // Before section comments
        else if (content[i] === '/' && remaining.startsWith('* =') && i > 0 && content[i-1] === '\n') {
            // already has newline
        }
        else if (content[i] !== '\n' && content.substring(i, i+7) === '/* ====' && i > 0 && content[i-1] !== '\n') {
            result += '\n';
        }
        // After HTML closing tags followed by new tags
        else if ((content[i] === '>' || content[i] === ';') && remaining.match(/^\s{4,}<\//)) {
            result += '\n';
        }
        // CSS: after } followed by @ or selector
        else if (content[i] === '}' && remaining.match(/^\s{0,4}(@|\.|#|[a-z])/)) {
            result += '\n';
        }
        // After line with only spaces + }
        else if (content[i] === ';' && remaining.match(/^\s{4,}\}/)) {
            result += '\n';
        }
        // Before opening of tile arrays (these are long)
        else if (content.substring(i, i+7) === 'tiles:[' && i > 0 && content[i-1] !== '\n') {
            result += '\n';
        }
        // Before playerStart, chests, npcs, hazards
        else if (remaining.match(/^\s*playerStart/) && content[i] === ',') {
            result += '\n';
        }
        else if (remaining.match(/^\s*chests:/) && content[i] === ',') {
            result += '\n';
        }
        else if (remaining.match(/^\s*npcs:/) && content[i] === ',') {
            result += '\n';
        }
        else if (remaining.match(/^\s*hazards:/) && content[i] === ',') {
            result += '\n';
        }
    }
    i++;
}

fs.writeFileSync('C:/Users/moham/Downloads/websites/games/original_reconstructed.txt', result, 'utf8');
const lines = result.split('\n');
console.log('Reconstructed lines: ' + lines.length);
console.log('First 3: ' + lines.slice(0, 3).map(l => l.substring(0, 60)).join(' | '));
console.log('Last 3: ' + lines.slice(-3).map(l => l.substring(0, 60)).join(' | '));
