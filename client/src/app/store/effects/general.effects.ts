import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { fetchGroupsAction } from '../actions/vocabulary.actions';
import { fetchWordsAction } from '../actions/vocabulary.actions';
import { AppStateInterface } from '../reducers';
import { GeneralActionsType } from './../actions/general.actions';
@Injectable()
export class GeneralEffects {

  constructor(
    private actions$: Actions,

    private store$: Store<AppStateInterface>,

  ) { }


  isUpdateData$ = createEffect(() => this.actions$.pipe(
    ofType(GeneralActionsType.UPDATE_GROUPS_AND_WORDS),
    tap(({ isUpdate }: { isUpdate: boolean }) => {
      debugger
      if (isUpdate) {

        this.store$.dispatch(fetchWordsAction())
        this.store$.dispatch(fetchGroupsAction())
      }


    })
  ),
    { dispatch: false }
  )
}
