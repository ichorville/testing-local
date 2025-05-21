import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, Output, ViewEncapsulation } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';

import { ComponentStore } from '@ngrx/component-store';
import { tap } from 'rxjs';

@Component({
  selector: 'signal-store',
  standalone: true,
  templateUrl: './signal-store.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalStoreComponent {}

