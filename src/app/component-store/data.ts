import { Movie } from './model';

export const MOVIES: Movie[] = [
  {
    name: 'Title 1' + Math.round(Math.random()).toString(),
    id: Math.random().toString(),
  },
  {
    name: 'Title 2' + Math.round(Math.random()).toString(),
    id: Math.random().toString(),
  },
];
