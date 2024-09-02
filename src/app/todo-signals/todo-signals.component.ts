import { Component, inject, model, ViewChild } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AsyncPipe, NgFor, JsonPipe, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule, MatListOption } from '@angular/material/list';

import { TodoSignalsService } from './todo-signals.service';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [
    AsyncPipe,
    NgFor,
    JsonPipe,
    FormsModule,
    NgIf,
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

  public filterList = model(false);

  public users$ = this._todoService.users$;
  public isLoading = this._todoService.isLoading;
  public todos = this._todoService.filteredToDos;

  public onUserSelection(event: MatSelectChange): void {
    this._todoService.updateUserSelection(event.value);
  }

  public filterTodos(event: MatCheckboxChange): void {
    this._todoService.filterTodos(event.checked);
  }
}

