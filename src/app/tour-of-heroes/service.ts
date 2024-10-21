import { map, merge, of, scan, shareReplay, Subject } from 'rxjs';
import { HEROES } from './const';
import { Action, ACTION_TYPE, Hero } from './model';

export class Service {
  #heroCRUDSubject = new Subject<Action<Hero>>();
  heroCUDActions = this.#heroCRUDSubject.asObservable();

  totalHeroes$ = of(HEROES);
  heroes$ = merge(
    this.totalHeroes$,
    this.heroCUDActions.pipe(
      map((hero) => {
        console.log('from action');
        return hero;
      })
    )
  ).pipe(
    scan((totalHeroes, currentHero) => this.modifyHeroArray(totalHeroes, currentHero), [] as Hero[]),
    shareReplay(1)
  );

  public addHero(hero: Hero): void {
    this.#heroCRUDSubject.next({ action: ACTION_TYPE.ADD, hero });
  }

  public removeHero(hero: Hero): void {
    this.#heroCRUDSubject.next({ action: ACTION_TYPE.DELETE, hero });
  }

  public updateHero(hero: Hero): void {
    this.#heroCRUDSubject.next({ action: ACTION_TYPE.UPDATE, hero });
  }

  private modifyHeroArray(totalHeroes: Hero[], currentHero: Action<Hero> | Hero[]): Hero[] {
    if (currentHero instanceof Array) return [...currentHero];

    switch (currentHero.action) {
      case ACTION_TYPE.ADD: {
        return [...totalHeroes, currentHero.hero];
      }
      case ACTION_TYPE.UPDATE: {
        return totalHeroes.map((h) => (h.id === currentHero.hero.id ? currentHero.hero : h));
      }
      case ACTION_TYPE.DELETE: {
        return totalHeroes.filter((h) => h.id !== currentHero.hero.id);
      }
    }
  }
}

