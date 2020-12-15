import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { Word } from 'src/app/shared/interfaces';
import { fetchGroupsAction, setWordsAction } from '../actions/vocabulary.actions';
import {
  saveTrainingProgressErrorAction,
  saveTrainingProgressSuccessAction, WordTrainingActionsType
} from '../actions/word-training.actions';
import { AppStateInterface } from '../reducers';
import { wordsToSaveSelector } from '../selectors/word-training.selector';
import { ApiWordsService } from './../../shared/services/api/api-words.service';

@Injectable()
export class WordTrainingEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<AppStateInterface>,
    private wordsApiService: ApiWordsService
  ) {

  }

  saveTrainingProgress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WordTrainingActionsType.SaveTrainingProgress),
      switchMap(() => this.store$.pipe(
        select(wordsToSaveSelector),
        take(1),
        switchMap((uniqueLearnedWords: Word[]) => this.wordsApiService.updateWords(uniqueLearnedWords)),
      )),
      map((words: Word[]) => {
        return saveTrainingProgressSuccessAction({ words });
      }),
      catchError((err: HttpErrorResponse) => {
        return of(saveTrainingProgressErrorAction({ error: err.error.message }))
      })
    )
  )


  saveTrainingProgressSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WordTrainingActionsType.SaveTrainingProgressSuccess),
      tap(({ words }: { words: Word[] }) => {
        this.store$.dispatch(setWordsAction({ words }))
        this.store$.dispatch(fetchGroupsAction())
      })
    ), { dispatch: false })

  // stopTraining$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(WordTrainingActionsType.StopTraining),
  //     tap(_ => this.navigationService.navigateTo(AppRoutes.TrainResult))
  //   ), { dispatch: false })
}
