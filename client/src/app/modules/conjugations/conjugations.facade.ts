import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { fetchConjugationsAction } from 'src/app/store/actions/conjugations.actions';
import { AppStateInterface } from 'src/app/store/reducers';
import { verbsWithConjugationsSelector, isLoadingSelector } from 'src/app/store/selectors/conjugations.selectors';
import { VerbWithConjugations } from './models/conjugations.interface';

@Injectable({ providedIn: 'root' })
export class ConjugationsFacade {
  isLoading$: Observable<boolean> = this.store$.pipe(select(isLoadingSelector));
  isResetCsvHandlerState$: Observable<boolean>
  verbs$: Observable<VerbWithConjugations[]> = this.store$.pipe(select(verbsWithConjugationsSelector),)

  constructor(
    private store$: Store<AppStateInterface>
  ) { }

  getConjugationsFromCsv(file: File): void {

  }
  /**
   *
   * @example verbsAsString: "verb; verb2; verb3"
   */
  getConjugationsFromVerbsAsString(verbs: string): void {
    this.store$.dispatch(fetchConjugationsAction({ verbs }))
  }
}
