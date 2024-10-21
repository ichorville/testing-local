export interface Hero {
  id: number;
  name: string;
}

export enum ACTION_TYPE {
  ADD = 'add',
  UPDATE = 'update',
  DELETE = 'delete',
}

export interface Action<T> {
  hero: T;
  action: ACTION_TYPE;
}

