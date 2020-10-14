import { WordAction } from './../../core/enums/word';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil, tap } from 'rxjs/operators';
import { Action } from 'src/app/core';
import { sharedWordMenuItem } from 'src/app/core/models/shared-word.model';
import { GeneralWord, Word } from 'src/app/shared/interfaces';
import { GeneralWordsFacade } from './general-words.facade';

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
    private generalWordsFacade: GeneralWordsFacade

  ) { }

  ngOnInit() {
    this.userId$ = this.generalWordsFacade.getUserId().pipe(tap(res => console.log('USER', res)));
    this.getGeneralWords();

  }

  getGeneralWords() {
    this.generalWords$ = this.generalWordsFacade.filterBySearchValue(
      this.filterValue.valueChanges.pipe(startWith('')),
      this.generalWordsFacade.getGeneralWords().pipe(map(words => words.reverse())));
  }

  getActionFromChildren(event: Action<Word>) {

    switch (event.action) {
      case WordAction.ADD_TO_MY_WORDS: this.addWordToMyWords(event.payload);
        break;
      case WordAction.DELETE_FROM_SHARE_LIST: this.deleteWordFromGeneralList(event.payload._id);
        break;
      default:
        break;
    }
  }


  addWordToMyWords(word: Word) {
    this.generalWordsFacade.addWordToMyWords(word)
      .pipe(
        takeUntil(this.subscription$)
      )
      .subscribe();
  }

  deleteWordFromGeneralList(wordId: string) {
    this.generalWordsFacade.deleteWordFromGeneralList(wordId)
      .pipe(
        tap(res => this.getGeneralWords()),
        takeUntil(this.subscription$)
      )
      .subscribe(() => null);
  }

  updateWordsList() {
    this.getGeneralWords();
    console.log('SWIPED')
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscription$.next();
    this.subscription$.complete();
  }
}
