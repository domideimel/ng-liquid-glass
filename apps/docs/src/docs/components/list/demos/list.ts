import { Component, signal } from '@angular/core';
import { LgButton } from '@domideimel/ng-liquid-glass/button';
import { LgCard, LgCardHeader } from '@domideimel/ng-liquid-glass/card';
import { LgCopyButton } from '@domideimel/ng-liquid-glass/copy-button';
import { LgInlineUndo, LgList, LgListActions, LgListItem } from '@domideimel/ng-liquid-glass/list';

interface Password {
  readonly id: number;
  readonly value: string;
  readonly removed: boolean;
}

@Component({
  selector: 'docs-list-demo',
  imports: [LgButton, LgCard, LgCardHeader, LgCopyButton, LgInlineUndo, LgList, LgListActions, LgListItem],
  template: `
    <section lgCard class="max-w-xl" aria-labelledby="passwords-title">
      <header lgCardHeader><h2 id="passwords-title">Generated passwords</h2></header>
      <ul lgList aria-labelledby="passwords-title">
        @for (password of passwords(); track password.id; let i = $index) {
          <li lgListItem>
            @if (password.removed) {
              <lg-inline-undo [message]="'Password ' + (i + 1) + ' removed'" (undo)="setRemoved(password.id, false)" />
            } @else {
              <code class="font-mono">{{ password.value }}</code>
              <div lgListActions>
                <lg-copy-button [label]="'Copy password ' + (i + 1)" [value]="password.value" />
                <button
                  lgButton
                  variant="ghost"
                  shape="circle"
                  type="button"
                  [attr.aria-label]="'Remove password ' + (i + 1)"
                  (click)="setRemoved(password.id, true)"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
                  </svg>
                </button>
              </div>
            }
          </li>
        }
      </ul>
    </section>
  `,
})
export class ListDemo {
  protected readonly passwords = signal<readonly Password[]>([
    { id: 1, value: 'v7#Qm2!xLp9@Rt4z', removed: false },
    { id: 2, value: 'K3$wd8^Nb1&Hy6sE', removed: false },
    { id: 3, value: 'p0*Zr5%Jf2!Gc8uA', removed: false },
  ]);

  protected setRemoved(id: number, removed: boolean): void {
    // One pending deletion at a time: removing another one makes the previous one final.
    this.passwords.update((list) =>
      list
        .filter((password) => !(removed && password.removed))
        .map((password) => (password.id === id ? { ...password, removed } : password)),
    );
  }
}
