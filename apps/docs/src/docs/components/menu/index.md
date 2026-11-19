A menu button (WAI-ARIA menu button pattern). The menu opens in the top layer with the Popover API, and CSS anchor positioning places it next to its trigger.

{{ NgDocActions.demo("MenuDemo") }}

## Usage

```html
<button lgButton [lgMenuTrigger]="menu">Actions</button>
<lg-menu #menu>
  <button lgMenuItem type="button" (click)="rename()">Rename</button>
</lg-menu>
```

## Keyboard

| Key               | Action                                          |
| ----------------- | ----------------------------------------------- |
| Enter / Space / ↓ | Open the menu and focus the first item          |
| ↑ (on trigger)    | Open and focus the last item                    |
| ↓ / ↑             | Move between items (wraps)                      |
| Home / End        | First / last item                               |
| A–Z               | Jump to the next item starting with that letter |
| Escape            | Close and return focus to the trigger           |
| Tab               | Close and move on                               |

Use a menu for actions. For navigation, use links; for choosing a value, use a select or the combobox.
