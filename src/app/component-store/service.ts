import { Injectable } from '@angular/core';
import { Movie } from './model';
import { Observable, of } from 'rxjs';

@Injectable()
export class MovieService {
  getMovie(id: string): Observable<Movie> {
    return of({
      id: Math.random().toString(),
      name: 'New Movie Title ' + Math.random().toString(),
    });
  }
}

