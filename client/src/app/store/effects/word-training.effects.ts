import { NavigationService } from 'src/app/core';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppStateInterface } from '../reducers';
import { WordTrainingActionsType } from '../actions/word-training.actions';
import { tap } from 'rxjs/operators';
import { fetchGroupsAction } from '../actions/groups.actions';
import { AppRoutes } from 'src/app/core/routes/routes';

@Injectable()
export class WordTrainingEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<AppStateInterface>,
    private navigationService: NavigationService
  ) {

  }

  // stopTraining$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(WordTrainingActionsType.StopTraining),
  //     tap(_ => this.navigationService.navigateTo(AppRoutes.TrainResult))
  //   ), { dispatch: false })
}
