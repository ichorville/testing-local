import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

interface Route {
  path: string;
  title: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    HttpClientModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  routes: Route[] = [
    { path: '/test', title: 'Test App' },
    { path: '/todo', title: 'To-do App' },
    { path: '/todo-signals', title: 'To-do Signals' },
    { path: '/user-search', title: 'User Search' },
    { path: '/toh', title: 'Tour of Heroes' },
    { path: '/component-store', title: 'Component Store' },
    { path: '/panels', title: 'Panels' },
  ];

  title = (this.routes.find((route) => route.path === window.location.pathname) as Route).title;
}