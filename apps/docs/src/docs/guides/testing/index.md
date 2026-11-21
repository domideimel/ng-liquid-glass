`@domideimel/ng-liquid-glass/testing` has a component harness for every interactive component. Harnesses use the [Angular CDK testing API](https://angular.dev/guide/testing/component-harnesses-overview): tests interact through them instead of through DOM selectors, so they keep working when the markup changes.

## Setup

The harnesses need `@angular/cdk` (an optional peer dependency):

```bash
npm install --save-dev @angular/cdk
```

## Example

```typescript
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { LgButtonHarness, LgComboboxHarness, LgFormFieldHarness } from '@domideimel/ng-liquid-glass/testing';

it('saves the selected language', async () => {
  const fixture = TestBed.createComponent(SettingsPage);
  const loader = TestbedHarnessEnvironment.loader(fixture);

  const language = await loader.getHarness(LgComboboxHarness);
  await language.enterText('Spa');
  await language.selectOption('Spanish');

  await (await loader.getHarness(LgButtonHarness.with({ text: 'Save' }))).click();

  const email = await loader.getHarness(LgFormFieldHarness.with({ text: 'Email' }));
  expect(await email.getErrors()).toEqual(['Enter your email']);
});
```

## Harnesses

| Harness                  | Host                       | Filter `with({ text })` | Methods                                                                                                     |
| ------------------------ | -------------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------- |
| `LgAccordionItemHarness` | `details[lgAccordionItem]` | summary                 | `getTitle`, `isExpanded`, `toggle`, `expand`, `collapse`                                                    |
| `LgAlertHarness`         | `lg-alert`                 | heading                 | `getHeading`, `getText`                                                                                     |
| `LgButtonHarness`        | `[lgButton]`               | text                    | `getText`, `click`, `isDisabled`, `isLoading`                                                               |
| `LgComboboxHarness`      | `lg-combobox`              | –                       | `getValue`, `enterText`, `open`, `isOpen`, `getOptions`, `selectOption`, `isDisabled`, `blur`               |
| `LgDialogHarness`        | `lg-dialog`                | title                   | `isOpen`, `getTitle`, `getText`, `close` (through its `lgDialogClose` button)                               |
| `LgFormFieldHarness`     | `lg-form-field`            | label                   | `getLabel`, `getHints`, `getErrors`, `isRequired`, `isInvalid`                                              |
| `LgMenuHarness`          | the menu's trigger         | trigger text            | `getTriggerText`, `isOpen`, `open`, `close`, `getItems`, `clickItem`                                        |
| `LgMenuItemHarness`      | `[role=menuitem]`          | text                    | `getText`, `isDisabled`, `click`                                                                            |
| `LgPaginationHarness`    | `lg-pagination`            | –                       | `getCurrentPage`, `getVisiblePages`, `goToPage`, `next`, `previous`, `isNextDisabled`, `isPreviousDisabled` |
| `LgPopoverHarness`       | the popover's trigger      | trigger text            | `getTriggerText`, `isOpen`, `toggle`, `getText`                                                             |
| `LgSelectHarness`        | `lg-select`                | –                       | `getValueText`, `isOpen`, `isDisabled`, `open`, `getOptions`, `selectOption`                                |
| `LgTabHarness`           | `[role=tab]`               | label                   | `getLabel`, `isSelected`, `isDisabled`, `select`                                                            |
| `LgTabsHarness`          | `lg-tabs`                  | tab list label          | `getLabel`, `getTabs`, `getSelectedTab`, `selectTab`, `getPanelText`                                        |
| `LgTagInputHarness`      | `lg-tag-input`             | –                       | `getTags`, `addTag`, `removeTag`                                                                            |
| `LgToastHarness`         | `lg-toast`                 | message                 | `getMessage`, `getActionLabel`, `clickAction`, `dismiss`                                                    |
| `LgTreeHarness`          | `lg-tree`                  | tree label              | `getItems`, `getSelectedLabel`                                                                              |
| `LgTreeItemHarness`      | `[role=treeitem]`          | label                   | `getLabel`, `getLevel`, `isExpanded`, `isSelected`, `click`                                                 |

Keyboard behaviour that depends on native browser handling, such as Escape closing a `<dialog>`, needs an end-to-end test with real key presses.
