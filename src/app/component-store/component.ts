import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentStore } from '@ngrx/component-store';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { Movie } from './model';
import { MovieStore } from './movieStore';
import { MOVIES } from './data';
import { MovieService } from './service';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './component.html',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule],
  providers: [ComponentStore, MovieStore, MovieService],
})
export class MoviesComponent implements OnInit {
  private readonly componentStore = inject(ComponentStore<{ movies: Movie[] }>);
  private readonly movieStore = inject(MovieStore);

  public readonly moviesCS$ = this.componentStore.select((state) => state.movies);
  public readonly moviesMS$ = this.movieStore.movies$;

  public movie$!: Observable<Movie>;

  public ngOnInit(): void {
    this.componentStore.setState({
      movies: MOVIES,
    });
    this.movieStore.setState({
      movies: MOVIES,
      userPreferredMovieIds: [],
      currentPageIndex: 0,
      moviesPerPage: 10,
    });

    // this will trigger debounce and get the latest single emission of the view model
    // if this is removed, there will be couple interim emissions of the view model
    setTimeout(() => {
      this.movieStore.patchState((state) => ({ ...state, movies: structuredClone(MOVIES) }));
    }, 2000);

    const vm = this.movieStore.viewModel$.subscribe((vm) => console.log(vm));
  }

  /**
   * Updating the state by adding a new movie (But as with this example Im adding 2 different
   * movies with two different ways of addition. Pick and chose your poison)
   */
  public addMovie(): void {
    // updating the component store via the updater
    this.movieStore.addMovie({
      name: 'New Movie',
      id: Math.random().toString(),
    });

    // can update the state as below as well using patchState
    this.movieStore.patchState((state) => ({
      movies: [
        ...state.movies,
        {
          name: 'New Movie from patchState',
          id: Math.random().toString(),
        },
      ],
    }));

    // setState
    this.movieStore.setState((state) => ({
      ...state, // if were using setState() to partially update state, we need to derive the state,
      // in which we do not have to do in patchState(), where it calls directly. Removing this line
      // gives an error
      movies: [
        ...state.movies,
        {
          name: 'New Movie from setState',
          id: Math.random().toString(),
        },
      ],
    }));
  }

  public selectMovie(movie: Movie): void {
    this.movieStore.getMovie(movie.id);
    this.movie$ = this.movieStore.selectMovie(movie.id);
  }

  public reset(): void {
    this.movieStore.patchState(() => ({
      movies: [],
    }));
  }
}

