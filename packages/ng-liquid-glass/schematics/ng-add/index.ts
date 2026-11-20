import { chain, noop, SchematicsException, type Rule, type SchematicContext, type Tree } from '@angular-devkit/schematics';
import { addRootProvider, readWorkspace, type WorkspaceDefinition } from '@schematics/angular/utility';

export interface NgAddOptions {
  project?: string;
  locale?: 'en' | 'de' | 'fr' | 'es';
}

const PACKAGE = '@domideimel/ng-liquid-glass';
export const THEME_IMPORT = `@import '${PACKAGE}/theme.css';`;
const TAILWIND_IMPORT = /^\s*@import\s+['"]tailwindcss(?:\/[^'"]*)?['"][^;]*;[^\n]*$/m;
const LOCALES = { de: 'LG_I18N_DE', fr: 'LG_I18N_FR', es: 'LG_I18N_ES' } as const;

/** `ng add @domideimel/ng-liquid-glass`: theme import, Tailwind check and, optionally, translations. */
export function ngAdd(options: NgAddOptions): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    const workspace = await readWorkspace(tree);
    const projectName = options.project ?? onlyApplication(workspace.projects);
    const project = workspace.projects.get(projectName);
    if (!project) throw new SchematicsException(`Project "${projectName}" does not exist.`);
    if (project.extensions['projectType'] !== 'application') {
      throw new SchematicsException(`"${projectName}" is not an application; run ng add for the app that uses the components.`);
    }

    const stylesheet = globalStylesheet(tree, project.targets.get('build')?.options?.['styles']);
    if (stylesheet) addThemeImport(tree, context, stylesheet);
    else {
      context.logger.warn(`No global CSS stylesheet found for "${projectName}". Add to it:\n  @import 'tailwindcss';\n  ${THEME_IMPORT}`);
    }

    const locale = options.locale ?? 'en';
    return chain([
      locale === 'en'
        ? noop()
        : addRootProvider(
            projectName,
            ({ code, external }) => code`${external('provideLgI18n', PACKAGE)}(${external(LOCALES[locale], PACKAGE)})`,
          ),
      () => {
        context.logger.info(`ng-liquid-glass is set up for "${projectName}".`);
      },
    ]);
  };
}

function onlyApplication(projects: WorkspaceDefinition['projects']): string {
  const apps = [...projects].filter(([, project]) => project.extensions['projectType'] === 'application').map(([name]) => name);
  if (apps.length === 1 && apps[0]) return apps[0];
  throw new SchematicsException(
    apps.length === 0 ? 'The workspace has no application.' : `Choose the application with --project (${apps.join(', ')}).`,
  );
}

/** The first `.css` file in the build target's `styles` (strings or `{ input }` objects). */
function globalStylesheet(tree: Tree, styles: unknown): string | null {
  const entries = Array.isArray(styles) ? styles : [];
  for (const entry of entries) {
    const path: unknown = typeof entry === 'string' ? entry : (entry as { input?: unknown } | null)?.input;
    if (typeof path === 'string' && path.endsWith('.css') && tree.exists(path)) return path;
  }
  return null;
}

/** Adds the theme import right after Tailwind's import; idempotent. */
export function addThemeImport(tree: Tree, context: SchematicContext, path: string): void {
  const css = tree.readText(path);
  if (css.includes(`${PACKAGE}/theme.css`)) {
    context.logger.info(`${path} already imports the theme.`);
    return;
  }
  const tailwind = TAILWIND_IMPORT.exec(css);
  if (tailwind) {
    const end = tailwind.index + tailwind[0].length;
    tree.overwrite(path, `${css.slice(0, end)}\n${THEME_IMPORT}${css.slice(end)}`);
    context.logger.info(`Added the theme import to ${path}.`);
    return;
  }
  tree.overwrite(path, `@import 'tailwindcss';\n${THEME_IMPORT}\n${css}`);
  context.logger.warn(
    `Added Tailwind CSS and the theme to ${path}, but Tailwind CSS v4 isn't set up yet. ` +
      'Install it (npm install tailwindcss @tailwindcss/postcss postcss) and add .postcssrc.json: ' +
      '{ "plugins": { "@tailwindcss/postcss": {} } }. See https://tailwindcss.com/docs/installation/framework-guides/angular',
  );
}
