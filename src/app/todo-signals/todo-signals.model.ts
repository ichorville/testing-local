export interface ToDo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}
export interface User {
  name: string;
  id: string;
  firstName?: string;
  lastName?: string;
}

export interface ToDoState {
  isLoading: boolean;
  currentMember: User | undefined;
  memberToDos: ToDo[];
  filteredToDos: ToDo[];
  error: string | null;
  isFiltered: boolean;
}

