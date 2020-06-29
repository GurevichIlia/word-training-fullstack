import { switchMap, pluck } from 'rxjs/operators';
import { VocabularyFacade } from './../../vocabulary/vocabulary.facade';
import { NotificationsService } from './../../shared/services/notifications.service';
import { Word } from 'src/app/shared/interfaces';
import { ApiWordsService } from './../../shared/services/api/api-words.service';
import { GeneralState } from 'src/app/general.state';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/internal/operators/tap';
import { GeneralFacade } from 'src/app/general.facade';
import { GeneralWord } from '../../../../../src/interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class GeneralWordsFacade {
  constructor(
    private apiWords: ApiWordsService,
    private generalState: GeneralState,
    private generalFacade: GeneralFacade,
    private notification: NotificationsService,
    private vocabularyFacade: VocabularyFacade
  ) {

  }

  getGeneralWords() {
    return this.apiWords.getGeneralWordsForAll(this.generalState.getCurrentLearningLanguage()._id);
  }

  addWordToMyWords(word: Word) {
    const language = this.generalState.getCurrentLearningLanguage();
    return this.apiWords.addWord(word, language)
      .pipe(
        tap(res => this.notification.success('Added to list')),
        tap(res => this.generalFacade.updateWordList())
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
