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
    isFiltered: false,
    error: null,
  });

  private selectedId = new Subject();
  private selectedId$ = this.selectedId.asObservable();

  // Selectors - selects a specific piece/ slice from the state
  public isLoading = computed(() => this.state().isLoading);
  public currentMember = computed(() => this.state().currentMember);
  public toDos = computed(() => this.state().memberToDos);
  public error = computed(() => this.state().error);
  public isFiltered = computed(() => this.state().isFiltered);
  public filteredToDos = computed(() =>
    this.state().isFiltered === true
      ? this.state().memberToDos.filter((todo) => todo.completed === true)
      : this.state().memberToDos
  );

  // Somewhat like reducer methods that defines actions to update state
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
  }

  public updateUserSelection(id: number): void {
    this.selectedId.next(id);
  }

  public filterTodos(status: boolean): void {
    this.state.update((state) => ({
      ...state,
      isFiltered: status,
    }));
  }

  public updateMemberTodos(todo: ToDo): void {
    this.state.update((state) => ({
      ...state,
      memberToDos: this.returnUpdatedTodos(todo),
    }));
  }

  private returnUpdatedTodos(todo: ToDo): ToDo[] {
    this.toDos().forEach((memberToDo) => {
      if (memberToDo.id === todo.id) {
        memberToDo = todo;
      }
    });
    return this.toDos();
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

