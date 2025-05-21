import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, Output, ViewEncapsulation } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';

import { ComponentStore } from '@ngrx/component-store';
import { tap } from 'rxjs';

interface PaginatorState {
  pageIndex: number;
  pageSize: number;
  length: number;
  pageSizeOptions: ReadonlySet<number>;
}

interface PageEvent extends Pick<PaginatorState, 'pageIndex' | 'pageSize' | 'length'> {
  previousPageIndex?: number;
}

@Component({
  selector: 'slide-toggle',
  standalone: true,
  templateUrl: './paginator.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore],
})
export class PaginatorComponent {
  @Input() set pageIndex(value: number) {
    this.setPageIndex(value);
  }

  @Input() set length(value: number) {
    this.setLength(value);
  }

  @Input() set pageSize(value: number) {
    this.setPageSize(value);
  }

  @Input() set pageSizeOptions(value: readonly Number[]) {
    this._componentStore.setState((state) => {
      // const pageSizeOptions = new Set<number>([...value, state.pageSize].sort((a, b) => a - b));
      return state;
    });
  }

  private readonly _componentStore = inject(ComponentStore<PaginatorState>);
  // set defaults
  constructor() {
    this._componentStore.setState({
      pageIndex: 0,
      length: 0,
      pageSize: 0,
      pageSizeOptions: new Set<number>([50]),
    });
  }

  /** Updaters */
  readonly setPageIndex = this._componentStore.updater((state, value: number) => ({
    ...state,
    pageIndex: Number(value) || 0,
  }));

  readonly setLength = this._componentStore.updater((state, value: number) => ({
    ...state,
    length: Number(value) || 0,
  }));

  readonly setPageSize = this._componentStore.updater((state, value: number) => ({
    ...state,
    pageSize: Number(value) || 0,
  }));

  //   readonly vm$ = this._componentStore.select(this._componentStore.state$);
}

