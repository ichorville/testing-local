import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, map, Observable, of, shareReplay, take } from 'rxjs';
import { UserDTO } from './user-search.model';

export class UserSearchService {
  private _http = inject(HttpClient);

  /**
     * example code to check how shareReplay works when the view is destroyed. to destroy the view in this example app
     * simply navigate to a different route. If we dont have the bufferSize and refCount defined, the additional http requests 
     * are still fired though the component is destroyed
     * 
     public users$: Observable<any[]> = this._http.get<UserDTO[]>('https://jsonplaceholder.typicode.com/users').pipe(
      map((users) => users.map((user) => user.name)),
       switchMap(() =>
        timer(0, 2000).pipe(
          switchMap(() => this._http.get<UserDTO[]>('https://jsonplaceholder.typicode.com/users').pipe(take(1)))
        )
       ),
      catchError(() => of([])),
      shareReplay({ bufferSize: 1, refCount: true })
     );
     */

  public users$: Observable<string[]> = this._http.get<UserDTO[]>('https://jsonplaceholder.typicode.com/users').pipe(
    map((users) => users.map((user) => user.name)),
    catchError(() => of([])),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  /**
   * Filter users based on the first letter to last letter in name
   *
   * @param searchTerm of type string
   * @returns
   */
  public findUsers(searchTerm: string): Observable<string[]> {
    const trimmedSearchTerm = searchTerm.trim().toLocaleLowerCase();

    if (!trimmedSearchTerm) {
      return of([]); // Return an empty array observable directly if the search term is empty
    }

    return this.users$.pipe(
      take(1),
      map((users) => users.filter((user) => user.toLocaleLowerCase().includes(trimmedSearchTerm)))
    );
  }
}

