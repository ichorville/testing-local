import { Routes } from '@angular/router';

import { TestComponent } from './test/test.component';
import { TodoComponent } from './todo/todo.component';
import { TodoSignalsComponent } from './todo-signals/todo-signals.component';
import { UserSearchComponent } from './user-search/user-search.component';
import { ListComponent } from './tour-of-heroes/list/list.component';
import { MoviesComponent } from './component-store/component';

export const routes: Routes = [
  { path: '', redirectTo: '/test', pathMatch: 'full' },
  { path: 'test', component: TestComponent },
  { path: 'todo', component: TodoComponent },
  { path: 'todo-signals', component: TodoSignalsComponent },
  { path: 'user-search', component: UserSearchComponent },
  { path: 'toh', component: ListComponent },
  { path: 'component-store', component: MoviesComponent },
];

