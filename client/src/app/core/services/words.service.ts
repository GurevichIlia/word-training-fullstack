import { Injectable } from '@angular/core';
import { EMPTY, Observable, Subject } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { GeneralWord, Word, WordGroup } from 'src/app/shared/interfaces';
import { ApiWordsService } from 'src/app/shared/services/api/api-words.service';
import { GeneralFacade } from './../../general.facade';
import { ALL_WORDS_GROUP, FAVORITES, GeneralState } from './../../general.state';
import { NotificationsService } from './../../shared/services/notifications.service';

@Injectable({
  providedIn: 'root'
})
export class WordsService {
  private updateUsersWordList$ = new Subject<void>();
  constructor(
    private generalState: GeneralState,
    private apiWords: ApiWordsService,
    private notification: NotificationsService,
    private generalFacade: GeneralFacade

  ) { }

  // getAllUserWords$() {
  //   return this.generalState.getUserWords$()
  //     .pipe(
  //       filter(words => words !== null)
  //     );
  // }

  getAllUserWords$(): Observable<Word[]> {
    if (!this.generalState.getUserWords()) {
      return this.generalFacade.getCurrentLearningLanguage$()
        .pipe(
          switchMap(lang => this.updateUsersWordList$.pipe(
            startWith(''),
            switchMap(_ => {
              debugger
              return this.apiWords.getWordsFromServerForUser(lang._id)
            })
          ).pipe(
            switchMap(words => {
              this.generalState.setUserWords(words);
              this.setWordsQuantity();
              return this.generalState.getUserWords$();
            })
          ))
        )
    }

    return this.generalState.getUserWords$();
  }

  filterWordsByGroup(selectedGroup$: Observable<WordGroup>): Observable<Word[]> {
    return selectedGroup$.pipe(startWith(ALL_WORDS_GROUP))
      .pipe(
        switchMap((group: WordGroup) => {
          if (group._id === ALL_WORDS_GROUP._id) {

            return this.getAllUserWords$();

          } else if (group._id === FAVORITES._id) {

            return this.filterWordsByFavorite(this.getAllUserWords$());

          } else {

            return this.getAllUserWords$().pipe(map(words => words.filter(word => word.assignedGroups.includes(group._id))))
          }

        }),
      );
  }

  filterBySearcValue(searchValue: string, words: Observable<(Word | GeneralWord)[]>) {
    return words
      .pipe(
        map(wordsForFilter => {

          if (searchValue) {

            return wordsForFilter.filter(word => word.word.toLowerCase().includes(searchValue.toLowerCase()) ||
              word.translation.toLowerCase().includes(searchValue.toLowerCase()));

          } else {

            return wordsForFilter;

          }
        }));
  }

  private filterWordsByFavorite(allWords: Observable<Word[]>) {
    return allWords.pipe(
      map(words => words.filter(word => word.isFavorite))
    );
  }

  addNewWordsFromCSV({ file, selectedGroupId }: { file: File, selectedGroupId?: string }) {
    const formData = new FormData();
    formData.append('csvFile', file, 'csvFile');

    return this.generalState.getCurrentLearningLanguage$()
      .pipe(
        switchMap(language => {
          const assignedGroups = JSON.stringify([ALL_WORDS_GROUP._id, selectedGroupId]);
          console.log('GROUPS', assignedGroups);
          return this.apiWords.addWordsFromCSV(formData, language, assignedGroups);
        }),
        catchError(err => {
          this.notification.error('Something went wrong, file was not uploaded');
          console.log('Uploading error', err);

          return EMPTY;
        }));
  }

  setWordsQuantity() {
    this.generalState.setQuantityWords$(this.generalState.getUserWords().length);
  }

  updateUsersWordList(): void {
    this.updateUsersWordList$.next();
  }
}
