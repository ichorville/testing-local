import { Routes } from '@angular/router';

import { TestComponent } from './test/test.component';
import { TodoComponent } from './todo/todo.component';
import { TodoSignalsComponent } from './todo-signals/todo-signals.component';

export const routes: Routes = [
  { path: '', redirectTo: '/test', pathMatch: 'full' },
  { path: 'test', component: TestComponent },
  { path: 'todo', component: TodoComponent },
  { path: 'todo-signals', component: TodoSignalsComponent },
];

