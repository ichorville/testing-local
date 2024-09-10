import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { UserSearchService } from './user-search.service';
import { debounceTime, distinctUntilKeyChanged, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
  ],
  providers: [UserSearchService],
  templateUrl: './user-search.component.html',
})
export class UserSearchComponent {
  private readonly _userSearchService = inject(UserSearchService);

  public hideView = true;
  public filteredUsers = signal<string[]>([]);
  public simpleForm = new FormGroup({
    userName: new FormControl(''),
  });

  public searchConfig$ = this.simpleForm.valueChanges
    .pipe(
      debounceTime(300),
      distinctUntilKeyChanged('userName'),
      switchMap((search) => this._userSearchService.findUsers(String(search.userName))),
      tap((value) => this.filteredUsers.set(value))
    )
    .subscribe();
}

