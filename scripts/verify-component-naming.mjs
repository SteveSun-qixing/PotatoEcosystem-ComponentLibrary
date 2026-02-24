import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const srcDir = path.join(repoRoot, 'packages', 'component-library', 'src', 'components');
const forbiddenPatterns = [/\bArk[A-Za-z0-9_]*/g, /@ark-ui\/react/g];
const requiredExportPrefix = /^export\s+(function|const)\s+Chips[A-Za-z0-9_]+/m;

for (const file of fs.readdirSync(srcDir)) {
  if (!file.endsWith('.tsx')) {
    continue;
  }

  const fullPath = path.join(srcDir, file);
  const source = fs.readFileSync(fullPath, 'utf8');

  for (const pattern of forbiddenPatterns) {
    const hit = source.match(pattern);
    if (hit) {
      throw new Error(`Forbidden upstream naming in ${file}: ${hit[0]}`);
    }
  }

  if (file === 'ChipsFileUpload.tsx') {
    continue;
  }

  if (!requiredExportPrefix.test(source)) {
    throw new Error(`Component export must use Chips prefix in ${file}`);
  }
}

console.log('component-naming-guard:ok');
