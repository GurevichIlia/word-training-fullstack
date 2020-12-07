import { NotificationsService } from 'src/app/shared/services/notifications.service';
import { CsvHandlerService } from './../../core/services/csv-handler.service';
import { fetchGroupsAction } from './../actions/groups.actions';

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of, combineLatest } from 'rxjs';
import { switchMap, tap, map, catchError, take } from 'rxjs/operators';
import { WordsService } from 'src/app/core/services';
import { LanguageInterface } from 'src/app/modules/languages/types/languages.interfaces';
import { selectedGroupSelector } from 'src/app/modules/vocabulary/groups/store/selectors/groups.selectors';
import { Word, WordGroup } from 'src/app/shared/interfaces';
import { AppStateInterface } from 'src/app/store/reducers';
import {
  WordsActionsType,
  fetchWordsSuccessAction,
  fetchWordsErrorAction,
  addWordToUserWordsErrorAction,
  addWordToUserWordsSuccessAction,
  deleteUserWordErrorAction,
  deleteUserWordSuccessAction,
  saveEditedWordErrorAction,
  saveEditedWordSuccessAction,
  setWordAsFavoriteErrorAction,
  setWordAsFavoriteSuccessAction,
  addWordsFromCsvSuccessAction,
  addWordsFromCsvErrorAction,
  shareWordToGeneralWordsSuccessAction,
  shareWordToGeneralWordsErrorAction
} from '../actions/words.actions';
import { currentLanguageSelector } from '../selectors/language.selector';

@Injectable()
export class WordsEffects {

  constructor(
    private actions$: Actions,
    private wordsService: WordsService,
    private store$: Store<AppStateInterface>,
    private notificationService: NotificationsService,
    private csvHandlerService: CsvHandlerService
  ) { }

  loadWords$ = createEffect(() => this.actions$.pipe(
    ofType(WordsActionsType.FetchWords),
    switchMap(_ => {
      return this.store$.pipe(
        select(currentLanguageSelector),
        take(1),
        switchMap((language: LanguageInterface) =>
          this.wordsService.getAllUserWords$(language)
            .pipe(
              map((words: Word[]) => {
                return fetchWordsSuccessAction({ words });
              }),
              catchError((err: any) => of(fetchWordsErrorAction({ error: err })))
            ))
      )
    })
  ));

  addWord$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WordsActionsType.AddWordToUserWords),
      switchMap(({ word }: { word: Partial<Word> }) => {
        return combineLatest([
          this.store$.pipe(select(currentLanguageSelector), take(1)),
          this.store$.pipe(select(selectedGroupSelector), take(1)),
          of(word)
        ])
      }),
      switchMap(([language, selectedGroup, wordToAdd]: [LanguageInterface, WordGroup, Partial<Word>]) =>
        this.wordsService.addNewWord(wordToAdd, language, selectedGroup._id)
          .pipe(
            map((words: Word[]) => {
              return addWordToUserWordsSuccessAction({ words });
            }),
            catchError((err) => {
              return of(addWordToUserWordsErrorAction({ error: err.error.message }))
            })
          ))
    )
  )

  addWordSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WordsActionsType.AddWordToUserWordsSuccess),
      tap(_ => this.store$.dispatch(fetchGroupsAction()))
    ), { dispatch: false })

  deleteWord$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WordsActionsType.DeleteUserWord),
      switchMap(({ word }: { word: Word }) =>
        this.wordsService.deleteWord(word)
          .pipe(
            map((words: Word[]) => {
              return deleteUserWordSuccessAction({ words });
            }),
            catchError((err) => {
              return of(deleteUserWordErrorAction({ error: err.error.message }))
            })
          ))
    )
  )

  deleteWordSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WordsActionsType.DeleteUserWordsuccess),
      tap(_ => this.store$.dispatch(fetchGroupsAction()))
    ), { dispatch: false })


  saveEditedWord$ = createEffect(
    () => this.actions$.pipe(
      ofType(WordsActionsType.SaveEditedWord),
      switchMap(({ word }: { word: Word }) =>
        this.wordsService.editWord(word)
          .pipe(
            map((words: Word[]) => {
              return saveEditedWordSuccessAction({ words });
            }),
            catchError((err) => {
              return of(saveEditedWordErrorAction({ error: err.error.message }))
            })
          )))
  )


  addWordsFromCsv$ = createEffect(
    () => this.actions$.pipe(
      ofType(WordsActionsType.AddWordsFromCsv),
      switchMap(({ file, selectedGroupId }: { file: File, selectedGroupId?: string }) => {
        if (!file) {
          return of(addWordsFromCsvErrorAction({ error: 'Please select CSV file' }))
        };

        if (!file.name.includes('csv')) {
          return of(addWordsFromCsvErrorAction({ error: 'Please select CSV file' }))
          // this.notification.info('Please select CSV file');
          // return EMPTY;
        }

        return this.wordsService.addNewWordsFromCSV({ file, selectedGroupId })
          .pipe(
            map((words: Word[]) => {
              return addWordsFromCsvSuccessAction({ words });
            }),
            catchError((err) => {
              return of(addWordsFromCsvErrorAction({ error: err.error.message }))
            })
          )
      }))
  )


  markAsFavorite$ = createEffect(
    () => this.actions$.pipe(
      ofType(WordsActionsType.SetWordAsFavorite),
      switchMap(({ word }: { word: Word }) =>

        this.wordsService.editWord({ ...word, isFavorite: !word.isFavorite })
          .pipe(
            map((words: Word[]) => {
              return setWordAsFavoriteSuccessAction();
            }),
            catchError((err) => {
              return of(setWordAsFavoriteErrorAction({ word, error: err.error.message }))
            })
          )))
  )

  shareWordToGeneralWords$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WordsActionsType.ShareWordToGeneralWords),
      switchMap(({ words }: { words: Word[] }) =>
        this.wordsService.shareWordsToGeneralList(words)
          .pipe(
            map(_ => {
              return shareWordToGeneralWordsSuccessAction({});
            }),
            catchError((err) => {
              return of(shareWordToGeneralWordsErrorAction({ error: err.message }))
            })
          ))
    )
  )

  shareWordToGeneralWordsSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WordsActionsType.ShareWordToGeneralWordsSuccess),
      tap(_ => {
        this.notificationService.success('Shared')
      })
    ), { dispatch: false })
}
