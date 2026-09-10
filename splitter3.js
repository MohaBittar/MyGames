const fs = require('fs');
const content = fs.readFileSync('C:/Users/moham/Downloads/websites/games/original_flat.txt', 'utf8');

// Strategy: Find every position where a newline SHOULD exist
// In the original file, each line ended and the next line started with indentation
// The pattern is: end-of-statement + indentation + start-of-next-statement

let lines = [];
let currentLine = '';

for (let i = 0; i < content.length; i++) {
    currentLine += content[i];
    
    if (i >= content.length - 1) {
        lines.push(currentLine);
        break;
    }
    
    const ch = content[i];
    const rest = content.substring(i + 1);
    
    // Check if we should break here
    let shouldBreak = false;
    
    if (ch === ';') {
        // After semicolon, check if next content starts a new line
        const m = rest.match(/^(\s{0,40})/);
        if (m && m[1].length >= 0) {
            // Check if what follows the whitespace is a statement/keyword start
            const afterWs = rest.substring(m[1].length);
            if (afterWs.match(/^(const |let |var |function |class |return |if |else |for |while |switch |case |break |continue |this\.|document\.|player\.|ctx\.|cx\.|\/\*|\/\/|<\/|<[a-z!]|var |typeof |new |throw |try |catch )/)) {
                shouldBreak = true;
            }
        }
    }
    else if (ch === '}') {
        const m = rest.match(/^(\s{0,40})/);
        if (m) {
            const afterWs = rest.substring(m[1].length);
            if (afterWs.match(/^(const |let |var |function |class |return |if |else |else if |for |while |switch |case |break |\/\*|\/\/|<\/|<[a-z]|var |else |catch )/)) {
                shouldBreak = true;
            }
            // Also break before closing braces at lower indent
            if (afterWs.match(/^\}/) && m[1].length < 40) {
                shouldBreak = true;
            }
        }
    }
    else if (ch === '>') {
        // HTML tag close followed by indentation + new tag
        const m = rest.match(/^(\s{2,40})/);
        if (m) {
            const afterWs = rest.substring(m[1].length);
            if (afterWs.match(/^<[a-z!/]/)) {
                shouldBreak = true;
            }
        }
        // Also before </ closing tag
        if (rest.match(/^\s*<\//)) {
            shouldBreak = true;
        }
    }
    
    if (shouldBreak) {
        lines.push(currentLine);
        currentLine = '';
    }
}

// Post-process: find lines that are too long and try to split them further
let finalLines = [];
for (const line of lines) {
    if (line.length > 200 && !line.match(/tiles:\[/) && !line.match(/^\s*\d+,\d+/)) {
        // Try to split on internal ; patterns
        const parts = line.split(/(?<=;)\s{4,}/);
        if (parts.length > 1) {
            finalLines.push(...parts);
        } else {
            finalLines.push(line);
        }
    } else {
        finalLines.push(line);
    }
}

fs.writeFileSync('C:/Users/moham/Downloads/websites/games/original_v2.txt', finalLines.join('\n'), 'utf8');
console.log('Lines: ' + finalLines.length);
// Show some stats
const longLines = finalLines.filter(l => l.length > 100);
console.log('Lines > 100 chars: ' + longLines.length);
const veryLong = finalLines.filter(l => l.length > 300);
console.log('Lines > 300 chars: ' + veryLong.length);
console.log('First 5:');
for (let i = 0; i < Math.min(5, finalLines.length); i++) {
    console.log(`  ${i+1}: (${finalLines[i].length}) ${finalLines[i].substring(0, 80)}`);
}
console.log('Last 5:');
for (let i = Math.max(0, finalLines.length - 5); i < finalLines.length; i++) {
    console.log(`  ${i+1}: (${finalLines[i].length}) ${finalLines[i].substring(0, 80)}`);
}
