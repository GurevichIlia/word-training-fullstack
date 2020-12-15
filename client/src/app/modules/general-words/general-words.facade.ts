import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { GeneralFacade } from 'src/app/general.facade';
import { addWordToUserWordsAction } from 'src/app/store/actions/vocabulary.actions';
import { AppStateInterface } from 'src/app/store/reducers';
import { generalWordsSelector } from 'src/app/store/selectors/general-words.selector';
import { WordsService } from './../../core/services/words.service';
import { ApiWordsService } from './../../shared/services/api/api-words.service';
import { NotificationsService } from './../../shared/services/notifications.service';
import { deleteGeneralWordAction, fetchGeneralWordsAction } from './../../store/actions/general-words.actions';
import { isLoadingSelector } from './../../store/selectors/general-words.selector';
import { currentUserSelector } from './../authorization/store/selectors/auth.selectors';
import { GeneralWord } from './types/general-words.interfaces';



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

  get isLoading$(): Observable<boolean> {
    return this.store$.pipe(select(isLoadingSelector))
  }

  addWordToMyWords(word: GeneralWord) {
    this.store$.dispatch(addWordToUserWordsAction({ word }))

  }


  deleteWordFromGeneralList(word: GeneralWord) {
    this.store$.dispatch(deleteGeneralWordAction({ word }))
    // return this.apiWords.deleteWordFromGeneralList(wordId)
    //   .pipe(
    //     tap(res => console.log('AFTER DELETE FROM GENERAL', res)),
    //     tap(res => this.notification.success(res.message)),
    //     tap(res => this.generalFacade.updateWordList()),
    //     tap(res => this.updateGeneralWords$.next())
    //   );
  }

  // getUserId() {
  //   return this.apiWords.getUserId().pipe(pluck('userId'));
  // }
}
