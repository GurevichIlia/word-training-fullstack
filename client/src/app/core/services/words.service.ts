import { LanguageInterface } from 'src/app/modules/languages/types/languages.interfaces';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { EMPTY, Observable, of, Subject, throwError } from 'rxjs';
import { catchError, map, startWith, switchMap, tap } from 'rxjs/operators';
import { Word, WordGroup } from 'src/app/shared/interfaces';
import { ApiWordsService } from 'src/app/shared/services/api/api-words.service';
import { GeneralFacade } from './../../general.facade';
import { ALL_WORDS_GROUP, FAVORITES, GeneralState } from './../../general.state';
import { NotificationsService } from './../../shared/services/notifications.service';
import { GeneralWord } from 'src/app/modules/general-words/types/general-words.interfaces';

@Injectable({
  providedIn: 'root'
})
export class WordsService {
  private updateUsersWordList$ = new Subject<void>();
  constructor(
    private generalState: GeneralState,
    private apiWords: ApiWordsService,
    private notification: NotificationsService,
    private generalFacade: GeneralFacade,
    private store$: Store

  ) { }

  // getAllUserWords$() {
  //   return this.generalState.getUserWords$()
  //     .pipe(
  //       filter(words => words !== null)
  //     );
  // }

  getAllUserWords$(language: LanguageInterface): Observable<Word[]> {
    // return this.generalFacade.getCurrentLearningLanguage$()
    //   .pipe(
    //     switchMap((lang: Language): Observable<Word[]> => {
    //       return this.apiWords.getWordsFromServerForUser(lang._id);
    //     })
    //   );


    return this.apiWords.getWordsFromServerForUser(language._id)
      .pipe(
        // map(words => this.convertToArray(words)),
        map(res => res.words),
        tap(words => console.log('WORDS FROM SERVER', words))
      );



    // if (!this.generalState.getUserWords()) {
    //   return this.generalFacade.getCurrentLearningLanguage$()
    //     .pipe(
    //       switchMap(lang => this.updateUsersWordList$.pipe(
    //         startWith(''),
    //         switchMap(_ => {
    //           return this.apiWords.getWordsFromServerForUser(lang._id)
    //         })
    //       ).pipe(
    //         switchMap(words => {
    //           this.generalState.setUserWords(words);
    //           this.setWordsQuantity();
    //           return this.generalState.getUserWords$();
    //         })
    //       ))
    //     )
    // }

    // return this.generalState.getUserWords$();
  }

  addNewWord(word: Partial<Word>, language: LanguageInterface, selectedGroupId?: string): Observable<Word[]> {
    const updatedWord = { ...word, assignedGroups: [ALL_WORDS_GROUP._id, selectedGroupId] };

    return this.apiWords.addWord(updatedWord, language)
      .pipe(
        // map(res => this.convertToArray(res.words)),
        map(res => res.words),
        // map(words => words.reverse()),
        catchError(err => {
          return throwError(err)
        }),
      )
  }

  deleteWord(word: Word): Observable<Word[]> {
    return this.apiWords.deleteWordFromServer(word._id)
      .pipe(
        // map(res => this.convertToArray(res.words)),
        map(res => res.words),

        catchError(err => {
          return throwError(err)
        }),
      )
  }

  editWord(word: Word): Observable<Word[]> {
    return this.apiWords.editWord(word)
      .pipe(
        // map(res =>
        //   // this.convertToArray(res.words)
        // ),
        map(res => res.words),

        catchError(err => {
          return throwError(err)
        }),
      )
  }

  private convertToArray<T, K extends keyof T>(obj: T): T[K][] {
    const keys = Object.keys(obj)

    const arr: T[K][] = []

    if (keys.length > 0) {
      keys.forEach(key => arr.push(obj[key]))

    }

    return arr
  }

  // filterWordsByGroup(selectedGroup$: Observable<WordGroup>, words$: Observable<Word[]>): Observable<Word[]> {
  //   return selectedGroup$.pipe(startWith(ALL_WORDS_GROUP))
  //     .pipe(
  //       switchMap((group: WordGroup) => {
  //         if (group._id === ALL_WORDS_GROUP._id) {

  //           return words$;

  //         } else if (group._id === FAVORITES._id) {

  //           return this.filterWordsByFavorite(words$);

  //         } else {
  //           return words$
  //             .pipe(map(words => {
  //               return words.filter(word => word.assignedGroups.includes(group._id))
  //             }))
  //         }

  //       }),
  //     );
  // }

  filterWordsByGroup(selectedGroup: WordGroup, words: Word[]): Word[] {
    if (!selectedGroup) return
    if (selectedGroup._id === ALL_WORDS_GROUP._id) {

      return words;

    } else if (selectedGroup._id === FAVORITES._id) {

      return this.filterWordsByFavorite(words);

    } else {

      return words.filter(word => word.assignedGroups.includes(selectedGroup._id))

    }


  }
  filterBySearcValue(searchValue: string, words: (Word | GeneralWord)[]) {
    if (searchValue) {

      return words.filter(word => word.word.toLowerCase().includes(searchValue.toLowerCase()) ||
        word.translation.toLowerCase().includes(searchValue.toLowerCase()));

    } else {

      return words;

    }

  }

  private filterWordsByFavorite(allWords: Word[]) {
    return allWords.filter(word => word.isFavorite)
  }
  // filterBySearcValue(searchValue: string, words: Observable<(Word | GeneralWord)[]>) {
  //   return words
  //     .pipe(
  //       map(wordsForFilter => {

  //         if (searchValue) {

  //           return wordsForFilter.filter(word => word.word.toLowerCase().includes(searchValue.toLowerCase()) ||
  //             word.translation.toLowerCase().includes(searchValue.toLowerCase()));

  //         } else {

  //           return wordsForFilter;

  //         }
  //       }));
  // }

  // private filterWordsByFavorite(allWords: Observable<Word[]>) {
  //   return allWords.pipe(
  //     map(words => words.filter(word => word.isFavorite))
  //   );
  // }

  addNewWordsFromCSV({ file, selectedGroupId }: { file: File, selectedGroupId?: string }) {
    const formData = new FormData();
    formData.append('csvFile', file, 'csvFile');

    // return this.generalState.getCurrentLearningLanguage$()
    //   .pipe(
    //     switchMap(language => {
    const assignedGroups = JSON.stringify([ALL_WORDS_GROUP._id, selectedGroupId]);
    console.log('GROUPS', assignedGroups);
    return this.apiWords.addWordsFromCSV(formData, assignedGroups).pipe(
      catchError(err => {
        this.notification.error('Something went wrong, file was not uploaded');
        console.log('Uploading error', err);

        return EMPTY;
      })
    )
    // }),

  }

  shareWordsToGeneralList(words: Word[]) {
    return this.apiWords.addWordsToGeneralList(words)
      .pipe(
        catchError(err => {
          return throwError(err)
        }),
      )
  }


  setWordsQuantity() {
    this.generalState.setQuantityWords$(this.generalState.getUserWords().length);
  }

  updateUsersWordList(): void {
    this.updateUsersWordList$.next();
  }
}
