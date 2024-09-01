import { HttpClient } from '@angular/common/http';
import { computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, delay, Observable, of, tap } from 'rxjs';

export interface Products {
  key: string;
  value: string;
}

export class TestService {
  private getProductsUrl = '';
  private _http = inject(HttpClient);

  private priceX = signal(5);
  private priceY = signal(2);
  public calculated = computed(() => this.priceX() + this.priceY());

  public products$ = this._http.get<Products[]>(this.getProductsUrl).pipe(
    tap(() => console.log('products')),
    catchError(() => {
      console.log('error');
      return of([
        {
          key: '0',
          value: '0',
        },
        {
          key: '1',
          value: '1',
        },
      ]);
    })
  );

  public products = toSignal<Products[]>(this.products$.pipe(delay(5000)));

  constructor() {
    console.log('Calculated signal');
    console.log(this.calculated());
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

  public updateSignalX(value: number) {
    this.priceX.set(value);
  }
}
