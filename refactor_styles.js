const fs = require('fs');
const path = require('path');

const featuresDir = path.join(__dirname, 'app', 'features');

function getFiles(dir) {
    if (!fs.existsSync(dir)) return [];
    let results = [];
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getFiles(filePath));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(filePath);
        }
    }
    return results;
}

function extractStyles(content) {
    const startRegex = /const\s+styles\s*=\s*StyleSheet\.create\s*\(\s*\{/g;
    const match = startRegex.exec(content);
    if (!match) return null;

    const startIndex = match.index;
    const bracketStart = content.indexOf('{', startIndex);
    
    let braceCount = 0;
    let i = bracketStart;
    let inString = false;
    let stringChar = '';

    for (; i < content.length; i++) {
        const char = content[i];
        if (!inString) {
            if (char === "'" || char === '"' || char === '`') {
                inString = true;
                stringChar = char;
            } else if (char === '{') {
                braceCount++;
            } else if (char === '}') {
                braceCount--;
                if (braceCount === 0) {
                    // check if the next characters are );
                    let j = i + 1;
                    while (j < content.length && /\s/.test(content[j])) j++;
                    if (content[j] === ')') {
                        let k = j + 1;
                        while (k < content.length && /\s/.test(content[k])) k++;
                        if (content[k] === ';') {
                            i = k;
                        } else {
                            i = j;
                        }
                    }
                    break;
                }
            }
        } else {
            if (char === stringChar && content[i - 1] !== '\\') {
                inString = false;
            }
        }
    }

    const endIndex = i + 1;
    const extracted = content.substring(startIndex, endIndex);
    const remaining = content.substring(0, startIndex) + content.substring(endIndex);
    return { extracted, remaining };
}

function toCamelCase(str) {
    return str.replace(/^([A-Z])/, (match, p1) => p1.toLowerCase());
}

const features = fs.readdirSync(featuresDir);

for (const feature of features) {
    const featurePath = path.join(featuresDir, feature);
    if (!fs.statSync(featurePath).isDirectory()) continue;

    const cssDir = path.join(featurePath, 'css');
    if (!fs.existsSync(cssDir)) {
        fs.mkdirSync(cssDir);
    }
    const stylesFilePath = path.join(cssDir, 'styles.tsx');
    let stylesContent = fs.existsSync(stylesFilePath) ? fs.readFileSync(stylesFilePath, 'utf8') : 'import { StyleSheet } from "react-native";\n\n';

    if (!stylesContent.includes('import { StyleSheet }')) {
        stylesContent = 'import { StyleSheet } from "react-native";\n\n' + stylesContent;
    }

    const componentsDir = path.join(featurePath, 'components');
    const screensDir = path.join(featurePath, 'screens');

    const files = [...getFiles(componentsDir), ...getFiles(screensDir)];

    let changedAny = false;

    for (const file of files) {
        let content = fs.readFileSync(file, 'utf8');
        const fileName = path.basename(file, '.tsx');
        const styleName = toCamelCase(fileName) + 'Styles';

        const result = extractStyles(content);
        if (result) {
            let { extracted, remaining } = result;

            // Remove empty lines left behind where styles were
            remaining = remaining.replace(/\n\s*\n\s*\n/g, '\n\n');

            // Format extracted styles to use named export
            let newStyleStr = extracted.replace(/const\s+styles\s*=\s*StyleSheet\.create/, `export const ${styleName} = StyleSheet.create`);
            
            stylesContent += newStyleStr + '\n\n';

            // Calculate relative path for import
            const relativePathToCss = path.relative(path.dirname(file), cssDir).replace(/\\/g, '/');
            const importStatement = `import { ${styleName} as styles } from "${relativePathToCss}/styles";\n`;

            // Insert import statement after the last import
            const lastImportIndex = remaining.lastIndexOf('import ');
            if (lastImportIndex !== -1) {
                const endOfLastImport = remaining.indexOf('\n', lastImportIndex);
                remaining = remaining.substring(0, endOfLastImport + 1) + importStatement + remaining.substring(endOfLastImport + 1);
            } else {
                remaining = importStatement + remaining;
            }

            // Remove StyleSheet from react-native import if not used elsewhere
            if (!remaining.includes('StyleSheet.')) {
                remaining = remaining.replace(/,\s*StyleSheet\b|\bStyleSheet\s*,\s*/, '');
                // Also clean up if it was the only import (import { } from 'react-native')
                remaining = remaining.replace(/import\s*\{\s*\}\s*from\s*['"]react-native['"];?\n/, '');
            }

            fs.writeFileSync(file, remaining, 'utf8');
            changedAny = true;
            console.log(`Refactored ${file}`);
        }
    }

    if (changedAny) {
        fs.writeFileSync(stylesFilePath, stylesContent.trim() + '\n', 'utf8');
        console.log(`Updated ${stylesFilePath}`);
    }
}
