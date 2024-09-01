export interface Todo {
    todo: string;
    completed: boolean;
}

export interface User {
    name: string;
    university: string;
    completed: boolean;
    todos: Todo[];
    filteredTodos: Todo[];
  }

export interface ViewModel {
    users: User[];
    currentUser: User | undefined;
    isLoading: boolean;
    isFiltered: boolean;
}