import { VocabularyFacade } from './../vocabulary/vocabulary.facade';
import { switchMap, pluck, catchError } from 'rxjs/operators';
import { NotificationsService } from './../../shared/services/notifications.service';
import { Word, GeneralWord } from 'src/app/shared/interfaces';
import { ApiWordsService } from './../../shared/services/api/api-words.service';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/internal/operators/tap';
import { GeneralFacade } from 'src/app/general.facade';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class GeneralWordsFacade {
  constructor(
    private apiWords: ApiWordsService,
    private generalFacade: GeneralFacade,
    private notification: NotificationsService,
    private vocabularyFacade: VocabularyFacade
  ) {

  }

  getGeneralWords() {
    return this.generalFacade.getCurrentLearningLanguage$()
      .pipe(
        switchMap(language => this.apiWords.getGeneralWordsForAll(language._id))
      );
  }

  addWordToMyWords(word: Word) {
    return this.generalFacade.getCurrentLearningLanguage$()
      .pipe(
        switchMap(language => this.apiWords.addWord(word, language)
          .pipe(
            tap(res => this.notification.success(`${res.newWord.word} ${res.message}`)),
            tap(res => this.generalFacade.updateWordList()),
            catchError(err => {
              this.notification.warning(err.error.message);
              throw err;
            })
          ))
      );


  }


  deleteWordFromGeneralList(wordId: string) {
    return this.apiWords.deleteWordFromGeneralList(wordId)
      .pipe(
        tap(res => console.log('AFTER DELETE FROM GENERAL', res)),
        tap(res => this.notification.success(res.message)),
        tap(res => this.generalFacade.updateWordList())
      );
  }

  filterBySearchValue(searchValue: Observable<string>, words: Observable<GeneralWord[]>) {

    return searchValue.pipe(
      switchMap(value => this.vocabularyFacade.filterBySearcValue(value, words) as Observable<GeneralWord[]>)
    );

  }

  getUserId() {
    return this.apiWords.getUserId().pipe(pluck('userId'));
  }
}
