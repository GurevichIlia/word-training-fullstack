import { fetchGeneralWordsAction } from './../../store/actions/general-words.actions';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, map, startWith, switchMap, tap } from 'rxjs/operators';
import { GeneralFacade } from 'src/app/general.facade';
import { addWordToUserWordsAction } from 'src/app/store/actions/words.actions';
import { AppStateInterface } from 'src/app/store/reducers';
import { WordsService } from './../../core/services/words.service';
import { ApiWordsService } from './../../shared/services/api/api-words.service';
import { NotificationsService } from './../../shared/services/notifications.service';
import { currentUserSelector } from './../authorization/store/selectors/auth.selectors';
import { GeneralWord } from './types/general-words.interfaces';
import { generalWordsSelector } from 'src/app/store/selectors/general-words.selector';



@Injectable({
  providedIn: 'root'
})

export class GeneralWordsFacade {
  private updateGeneralWords$ = new Subject()
  constructor(
    private apiWords: ApiWordsService,
    private generalFacade: GeneralFacade,
    private notification: NotificationsService,
    private wordsService: WordsService,
    private store$: Store<AppStateInterface>
  ) {

  }


  get generalWords$(): Observable<GeneralWord[]> {
    // return this.updateGeneralWords$.pipe(
    //   startWith(''),
    //   switchMap(_ => this.apiWords.getGeneralWordsForAll())
    // )
    return this.store$.pipe(select(generalWordsSelector), filter(words => words !== null))

  }

  fetchGeneralWords() {
    this.store$.dispatch(fetchGeneralWordsAction());

  }

  get userId$(): Observable<string> {
    return this.store$.pipe(select(currentUserSelector), map(user => user._id))
  }

  addWordToMyWords(word: GeneralWord) {
    this.store$.dispatch(addWordToUserWordsAction({ word }))
    //   return this.generalFacade.getCurrentLearningLanguage$()
    //     .pipe(
    //       switchMap(language => this.apiWords.addWord(word, language)
    //         .pipe(
    //           tap(res => this.notification.success(`${res.newWord.word} ${res.message}`)),
    //           tap(res => this.generalFacade.updateWordList()),
    //           catchError(err => {
    //             this.notification.warning(err.error.message);
    //             throw err;
    //           })
    //         ))
    //     );


  }


  deleteWordFromGeneralList(wordId: string) {
    return this.apiWords.deleteWordFromGeneralList(wordId)
      .pipe(
        tap(res => console.log('AFTER DELETE FROM GENERAL', res)),
        tap(res => this.notification.success(res.message)),
        tap(res => this.generalFacade.updateWordList()),
        tap(res => this.updateGeneralWords$.next())
      );
  }

  // getUserId() {
  //   return this.apiWords.getUserId().pipe(pluck('userId'));
  // }
}
