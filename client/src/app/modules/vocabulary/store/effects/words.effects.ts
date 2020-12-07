// import { addWordToUserWordsErrorAction, addWordToUserWordsSuccessAction, deleteUserWordErrorAction, deleteUserWordSuccessAction, saveEditedWordSuccessAction, saveEditedWordErrorAction } from './../actions/words.actions';
// import { selectedGroupSelector } from './../../groups/store/selectors/groups.selectors';
// import { LanguageInterface } from './../../../languages/types/languages.interfaces';
// import { currentLanguageSelector } from './../../../../store/selectors/language.selector';
// import { Injectable } from '@angular/core';
// import { Actions, createEffect, ofType } from '@ngrx/effects';
// import { select, Store } from '@ngrx/store';
// import { of, combineLatest } from 'rxjs';
// import { switchMap, tap, map, catchError } from 'rxjs/operators';
// import { WordsService } from 'src/app/core/services';
// import { Word, WordGroup } from 'src/app/shared/interfaces';
// import { AppStateInterface } from 'src/app/store/reducers';
// import { WordsActionsType, fetchWordsSuccessAction, fetchWordsErrorAction } from '../actions/words.actions';

// @Injectable()
// export class WordsEffects {

//   constructor(
//     private actions$: Actions,
//     private wordsService: WordsService,
//     private store$: Store<AppStateInterface>
//   ) { }

//   loadWords$ = createEffect(() => this.actions$.pipe(
//     ofType(WordsActionsType.FetchWords),
//     switchMap(_ => {
//       return this.store$.pipe(
//         select(currentLanguageSelector),
//         switchMap((language: LanguageInterface) =>
//           this.wordsService.getAllUserWords$(language)
//             .pipe(
//               map((words: Word[]) => {
//                 return fetchWordsSuccessAction({ words });
//               }),
//               catchError((err: any) => of(fetchWordsErrorAction({ error: err })))
//             ))
//       )
//     })
//   ));

//   addWord$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(WordsActionsType.AddWordToUserWords),
//       switchMap(({ word }: { word: Partial<Word> }) => {
//         return combineLatest([
//           this.store$.pipe(select(currentLanguageSelector)),
//           this.store$.pipe(select(selectedGroupSelector)),
//           of(word)
//         ])
//       }),
//       switchMap(([language, selectedGroup, wordToAdd]: [LanguageInterface, WordGroup, Partial<Word>]) =>
//         this.wordsService.addNewWord(wordToAdd, language, selectedGroup._id)
//           .pipe(
//             map((words: Word[]) => {
//               return addWordToUserWordsSuccessAction({ words });
//             }),
//             catchError((err) => {
//               return of(addWordToUserWordsErrorAction({ error: err.error.message }))
//             })
//           ))
//     )
//   )

//   deleteWord$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(WordsActionsType.DeleteUserWord),
//       switchMap(({ word }: { word: Word }) =>
//         this.wordsService.deleteWord(word)
//           .pipe(
//             map((words: Word[]) => {
//               return deleteUserWordSuccessAction({ words });
//             }),
//             catchError((err) => {
//               return of(deleteUserWordErrorAction({ error: err.error.message }))
//             })
//           ))
//     )
//   )

//   saveEditedWord$ = createEffect(
//     () => this.actions$.pipe(
//       ofType(WordsActionsType.SaveEditedWord),
//       switchMap(({ word }: { word: Word }) =>
//         this.wordsService.editWord(word)
//           .pipe(
//             map((words: Word[]) => {
//               return saveEditedWordSuccessAction({ words });
//             }),
//             catchError((err) => {
//               return of(saveEditedWordErrorAction({ error: err.error.message }))
//             })
//           )))
//   )

// }

