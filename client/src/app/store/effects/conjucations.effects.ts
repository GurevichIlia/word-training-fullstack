import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { fetchConjugationsAction } from '../actions/conjugations.actions';

@Injectable()
export class ConjugationsEffects {

  constructor(private actions$: Actions) { }

  getConjugations$ = createEffect(() => this.actions$.pipe(
    ofType(fetchConjugationsAction),

  ))
}
