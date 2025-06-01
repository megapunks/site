// fixPaths.ts
import fs from 'fs';
import path from 'path';

const directory = './app'; // اگر ساختار پروژه‌ات متفاوت بود، این مسیر رو تغییر بده
const fileTypes = ['.ts', '.tsx', '.js', '.jsx'];

function replaceInFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf8');
  const updated = content.replace(/(["'])\/app\//g, '$1/play/');
  if (content !== updated) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log('✔ updated:', filePath);
  }
}

function scanDir(dir: string) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (fileTypes.includes(path.extname(fullPath))) {
      replaceInFile(fullPath);
    }
  });
}

scanDir(directory);
