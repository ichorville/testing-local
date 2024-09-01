import { Component, inject, ViewChild } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AsyncPipe, NgFor, JsonPipe } from '@angular/common';

import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule, MatListOption, MatSelectionList } from '@angular/material/list';

import { combineLatest, Observable } from 'rxjs';

import { TodoSignalsService } from './todo-signals.service';
import { Todo, User, ViewModel } from './todo-signals.model';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [
    AsyncPipe,
    NgFor,
    JsonPipe,
    HttpClientModule,
    MatCheckboxModule,
    MatSelectModule,
    MatFormFieldModule,
    MatListModule,
  ],
  providers: [TodoSignalsService],
  templateUrl: './todo-signals.component.html',
})
export class TodoSignalsComponent {
  @ViewChild('list') public list!: MatListOption;
  private _todoService = inject(TodoSignalsService);

  public viewModel: Observable<ViewModel> = combineLatest({
    users: this._todoService.users$,
    currentUser: this._todoService.currentUser$,
    isLoading: this._todoService.isLoading$,
    isFiltered: this._todoService.isFiltered$,
  });

  public onUserSelection(event: MatSelectChange): void {
    this._todoService.onUserSelection(event.value);
    // this.filterTodos(false);
  }

  public filterTodos(event: MatCheckboxChange): void {
    this._todoService.filterTodos(event.checked);
  }

  public onToggle(user: User, list: MatSelectionList): void {
    const todos = list._value as unknown as Todo[];
    todos.forEach((todo) => (todo.completed = true));
    user.filteredTodos = todos;
  }
}
