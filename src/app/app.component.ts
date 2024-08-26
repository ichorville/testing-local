import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AppService } from './app.service';
import { delay, pipe, take, tap } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule],
  providers: [AppService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass',
})
export class AppComponent implements OnInit {
  title = 'my-app';

  private _appService = inject(AppService);

  // products observable from declarative pattern
  // below code is with a delay
  // public products$ = this._appService.products$.pipe(delay(5000));
  public products$ = this._appService.products$;

  public ngOnInit(): void {
    // this.getProducts();
  }

  /**
   * Function to fetch products from service, so we will not use this function
   * due to the declarative pattern used above
   */
  private getProducts(): void {
    this._appService
      .getProducts()
      .pipe(
        take(1),
        tap((products) => console.log(products))
      )
      .subscribe();
  }
}
