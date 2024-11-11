import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentStore } from '@ngrx/component-store';

import { Movie } from './model';
import { MovieStore } from './movieStore';
import { MOVIES } from './data';

@Component({
  templateUrl: './component.html',
  standalone: true,
  imports: [CommonModule],
  providers: [ComponentStore, MovieStore],
})
export class MoviesComponent implements OnInit {
  private readonly componentStore = inject(ComponentStore<{ movies: Movie[] }>);
  private readonly movieStore = inject(MovieStore);

  public readonly moviesCS$ = this.componentStore.select((state) => state.movies);
  public readonly moviesMS$ = this.movieStore.movies$;

  public ngOnInit(): void {
    this.componentStore.setState({
      movies: MOVIES,
    });
    this.movieStore.setState({
      movies: MOVIES,
      userPreferredMovieIds: [],
      currentPageIndex: 0,
      moviesPerPage: 10
    });

    // this will trigger debounce and get the latest single emission of the view model
    // if this is removed, there will be couple interim emissions of the view model
    setTimeout(() => {
        this.movieStore.patchState(state => ({ ...state, movies: [] }))
    }, 2000);

    const vm = this.movieStore.viewModel$.subscribe(vm => console.log(vm))
  }
}

