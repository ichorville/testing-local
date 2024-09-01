import { Component, inject, OnInit, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { combineLatest, delay, take, tap } from 'rxjs';

import { TestService } from './test.service';

// interface ViewModel {
//   products: Products[] | { key: string; value: string }[];
// }

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  providers: [TestService],
  templateUrl: './test.component.html',
})
export class TestComponent implements OnInit {
  public _testService = inject(TestService);

  // products observable from declarative pattern
  // below code is with a delay
  // public products$ = this._testService.products$.pipe(delay(5000));
  public products$ = this._testService.products$;

  public productSignal = this._testService.products;

  public productViewModel = combineLatest({
    products: this.products$.pipe(delay(5000)),
  });

  // public productViewModelSignal = signal(this.products$.pipe(delay(5000)));
  public productViewModelSignal = signal({
    products: this.products$.pipe(delay(5000)),
    applications: this.products$.pipe(delay(2000)),
  });

  public calculatedPrice = this._testService.calculated();

  effect = effect(() => {
    console.log(this.calculatedPrice);
    console.log(this._testService.calculated());
  });

  public snack = signal<Snack>(SNACK);
  public user = signal<User>(USER);

  public ngOnInit(): void {
    // this.getProducts();

    // Note that this.calculatedPrice variable is not updated, so either I have to assign that
    // variable again, or simply use the Signal on the DOM like how ive done at the moment
    this._testService.updateSignalX(13);

    console.log(this.snack());

    // setTimeout(() => {
    //   this.productViewModelSignal.update(() => of([{
    //     key: '0', value: '1'
    //   }]))
    // }, 5000);
  }

  /**
   * Function to fetch products from service, so we will not use this function
   * due to the declarative pattern used above
   */
  private getProducts(): void {
    this._testService
      .getProducts()
      .pipe(
        take(1),
        tap((products) => console.log(products))
      )
      .subscribe();
  }
}
interface Snack {
  id: number;
  name: string;
  price: number;
  isInStock: boolean;
}

interface User {
  id: number;
  name: string;
  userName: string;
}

export const SNACK: Snack = {
  id: 1,
  name: 'hello',
  price: 2.0,
  isInStock: true,
};

export const USER: User = {
  id: 5,
  name: 'mellow',
  userName: 'helloworld',
};
