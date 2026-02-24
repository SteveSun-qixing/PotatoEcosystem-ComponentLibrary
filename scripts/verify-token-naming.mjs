import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const tokenRoot = path.join(repoRoot, 'packages', 'tokens', 'src');

const readJson = (target) => JSON.parse(fs.readFileSync(target, 'utf8'));

const base = readJson(path.join(tokenRoot, 'base', 'sys.json'));
if (!base.chips || !base.chips.sys || !base.chips.comp) {
  throw new Error('Token root must contain chips.sys and chips.comp');
}

const contract = readJson(path.join(tokenRoot, 'schema', 'required-vars.json'));
for (const key of contract.requiredVars) {
  if (!key.startsWith('chips-')) {
    throw new Error(`Required var must use chips- prefix: ${key}`);
  }
}

console.log('token-naming-guard:ok');
