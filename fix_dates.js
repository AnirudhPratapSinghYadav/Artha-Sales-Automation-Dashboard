const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace import { formatDistanceToNow, parseISO } from 'date-fns';
  // with import { formatDistanceToNow } from 'date-fns'; \n import { safeFormatDistance, safeParseISO } from '@/lib/utils';
  
  if (content.includes('parseISO')) {
    // 1. Update imports
    if (!content.includes('safeParseISO')) {
      content = content.replace(/import {([^}]*)parseISO([^}]*)} from 'date-fns';/, "import {$1$2} from 'date-fns';\nimport { safeParseISO, safeFormatDistance } from '@/lib/utils';");
      // Clean up empty imports like import { , format } -> import { format }
      content = content.replace(/import {\s*,\s*/g, 'import { ');
      content = content.replace(/,\s*,/g, ',');
      content = content.replace(/import {\s*}\s*from 'date-fns';\n/, '');
    }

    // 2. Replace formatDistanceToNow(parseISO(x)) with safeFormatDistance(x)
    content = content.replace(/formatDistanceToNow\(\s*parseISO\(([^)]+)\)[^)]*\)/g, 'safeFormatDistance($1, { addSuffix: true })');

    // 3. Replace formatDistanceToNow(parseISO(x), options) with safeFormatDistance(x, options)
    // Wait, the regex above matches too broadly or narrowly. Let's do it simpler.
    content = content.replace(/formatDistanceToNow\(\s*parseISO\(([^)]+)\)\s*,\s*(\{.*?\})\s*\)/g, 'safeFormatDistance($1, $2)');
    content = content.replace(/formatDistanceToNow\(\s*parseISO\(([^)]+)\)\s*\)/g, 'safeFormatDistance($1)');

    // 4. Replace remaining parseISO with safeParseISO
    content = content.replace(/\bparseISO\b/g, 'safeParseISO');
    
    // 5. Fix double safeParseISO if we already did it
    content = content.replace(/safesafeParseISO/g, 'safeParseISO');
    
    // 6. Handle the format(safeParseISO(x), '...') cases properly by adding a fallback since format throws on null
    content = content.replace(/format\(safeParseISO\(([^)]+)\)\s*,\s*([^)]+)\)/g, "(safeParseISO($1) ? format(safeParseISO($1), $2) : 'Unknown')");

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

walk(path.join(__dirname, 'src', 'components'));
