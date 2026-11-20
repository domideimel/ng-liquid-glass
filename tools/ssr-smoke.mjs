// Server-side rendering smoke test: renders every component of the *built* library with @angular/platform-server
// and checks the HTML. Catches code that touches browser-only globals (window, document, matchMedia …) while
// rendering, which breaks SSR and prerendering in consuming apps.
// Run after `pnpm nx build ng-liquid-glass`: `node tools/ssr-smoke.mjs`.
import { registerHooks } from 'node:module';
import { pathToFileURL } from 'node:url';

// Resolve @domideimel/ng-liquid-glass[/<entry>] to the built package in dist/, as an installed package would.
const dist = pathToFileURL(`${process.cwd()}/dist/packages/ng-liquid-glass/fesm2022/`).href;
registerHooks({
  resolve(specifier, context, next) {
    const match = /^@domideimel\/ng-liquid-glass(?:\/(.+))?$/.exec(specifier);
    if (!match) return next(specifier, context);
    return next(`${dist}domideimel-ng-liquid-glass${match[1] ? `-${match[1]}` : ''}.mjs`, context);
  },
});

// JIT, so the partially compiled library and the test component below compile at runtime.
await import('@angular/compiler');
const { Component, provideZonelessChangeDetection, signal } = await import('@angular/core');
const { bootstrapApplication, provideClientHydration } = await import('@angular/platform-browser');
const { provideServerRendering, renderApplication } = await import('@angular/platform-server');

const lib = (entry) => import(`@domideimel/ng-liquid-glass${entry ? `/${entry}` : ''}`);
const core = await lib('');
const { LgAccordionItem } = await lib('accordion');
const { LgAlert } = await lib('alert');
const { LgAvatar } = await lib('avatar');
const { LgBadge } = await lib('badge');
const { LgBreadcrumbs } = await lib('breadcrumbs');
const { LgButton } = await lib('button');
const { LgCard } = await lib('card');
const { LgCombobox } = await lib('combobox');
const { LgDialog, LgDialogClose, LgDialogTitle } = await lib('dialog');
const forms = await lib('forms');
const layout = await lib('layout');
const { LgMenu, LgMenuItem, LgMenuTrigger } = await lib('menu');
const { LgPagination } = await lib('pagination');
const { LgMeter, LgProgress, LgSpinner } = await lib('progress');
const { LgSkeleton } = await lib('skeleton');
const { LgTab, LgTabPanel, LgTabs } = await lib('tabs');
const { LgToasterRegion } = await lib('toast');
const { LgTooltip } = await lib('tooltip');

class App {
  open = signal(false);
  tab = signal('one');
  page = signal(2);
  languages = ['English', 'German', 'Spanish'];
}
Component({
  selector: 'ssr-app',
  imports: [
    core.LgSkipLink,
    core.LgVisuallyHidden,
    LgAccordionItem,
    LgAlert,
    LgAvatar,
    LgBadge,
    LgBreadcrumbs,
    LgButton,
    LgCard,
    LgCombobox,
    LgDialog,
    LgDialogClose,
    LgDialogTitle,
    forms.LgFormField,
    forms.LgLabel,
    forms.LgHint,
    forms.LgInput,
    forms.LgCheckbox,
    forms.LgRadio,
    forms.LgSwitch,
    forms.LgSlider,
    forms.LgChoice,
    forms.LgFieldset,
    layout.LgGrid,
    layout.LgCol,
    layout.LgContainer,
    layout.LgStack,
    layout.LgCluster,
    LgMenu,
    LgMenuItem,
    LgMenuTrigger,
    LgPagination,
    LgMeter,
    LgProgress,
    LgSpinner,
    LgSkeleton,
    LgTab,
    LgTabPanel,
    LgTabs,
    LgToasterRegion,
    LgTooltip,
  ],
  template: `
    <a lgSkipLink href="#main">Skip to content</a>
    <main id="main" lgContainer>
      <div lgStack>
        <span lgVisuallyHidden>Hidden text</span>
        <details lgAccordionItem><summary>Question</summary><p>Answer</p></details>
        <lg-alert status="success" heading="Saved">Your changes are live.</lg-alert>
        <lg-avatar name="Ada Lovelace" />
        <span lgBadge variant="success">Active</span>
        <nav lgBreadcrumbs><ol><li><a href="/">Home</a></li><li><a aria-current="page">Settings</a></li></ol></nav>
        <div lgCluster>
          <button lgButton variant="primary" type="button">Primary</button>
          <button lgButton variant="accent" type="button" lgTooltip="Accent tooltip">Accent</button>
          <button lgButton type="button" [lgMenuTrigger]="menu">Options</button>
        </div>
        <lg-menu #menu><button lgMenuItem>Edit</button></lg-menu>
        <article lgCard>Card</article>
        <lg-form-field>
          <label lgLabel>Language</label>
          <lg-combobox [options]="languages" />
        </lg-form-field>
        <lg-form-field>
          <label lgLabel>Email</label>
          <lg-hint>We never share it.</lg-hint>
          <input lgInput type="email" />
        </lg-form-field>
        <fieldset lgFieldset>
          <legend>Options</legend>
          <label lgChoice><input type="checkbox" lgCheckbox /> Check</label>
          <label lgChoice><input type="radio" lgRadio name="r" /> Radio</label>
          <label lgChoice><input type="checkbox" lgSwitch /> Switch</label>
        </fieldset>
        <label for="volume">Volume</label>
        <input id="volume" type="range" lgSlider />
        <div lgGrid><div lgCol [span]="{ base: 12, md: 6 }">Column</div></div>
        <lg-pagination pageCount="10" [(page)]="page" />
        <progress lgProgress value="40" max="100" aria-label="Upload"></progress>
        <meter lgMeter value="0.6" aria-label="Storage"></meter>
        <lg-spinner />
        <lg-skeleton />
        <lg-tabs label="Sections" [(value)]="tab">
          <button lgTab value="one">One</button>
          <button lgTab value="two">Two</button>
          <div lgTabPanel value="one">Panel one</div>
          <div lgTabPanel value="two">Panel two</div>
        </lg-tabs>
        <lg-dialog [(open)]="open"><h2 lgDialogTitle>Title</h2><button lgButton lgDialogClose>Close</button></lg-dialog>
        <lg-toaster />
      </div>
    </main>
  `,
})(App);

const html = await renderApplication(
  (context) =>
    bootstrapApplication(
      App,
      { providers: [provideZonelessChangeDetection(), provideServerRendering(), provideClientHydration()] },
      context,
    ),
  { document: '<!doctype html><html lang="en"><head></head><body><ssr-app></ssr-app></body></html>', url: '/' },
);

/** Markup every component must render on the server. */
const expected = [
  ['skip link', /<a[^>]*lgskiplink/i],
  ['accordion', /<details[^>]*lgaccordionitem/i],
  ['alert heading', />Saved</],
  ['avatar initials', />AL</],
  ['badge', />Active</],
  ['breadcrumbs', /<nav[^>]*aria-label="Breadcrumb"/],
  ['buttons', />Primary</],
  ['menu trigger', /aria-haspopup="menu"/],
  ['combobox', /role="combobox"/],
  ['form field hint', /We never share it\./],
  ['switch', /role="switch"/],
  ['grid column', />Column</],
  ['pagination current page', /aria-current="page"/],
  ['progress', /<progress[^>]*lgprogress/i],
  ['spinner', /role="status"/],
  ['tabs', /role="tablist"[^>]*aria-label="Sections"/],
  ['selected tab', /role="tab"[^>]*aria-selected="true"/],
  ['dialog', /<dialog/],
  ['toaster region', /aria-label="Notifications"/],
  ['hydration annotations', /ngh=/],
];
const missing = expected.filter(([, pattern]) => !pattern.test(html)).map(([name]) => name);
if (missing.length > 0) {
  console.error(`SSR output is missing: ${missing.join(', ')}\n\n${html}`);
  process.exit(1);
}
console.log(`SSR smoke test passed: ${String(expected.length)} checks, ${String(html.length)} bytes of HTML.`);
