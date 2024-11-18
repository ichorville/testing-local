import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';

import {
  BehaviorSubject,
  concatMap,
  delay,
  EMPTY,
  finalize,
  from,
  merge,
  Observable,
  of,
  scan,
  switchMap,
  take,
  tap,
} from 'rxjs';

import { Panel, PANELS } from './data';

@Component({
  standalone: true,
  templateUrl: './panels.component.html',
  imports: [CommonModule, MatCardModule, MatTabsModule],
})
export class PanelsComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  private panelDictionary: { [key: string]: Panel } = {};

  public allSignalsLoaded = false;
  public signalPanels = signal<Panel[]>([...PANELS]);

  public allRxjsLoaded = false;
  public rxjsPanels = this.fetchPanels().pipe(
    take(5),
    tap((panel) => {
      console.debug('single panel within stream', panel);
      this.panelDictionary[panel.title] = panel;
    }),
    scan((panels: Panel[], newPanel: Panel) => this.updatePanels(panels, newPanel), PANELS),
    tap((panels) => console.debug('all panels in stream after scan', panels)),
    finalize(() => {
      this.allRxjsLoaded = true;
      console.log(this.panelDictionary);
    })
  );

  public ngOnInit(): void {
    this.fetchPanels()
      .pipe(
        take(5),
        tap((panel) => this.signalPanels.set(this.updatePanels(this.signalPanels(), panel))),
        tap((panel) => console.debug('single panel within stream', panel)),
        finalize(() => (this.allSignalsLoaded = true))
      )
      .subscribe();
  }

  public fetchPanels(): Observable<Panel> {
    const panels: Panel[] = [
      { title: 'Title 1', body: Math.random() },
      { title: 'Title 2', body: Math.random() },
      { title: 'Title 3', body: Math.random() },
      { title: 'Title 4', body: Math.random() },
      { title: 'Title 5', body: Math.random() },
    ];
    const shuffledPanels = panels.sort(() => Math.random() - 0.5);
    return from(shuffledPanels).pipe(concatMap((panel) => of(panel).pipe(delay(1000))));
  }

  public updatePanels(panels: Panel[], newPanel: Panel): Panel[] {
    const panelId = panels.findIndex((panel) => panel.title === newPanel.title);
    if (!panelId) panels[0] = newPanel;
    panels[panelId] = newPanel;
    return panels;
  }

  public finalStretch(): void {
    const firstPanel = this.signalPanels().find((panel) => panel.title === 'Title 1');
    console.log(firstPanel);
  }

  public getStarted(): void {
    console.log('get started');
  }
}

