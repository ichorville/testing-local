import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, delay, map, Observable, of, tap } from 'rxjs';

interface Products {}

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private getProductsUrl = '';
  private _http = inject(HttpClient);

  public priceX = signal(5);
  public priceY = signal(2);
  public calculated = computed(() => this.priceX() + this.priceY());

  products$ = this._http.get<Products[]>(this.getProductsUrl).pipe(
    tap(() => console.log('products')),
    catchError(() => {
      console.log('error');
      return of([]);
    })
  );

  constructor() {
    console.log('Calculated signal')
    console.log(this.calculated())
  }

  getProducts(): Observable<Products[]> {
    return this._http.get<Products[]>(this.getProductsUrl).pipe(
      tap(() => console.log('products')),
      catchError(() => {
        console.log('error');
        return of([]);
      })
    );
  }
}
