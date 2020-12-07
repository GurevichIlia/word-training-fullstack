import { WordAction } from '../../core/enums/word.enum';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil, tap } from 'rxjs/operators';
import { Action } from 'src/app/core';
import { sharedWordMenuItem } from 'src/app/core/models/shared-word.model';
import { GeneralWordsFacade } from './general-words.facade';
import { Store } from '@ngrx/store';
import { AppStateInterface } from 'src/app/store/reducers';
import { addWordToUserWordsAction } from 'src/app/store/actions/words.actions';
import { Word } from 'src/app/shared/interfaces';
import { GeneralWord } from './types/general-words.interfaces';

@Component({
  selector: 'app-general-words',
  templateUrl: './general-words.component.html',
  styleUrls: ['./general-words.component.scss']
})
export class GeneralWordsComponent implements OnInit {
  generalWords$: Observable<GeneralWord[]>;
  wordMenuItems = sharedWordMenuItem;
  subscription$ = new Subject();
  filterValue = new FormControl('');
  userId$: Observable<string>;
  constructor(
    private generalWordsFacade: GeneralWordsFacade,


  ) { }

  ngOnInit() {
    this.generalWordsFacade.fetchGeneralWords()


    this.userId$ = this.generalWordsFacade.userId$.pipe(tap(res => console.log('USER', res)));
    this.generalWords$ = this.generalWordsFacade.generalWords$.pipe(map(words => words.reverse()))

  }



  getActionFromChildren(event: Action<GeneralWord>) {

    switch (event.action) {
      case WordAction.ADD_TO_MY_WORDS: this.addWordToMyWords(event.payload);
        break;
      case WordAction.DELETE_FROM_SHARE_LIST: this.deleteWordFromGeneralList(event.payload._id);
        break;
      default:
        break;
    }
  }


  addWordToMyWords(word: GeneralWord) {
    this.generalWordsFacade.addWordToMyWords(word)
  }

  deleteWordFromGeneralList(wordId: string) {
    this.generalWordsFacade.deleteWordFromGeneralList(wordId)
      .pipe(
        takeUntil(this.subscription$)
      )
      .subscribe(() => null);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscription$.next();
    this.subscription$.complete();
  }
}
