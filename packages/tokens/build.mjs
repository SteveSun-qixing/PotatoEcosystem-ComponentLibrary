import {
  ChipsStyleDictionaryEngine,
  assertChipsTokenName,
  createChipsTokenBuildManifest,
} from '@chips/token-engine';
import fs from 'node:fs/promises';
import path from 'node:path';

const outDir = path.resolve('dist');
const themeRoot = path.resolve('src/themes');

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function deepMerge(base, patch) {
  const out = { ...base };

  for (const [key, value] of Object.entries(patch)) {
    if (isObject(value) && isObject(out[key])) {
      out[key] = deepMerge(out[key], value);
    } else {
      out[key] = value;
    }
  }

  return out;
}

function collectTokenNames(node, pathStack = [], out = new Set()) {
  if (!isObject(node)) {
    return out;
  }

  if ('value' in node) {
    out.add(pathStack.join('-'));
    return out;
  }

  for (const [key, value] of Object.entries(node)) {
    collectTokenNames(value, [...pathStack, key], out);
  }

  return out;
}

async function readJson(filepath) {
  const content = await fs.readFile(filepath, 'utf8');
  return JSON.parse(content);
}

async function validateContract(baseTokens, themeId, themeTokens) {
  const contractPath = path.resolve('src/schema/required-vars.json');
  const contract = await readJson(contractPath);
  const merged = deepMerge(baseTokens, themeTokens);
  const available = collectTokenNames(merged);
  for (const tokenName of available) {
    const dotted = tokenName.replace(/-/g, '.');
    assertChipsTokenName(dotted);
  }
  const missing = contract.requiredVars.filter((name) => !available.has(name));

  if (missing.length > 0) {
    throw new Error(`Theme "${themeId}" missing required token variables: ${missing.join(', ')}`);
  }
}

async function buildCss(source, selector, file) {
  const sd = new ChipsStyleDictionaryEngine({
    source,
    platforms: {
      css: {
        transformGroup: 'css',
        buildPath: 'dist/css/',
        files: [
          {
            destination: file,
            format: 'css/variables',
            options: { selector },
          },
        ],
      },
    },
  });

  await sd.buildAllPlatforms();
}

async function main() {
  await fs.rm(outDir, { recursive: true, force: true });

  const baseTokens = await readJson(path.resolve('src/base/sys.json'));

  await buildCss(['src/base/*.json'], ':root', 'base.css');

  const themeDirs = (await fs.readdir(themeRoot, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const themes = [];

  for (const themeId of themeDirs) {
    const themeFile = path.resolve(`src/themes/${themeId}/theme.json`);
    const themeTokens = await readJson(themeFile);
    await validateContract(baseTokens, themeId, themeTokens);

    const cssFile = `theme-${themeId}.css`;

    await buildCss([`src/themes/${themeId}/*.json`], `.chips-theme-${themeId}`, cssFile);

    themes.push({
      id: themeId,
      css: `./css/${cssFile}`,
    });
  }

  await fs.writeFile(
    path.join(outDir, 'manifest.json'),
    JSON.stringify(createChipsTokenBuildManifest({
      version: '1.0.0',
      baseCss: './css/base.css',
      themes,
    }), null, 2),
  );
}

await main();
