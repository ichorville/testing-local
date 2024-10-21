import { Component, inject } from '@angular/core';
import { AsyncPipe, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { Service } from '../service';
import { Hero } from '../model';

@Component({
  selector: 'app-todo',
  standalone: true,
  templateUrl: './list.component.html',
  imports: [AsyncPipe, NgFor, FormsModule, MatButtonModule, MatListModule, MatInputModule, MatIconModule],
  providers: [Service],
})
export class ListComponent {
  readonly #service = inject(Service);
  value = '';

  readonly heroes$ = this.#service.heroes$;

  public add(): void {
    const name = this.value.trim();
    if (!name) return;
    this.#service.addHero({
      id: Math.random(),
      name,
    });
  }

  public remove(hero: Hero): void {
    this.#service.removeHero(hero);
  }
}

