import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';

import { Movie, MovieState } from './model';
import { Observable, of } from 'rxjs';

@Injectable()
export class MovieStore extends ComponentStore<MovieState> {
  constructor() {
    super({ movies: [], userPreferredMovieIds: [], currentPageIndex: 0, moviesPerPage: 10 });

    // explore more on these side effects
    // this.fetchMovies(this.viewModel$)
  }

  public readonly movies$: Observable<Movie[]> = this.select((state) => state.movies);
  public readonly userPreferredMovieIds$: Observable<string[]> = this.select((state) => state.userPreferredMovieIds);

  /**
   * Updater function to update movies per page
   */
  public readonly updateMoviesPerPage = this.updater((state, moviesPerPage: number) => ({
    ...state,
    moviesPerPage,
  }));

  /**
   * Updater function to update current page pagination index
   */
  public readonly updateCurrentPageIndex = this.updater((state, currentPageIndex: number) => ({
    ...state,
    currentPageIndex,
  }));

  // seems like we can chain selectors to derive values or rather execute operations
  public userPreferredMovies$ = this.select(this.movies$, this.userPreferredMovieIds$, (movies, ids) =>
    movies.filter((movie) => ids.includes(movie.id))
  );

  public readonly viewModel$ = this.select(
    {
      movies: this.movies$,
      userPreferredMovieIds: this.userPreferredMovieIds$,
      userPreferredMovies: this.userPreferredMovies$,
    },
    { debounce: true }
  );

  // public readonly fetchMovies = this.effect((movies$: any) => {
  //   console.log('inside effect')
  //   console.log(movies$)
  //   return of({} as any)
  // })
}

