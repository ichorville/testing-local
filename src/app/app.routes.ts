import { Routes } from '@angular/router';

import { TestComponent } from './test/test.component';
import { TodoComponent } from './todo/todo.component';

export const routes: Routes = [
  { path: '', redirectTo: '/test', pathMatch: 'full' },
  { path: 'test', component: TestComponent },
  { path: 'todo', component: TodoComponent },
];
