import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { ConjugationsActionsType, fetchConjugationsErrorAction, fetchConjugationsSuccessAction } from '../actions/conjugations.actions';
import { ConjugationsApiService } from './../../modules/conjugations/services/conjugations-api.service';

@Injectable()
export class ConjugationsEffects {

  constructor(
    private actions$: Actions,
    private utilsService: UtilsService,
    private conjugationsApiService: ConjugationsApiService
  ) { }

  getConjugations$ = createEffect(() => this.actions$.pipe(
    ofType(ConjugationsActionsType.FetchConjugations),
    switchMap(({ verbs }: { verbs: string }) => {

      return this.conjugationsApiService.getConjugationsForVerbs(this.utilsService.verbsForConjugationsParser(verbs))
        .pipe(
          map(({ verbs }) => fetchConjugationsSuccessAction({ verbs })),
          catchError(err => of(fetchConjugationsErrorAction({ error: err })))
        )
    }),
    catchError(err => of(fetchConjugationsErrorAction({ error: err })))

  ))


}
