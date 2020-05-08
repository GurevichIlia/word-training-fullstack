import { GeneralFacade } from 'src/app/general.facade';
import { ApiWordsService } from './../shared/services/api/api-words.service';
import { BehaviorSubject, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { GeneralState } from '../general.state';
import { startWith, switchMap, map, tap } from 'rxjs/operators';
import { Word } from '../shared/interfaces';

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
    return this.generalState.getUserWords$();
  }

  getUserWordsFiltredByGroup(selectedGroup$: BehaviorSubject<string>) {
    return selectedGroup$
      .pipe(
        startWith('1'),
        switchMap(groupId => {
          if (groupId === '1') {
            return this.getAllUserWords$()
          } else {
            return this.getAllUserWords$()
              .pipe(
                map(words => words.filter(word => word.assignedGroups.includes(groupId)))
              )
          }

        }),
        map(words => words.reverse()),
        tap(res => console.log('WORDS', res))

      )
  }

  getWordsGroups$() {
    return this.generalState.getWordsGroups$();
  }

  addNewWord(word: Word) {
    const language = this.generalState.getCurrentLearningLanguage();
    return this.apiWords.addWord(word, language);
  }

  updateWordList() {
    this.generalFacade.updateWordList();
  }

  editWord(word: Word) {
    return of([])
  }

  deleteWordFromServer(wordId: string) {
    return of([])

  }

  assignGroup() {
    // return this.http.post<Word>(`/api/word-group/assign-group`, { groupId, selectedWords });
    of([])
  }

    createWordGroup(name: string, ) {

    return of([])
  }
}
