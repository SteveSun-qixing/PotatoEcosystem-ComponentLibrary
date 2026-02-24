// @vitest-environment node
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

interface ThemeComponentContract {
  name: string;
  exportName: string;
  sourceFile: string;
  file: string;
  interfacePoints: {
    scope: string;
    classSelectors: string[];
    parts: string[];
  };
  requiredSelectors: string[];
  minVariableRefs: number;
}

interface ThemeInterfaceContract {
  version: string;
  generatedAt: string;
  description: string;
  placeholderMarkers: string[];
  components: ThemeComponentContract[];
}

const packageRoot = process.cwd();
const workspaceRoot = path.resolve(packageRoot, '..', '..', '..');
const contractPath = path.join(packageRoot, 'contracts', 'theme-interface-points.contract.json');
const sourceIndexPath = path.join(packageRoot, 'src', 'index.ts');
const sourceComponentsDir = path.join(packageRoot, 'src', 'components');

const readContract = (filePath: string): ThemeInterfaceContract =>
  JSON.parse(fs.readFileSync(filePath, 'utf-8')) as ThemeInterfaceContract;

const getExportedComponentNames = (): string[] => {
  const source = fs.readFileSync(sourceIndexPath, 'utf-8');
  const matches = source.matchAll(/export\s+\{[^}]*\b(Chips[A-Za-z0-9]+)\b[^}]*\}\s+from '\.\/components\/[A-Za-z0-9]+';/g);
  return Array.from(matches, (match) => match[1]).filter((name): name is string => Boolean(name)).sort();
};

describe('Theme Interface Contract Source', () => {
  const contract = readContract(contractPath);

  it('matches one-to-one with current component exports', () => {
    const exportedComponents = getExportedComponentNames();
    const contractExports = contract.components.map((component) => component.exportName).sort();

    expect(contract.components.length).toBe(13);
    expect(contractExports).toEqual(exportedComponents);
  });

  it('keeps class/data-part/data-scope anchors aligned with component source files', () => {
    contract.components.forEach((component) => {
      const sourcePath = path.join(sourceComponentsDir, component.sourceFile);
      expect(fs.existsSync(sourcePath), `${component.sourceFile} should exist`).toBe(true);

      const source = fs.readFileSync(sourcePath, 'utf-8');

      component.interfacePoints.classSelectors.forEach((selector) => {
        expect(
          source.includes(selector.replace('.', '')),
          `${component.sourceFile} should expose class anchor ${selector}`
        ).toBe(true);
      });

      const scope = component.interfacePoints.scope;
      const hasScopeAnchor = source.includes(`data-scope="${scope}"`) || source.includes(`chipsScope = '${scope}'`);
      expect(hasScopeAnchor, `${component.sourceFile} should expose scope anchor ${scope}`).toBe(true);

      component.interfacePoints.parts.forEach((part) => {
        expect(source.includes(`data-part="${part}"`), `${component.sourceFile} should expose data-part ${part}`).toBe(
          true
        );
      });
    });
  });

  it('keeps default/template/official theme contracts synchronized', () => {
    const themeRepos = [
      'chips-theme-default',
      'chips-template-theme',
      'Chips-official-theme-obsidian-business-theme',
    ];

    const normalize = (data: ThemeInterfaceContract) => ({
      version: data.version,
      components: data.components,
      placeholderMarkers: data.placeholderMarkers,
    });

    themeRepos.forEach((repo) => {
      const themeContractPath = path.join(workspaceRoot, repo, 'contracts', 'theme-interface.contract.json');
      expect(fs.existsSync(themeContractPath), `${repo} contract should exist`).toBe(true);
      const themeContract = readContract(themeContractPath);
      expect(normalize(themeContract)).toEqual(normalize(contract));
    });
  });
});
