import { HttpClient } from '@angular/common/http';
import { computed, inject, signal } from '@angular/core';

import { map, Observable, Subject, switchMap, tap } from 'rxjs';

import { ToDoState, User, ToDo } from './todo-signals.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export class TodoSignalsService {
  /**
   * We dont change state via effects
   */

  private _http = inject(HttpClient);

  // Current state object, similar to the view model
  private state = signal<ToDoState>({
    isLoading: false,
    currentMember: undefined,
    memberToDos: [],
    filteredToDos: [],
    error: null,
  });

  private selectedId = new Subject();
  private selectedId$ = this.selectedId.asObservable();

  private hasCompleted = new Subject();
  private hasCompleted$ = this.hasCompleted.asObservable();

  // Selectors - selects a specific piece/ slice from the state
  public isLoading = computed(() => this.state().isLoading);
  public currentMember = computed(() => this.state().currentMember);
  public toDos = computed(() => this.state().memberToDos);
  public filteredToDos = computed(() => this.state().filteredToDos);
  public error = computed(() => this.state().error);

  constructor() {
    this.selectedId$
      .pipe(
        tap(() => {
          this.state.update((state) => ({
            ...state,
            isLoading: true,
          }));
        }),
        switchMap((id) =>
          this.todos$.pipe(
            map((todos) => todos.filter((todo) => todo.userId === id)),
            tap((todos) => {
              this.state.update((state) => ({
                ...state,
                isLoading: false,
                memberToDos: todos,
                filteredToDos: todos,
              }));
            })
          )
        ),
        takeUntilDestroyed()
      )
      .subscribe();

    this.hasCompleted$
      .pipe(
        map((status) => {
          this.state.update((state) => ({
            ...state,
            filteredToDos:
              Boolean(status) === true ? this.toDos().filter((todo) => todo.completed === status) : this.toDos(),
          }));
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  public updateUserSelection(id: number): void {
    this.selectedId.next(id);
  }

  public filterTodos(status: boolean): void {
    this.hasCompleted.next(status);
  }

  public todos$: Observable<ToDo[]> = this._http
    .get<ToDo[]>('https://jsonplaceholder.typicode.com/todos')
    .pipe(map((todos) => todos));

  public users$: Observable<User[]> = this._http.get<User[]>('https://jsonplaceholder.typicode.com/users').pipe(
    map((users) =>
      users.map((user) => ({
        id: user.id,
        name: user.name,
      }))
    )
  );
}

