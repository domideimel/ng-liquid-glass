// Tests the built ng-add schematic against a fresh Angular CLI workspace. Run by `nx run ng-liquid-glass:test-schematics`.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { beforeEach, describe, it } from 'node:test';

const require = createRequire(import.meta.url);
// CommonJS package without an exports map for its subpath, so required rather than imported.
const { SchematicTestRunner } = require('@angular-devkit/schematics/testing');
const collection = require.resolve('../../../../dist/packages/ng-liquid-glass/schematics/collection.json');
const runner = new SchematicTestRunner('ng-liquid-glass', collection);
const angularRoot = dirname(require.resolve('@schematics/angular/package.json'));
const angular = new SchematicTestRunner('@schematics/angular', join(angularRoot, 'collection.json'));

async function createApp({ standalone = true, styles = 'css' } = {}) {
  const workspace = await angular.runSchematic('workspace', { name: 'ws', newProjectRoot: 'projects', version: '22.2.0' });
  return angular.runSchematic('application', { name: 'app', standalone, style: styles, zoneless: true, ssr: false }, workspace);
}

const STYLES = 'projects/app/src/styles.css';

describe('ng-add', () => {
  let tree;
  beforeEach(async () => {
    tree = await createApp();
  });

  it('adds the theme right after the Tailwind import', async () => {
    tree.overwrite(STYLES, "@import 'tailwindcss';\n\nbody { margin: 0; }\n");
    const result = await runner.runSchematic('ng-add', { project: 'app' }, tree);
    assert.equal(
      result.readText(STYLES),
      "@import 'tailwindcss';\n@import '@domideimel/ng-liquid-glass/theme.css';\n\nbody { margin: 0; }\n",
    );
  });

  it('adds Tailwind and the theme when Tailwind is missing, and warns', async () => {
    const messages = [];
    runner.logger.subscribe((entry) => messages.push(entry));
    const result = await runner.runSchematic('ng-add', {}, tree);
    assert.match(result.readText(STYLES), /^@import 'tailwindcss';\n@import '@domideimel\/ng-liquid-glass\/theme.css';\n/);
    assert.ok(messages.some((entry) => entry.level === 'warn' && entry.message.includes("Tailwind CSS v4 isn't set up")));
  });

  it('is idempotent', async () => {
    tree.overwrite(STYLES, "@import 'tailwindcss';\n");
    const once = await runner.runSchematic('ng-add', { project: 'app' }, tree);
    const twice = await runner.runSchematic('ng-add', { project: 'app' }, once);
    assert.equal(twice.readText(STYLES).match(/theme\.css/g)?.length, 1);
  });

  it('provides a built-in translation in a standalone app', async () => {
    const result = await runner.runSchematic('ng-add', { project: 'app', locale: 'de' }, tree);
    const config = result.readText('projects/app/src/app/app.config.ts');
    assert.match(config, /import \{ (provideLgI18n, LG_I18N_DE|LG_I18N_DE, provideLgI18n) \} from '@domideimel\/ng-liquid-glass';/);
    assert.match(config, /provideLgI18n\(LG_I18N_DE\)/);
  });

  it('provides a built-in translation in an NgModule app', async () => {
    const moduleTree = await createApp({ standalone: false });
    const result = await runner.runSchematic('ng-add', { project: 'app', locale: 'fr' }, moduleTree);
    const module = result.readText('projects/app/src/app/app-module.ts');
    assert.match(module, /provideLgI18n\(LG_I18N_FR\)/);
  });

  it('adds no provider for English, the default', async () => {
    const result = await runner.runSchematic('ng-add', { project: 'app', locale: 'en' }, tree);
    assert.doesNotMatch(result.readText('projects/app/src/app/app.config.ts'), /provideLgI18n/);
  });

  it('warns when the app has no CSS stylesheet', async () => {
    const scssTree = await createApp({ styles: 'scss' });
    const messages = [];
    runner.logger.subscribe((entry) => messages.push(entry));
    await runner.runSchematic('ng-add', { project: 'app' }, scssTree);
    assert.ok(messages.some((entry) => entry.level === 'warn' && entry.message.includes('No global CSS stylesheet')));
  });

  it('rejects an unknown project', async () => {
    await assert.rejects(runner.runSchematic('ng-add', { project: 'nope' }, tree), /Project "nope" does not exist/);
  });
});
