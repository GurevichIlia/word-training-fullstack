import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { filter, map, startWith, switchMap, tap } from 'rxjs/operators';
import { GeneralFacade } from 'src/app/general.facade';
import { GeneralState } from '../general.state';
import { Word } from '../shared/interfaces';
import { ApiWordsService } from './../shared/services/api/api-words.service';

export const ALL_WORDS = '1';
export const FAVORITES = '2';
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
    return combineLatest([selectedGroup$.pipe(startWith(ALL_WORDS)), searchValue$.pipe(startWith(''))])
      .pipe(
        switchMap(([groupId, searchValue]) => {

          if (groupId === ALL_WORDS) {

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
    return this.generalState.getWordsGroups$();

  }

  filterWordsByFavorite(allWords: Observable<Word[]>) {
    return allWords.pipe(
      map(words => words.filter(word => word.isFavorite))
    );
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

  updateWord(word: Word) {
    const words = this.generalState.getUserWords().map(existWord => existWord._id === word._id ? { ...existWord, ...word } : existWord);

    this.generalState.setUserWords(words);
  }

  parseText(text: string) {

    for (let i = 0; i < text.length; i++) {
      const letter = text[i];
      if (letter === '{') {
        debugger
        const start = i > 9 ? (i - 4) : (i - 3)
        const cutted = text.slice(i, text.indexOf('}'));
        console.log(cutted);
      }
      // const line = text.substr(text.indexOf(i.toString()), text.indexOf((i + 1).toString()));

    }
    console.log(text)

    // const splited = text.split(/\n/g).map(stringFromText => {
    //   const newString = stringFromText.substr(stringFromText.indexOf('{'), stringFromText.indexOf('}'))
    //   const cutString = newString.slice(1, -1);
    //   const array = cutString.split(',').map(val => {
    //     const newval = val.split(':');
    //     return { [newval[0].replace('"', '')]: newval[1] };
    //   });
    //   return array
    // });
    // console.log(splited);


  }
}
