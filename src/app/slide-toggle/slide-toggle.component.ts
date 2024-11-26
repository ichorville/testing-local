import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, Output, ViewEncapsulation } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';

import { ComponentStore } from '@ngrx/component-store';
import { tap } from 'rxjs';

interface SlideToggleState {
  checked: boolean;
}

interface MatSlideToggleChange {
  readonly source: SlideToggleComponent;
  readonly checked: boolean;
}

@Component({
  selector: 'slide-toggle',
  standalone: true,
  templateUrl: './slide-toggle.component.html',
  styleUrls: ['./slide-toggle.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, AsyncPipe, MatRippleModule],
  providers: [ComponentStore],
})
export class SlideToggleComponent {
  private readonly componentStore = inject(ComponentStore<SlideToggleState>);

  constructor() {
    this.componentStore.setState({ checked: false });
  }

  @Input() set checked(value: boolean) {
    this.setChecked(value);
  }

  // Observable<MatSlideToggleChange> used instead of EventEmitter
  @Output() readonly change = this.componentStore.select((state) => ({
    source: this,
    checked: state.checked,
  }));

  private readonly setChecked = this.componentStore.updater((state, value: boolean) => ({
    ...state,
    checked: value,
  }));

  public readonly vm$ = this.componentStore.select((state) => ({
    checked: state.checked,
  }));

  public onChangeEvent = this.componentStore.effect<{
    source: Event;
    checked: boolean;
  }>((event$) =>
    event$.pipe(
      tap<{ source: Event; checked: boolean }>((event) => {
        event.source.stopPropagation();
        this.setChecked(!event.checked);
      })
    )
  );
}

@Component({
  selector: 'slide-toggle-test',
  standalone: true,
  template: `<slide-toggle (change)="logFirst($event)">Slide me!</slide-toggle>
    <br />
    <slide-toggle [checked]="true" (change)="logSecond($event)">I'm ON initially</slide-toggle>`,
  imports: [SlideToggleComponent],
})
export class SlideToggleTestComponent {
  logFirst(obj: { checked: boolean }) {
    console.log('first toggle:', obj.checked);
  }

  logSecond(obj: { checked: boolean }) {
    console.log('second toggle:', obj.checked);
  }
}

