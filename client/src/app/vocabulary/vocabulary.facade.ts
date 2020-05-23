import { WordGroup } from 'src/app/shared/interfaces';
import { GeneralFacade } from 'src/app/general.facade';
import { ApiWordsService } from './../shared/services/api/api-words.service';
import { BehaviorSubject, of, Observable, combineLatest } from 'rxjs';
import { Injectable } from '@angular/core';
import { GeneralState } from '../general.state';
import { startWith, switchMap, map, tap, filter } from 'rxjs/operators';
import { Word } from '../shared/interfaces';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class VocabularyFacade {
  constructor(
    private generalState: GeneralState,
    private apiWords: ApiWordsService,
    private generalFacade: GeneralFacade
  ) {

  }


  getAllUserWords$() {
    return this.generalState.getUserWords$()
      .pipe(
        filter(words => words !== null)
      );
  }

  getUserWordsFiltredByGroup(selectedGroup$: Observable<string>, searchValue$: Observable<string>) {
    return combineLatest([selectedGroup$.pipe(startWith('1')), searchValue$.pipe(startWith(''))])
      .pipe(
        switchMap(([groupId, searchValue]) => {
          const All_GROUPS = '1';
          const FAVORITES = '2';
          if (groupId === All_GROUPS) {

            return this.filterBySearcValue(searchValue, this.getAllUserWords$());

          } else if (groupId === FAVORITES) {

            return this.filterBySearcValue(searchValue, this.filterWordsByFavorite(this.getAllUserWords$()));

          } else {

            return this.filterBySearcValue(searchValue, this.getAllUserWords$()
              .pipe(
                map(words => words.filter(word => word.assignedGroups.includes(groupId)))
              ))
          }

        }),
        // map(words => words.reverse()),
        tap(res => console.log('WORDS', res))

      )
  }

  filterBySearcValue(searchValue: string, words: Observable<Word[]>) {
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

  getWordsGroups$() {
    return this.generalState.getWordsGroups$()

  }

  filterWordsByFavorite(allWords: Observable<Word[]>) {
    return allWords.pipe(
      map(words => words.filter(word => word.isFavorite))
    )
  }

  addNewWord(word: Word) {
    const language = this.generalState.getCurrentLearningLanguage();
    return this.apiWords.addWord(word, language);
  }

  updateWordList() {
    this.generalFacade.updateWordList();
  }

  editWord(word: Word) {
    const language = this.generalState.getCurrentLearningLanguage();

    return this.apiWords.editWord(word, language)
  }

  deleteWordFromServer(wordId: string) {
    return this.apiWords.deleteWordFromServer(wordId);

  }

  assignGroup() {
    // return this.http.post<Word>(`/api/word-group/assign-group`, { groupId, selectedWords });
    of([])
  }

  createWordGroup(name: string) {

    return of([])
  }
}
