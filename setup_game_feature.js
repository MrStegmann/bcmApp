const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'app', 'features', '_feature-template');
const destDir = path.join(__dirname, 'app', 'features', 'games');

function copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const files = fs.readdirSync(src);
    for (const file of files) {
        if (file === 'types.ts') continue; // Skip types.ts as user already defined it

        const srcPath = path.join(src, file);
        
        let newFileName = file;
        newFileName = newFileName.replace(/template/i, 'game');
        newFileName = newFileName.replace(/Template/i, 'Game');
        newFileName = newFileName.replace(/item/i, 'game');
        newFileName = newFileName.replace(/Item/i, 'Game');

        const destPath = path.join(dest, newFileName);

        if (fs.statSync(srcPath).isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else {
            let content = fs.readFileSync(srcPath, 'utf8');
            
            // Replace strings
            content = content.replace(/Template/g, 'Game');
            content = content.replace(/template/g, 'game');
            content = content.replace(/Item/g, 'Game');
            content = content.replace(/item/g, 'game');
            content = content.replace(/ITEMS/g, 'GAMES');

            fs.writeFileSync(destPath, content, 'utf8');
        }
    }
}

copyDirectory(sourceDir, destDir);
console.log('Feature created successfully.');
