import { Component, signal } from '@angular/core';
import { LgCombobox } from '@domideimel/ng-liquid-glass/combobox';
import { LgFormField, LgHint, LgLabel } from '@domideimel/ng-liquid-glass/forms';

const CITIES = [
  'Amsterdam',
  'Athens',
  'Barcelona',
  'Berlin',
  'Bern',
  'Bratislava',
  'Brussels',
  'Budapest',
  'Copenhagen',
  'Dublin',
  'Hamburg',
  'Helsinki',
  'Lisbon',
  'Ljubljana',
  'London',
  'Madrid',
  'Munich',
  'Oslo',
  'Paris',
  'Prague',
  'Riga',
  'Rome',
  'Stockholm',
  'Tallinn',
  'Vienna',
  'Vilnius',
  'Warsaw',
  'Zagreb',
  'Zurich',
];

@Component({
  selector: 'docs-combobox-search-demo',
  imports: [LgCombobox, LgFormField, LgHint, LgLabel],
  template: `
    <lg-form-field class="max-w-sm">
      <label lgLabel>City</label>
      <lg-hint>Results load as you type (simulated server).</lg-hint>
      <lg-combobox ariaLabel="Cities" [filter]="null" [options]="results()" [loading]="loading()" (query)="search($event)" />
    </lg-form-field>
  `,
})
export class ComboboxSearchDemo {
  protected readonly results = signal<readonly string[]>([]);
  protected readonly loading = signal(false);
  private timer: ReturnType<typeof setTimeout> | undefined;

  protected search(query: string): void {
    clearTimeout(this.timer);
    this.loading.set(true);
    this.timer = setTimeout(() => {
      const q = query.trim().toLowerCase();
      this.results.set(q ? CITIES.filter((city) => city.toLowerCase().startsWith(q)) : []);
      this.loading.set(false);
    }, 400);
  }
}
