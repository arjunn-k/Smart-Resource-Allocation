import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directoryPath = path.join(__dirname, 'src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else if (dirPath.endsWith('.jsx')) {
      callback(path.join(dir, f));
    }
  });
}

const replacements = [
  { from: /\btext-white\b/g, to: 'text-slate-900 dark:text-white' },
  { from: /\btext-slate-100\b/g, to: 'text-slate-800 dark:text-slate-100' },
  { from: /\btext-slate-200\b/g, to: 'text-slate-700 dark:text-slate-200' },
  { from: /\btext-slate-300\b/g, to: 'text-slate-600 dark:text-slate-300' },
  { from: /\btext-slate-400\b/g, to: 'text-slate-500 dark:text-slate-400' },
  { from: /\btext-slate-950\b/g, to: 'text-white dark:text-slate-950' },
  { from: /\bbg-white\/5\b/g, to: 'bg-black/5 dark:bg-white/5' },
  { from: /\bbg-white\/8\b/g, to: 'bg-black/[0.04] dark:bg-white/8' },
  { from: /\bbg-white\/10\b/g, to: 'bg-black/10 dark:bg-white/10' },
  { from: /\bbg-white\/15\b/g, to: 'bg-black/[0.05] dark:bg-white/15' },
  { from: /\bbg-white\/\[0\.04\]\b/g, to: 'bg-black/[0.02] dark:bg-white/[0.04]' },
  { from: /\bborder-white\/10\b/g, to: 'border-black/10 dark:border-white/10' },
  { from: /\bborder-white\/8\b/g, to: 'border-black/[0.08] dark:border-white/8' },
  { from: /\bborder-white\/15\b/g, to: 'border-black/[0.15] dark:border-white/15' },
  { from: /\bborder-white\/20\b/g, to: 'border-black/20 dark:border-white/20' },
  { from: /\bbg-black\/20\b/g, to: 'bg-black/5 dark:bg-black/20' },
  { from: /\bbg-black\/50\b/g, to: 'bg-white/50 dark:bg-black/50' },
  { from: /\bbg-slate-900\b/g, to: 'bg-white dark:bg-slate-900' },
  { from: /\bbg-slate-950\/95\b/g, to: 'bg-white/95 dark:bg-slate-950/95' },
];

walkDir(directoryPath, (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  replacements.forEach(r => {
    const fromRegexStr = r.from.source.replace('\\b', '(?<!dark:)\\b');
    const safeRegex = new RegExp(fromRegexStr, 'g');
    content = content.replace(safeRegex, r.to);
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated files: ${filePath}`);
  }
});
