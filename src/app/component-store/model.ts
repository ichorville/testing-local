export interface Movie {
    name: string;
    id: string;
}

export interface MovieState {
  movies: Movie[];
  userPreferredMovieIds: string[]
  moviesPerPage: number;
  currentPageIndex: number;
}