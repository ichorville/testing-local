/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

import { BehaviorSubject, delay, filter, finalize, map, Observable, of, switchMap, take, tap } from 'rxjs';

import { User } from './todo.model';

export class TodoService {
  private _http = inject(HttpClient);

  private currentUser = new BehaviorSubject<User | undefined>(undefined);
  private loading = new BehaviorSubject<boolean>(false);
  private isFiltered = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUser.asObservable();
  public isLoading$ = this.loading.asObservable();
  public isFiltered$ = this.isFiltered.asObservable();

  public users$: Observable<User[]> = this._http
    .get<Observable<User[]>>('https://dummyjson.com/users')
    .pipe(
      map((users: any) =>
        users.users.map(
          (user: { firstName: string; lastName: string; university: string }) =>
            this.mapUser(user)
        )
      )
    );

  public onUserSelection(userName: string): void {
    this.loading.next(true);
    this.users$
      .pipe(
        take(1),
        switchMap((users) => of(users.find((us: User) => us.name === userName))),
        filter((user) => !!user),
        tap((user) => this.currentUser.next(user)),
        delay(3000),
        finalize(() => this.loading.next(false))
      )
      .subscribe();
  }

  public onTodoCheck(status: boolean): void {
    this.currentUser$.pipe(
        take(1),
        tap(user => console.log(user)),
        switchMap(user => status ? of(user?.todos.filter(todo => todo.completed === status)) : of(user)),
        tap(user => console.log(user))
    ).subscribe()
  }

  public filterTodos(status: boolean): void {
    this.isFiltered.next(status);
  }

  private mapUser(user: {
    firstName: string;
    lastName: string;
    university: string;
  }): User {
    return {
      name: `${user.firstName} ${user.lastName}`,
      university: user.university,
      completed: false,
      todos: this.generateRandomArrayOfStrings(10, 18).map((todo) => ({
        todo: todo,
        completed: false,
      })),
      filteredTodos: []
    };
  }

  private generateRandomString(length: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }

  private generateRandomArrayOfStrings(
    arrayLength: number,
    stringLength: number
  ): string[] {
    const randomArray = [];
    for (let i = 0; i < arrayLength; i++) {
      randomArray.push(this.generateRandomString(stringLength));
    }
    return randomArray;
  }
}
