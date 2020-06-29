import { GeneralWord } from './../../../../../src/interfaces';
import { takeUntil, map, tap, startWith } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { GeneralWordsFacade } from './general-words.facade';
import { MenuItem, Word, User } from 'src/app/shared/interfaces';
import { Subject } from 'rxjs/internal/Subject';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-general-words',
  templateUrl: './general-words.component.html',
  styleUrls: ['./general-words.component.scss']
})
export class GeneralWordsComponent implements OnInit {
  generalWords$: Observable<GeneralWord[]>;
  wordMenuItems = [
    new MenuItem('Add to my words', 'ADD TO MY WORDS', 'plus-square-outline'),
    new MenuItem('Delete from shared', 'DELETE FROM GENERAL LIST', 'trash-2-outline'),
  ];
  subscription$ = new Subject();
  filterValue = new FormControl('');
  userId$: Observable<string>;
  constructor(
    private generalWordsFacade: GeneralWordsFacade

  ) { }

  ngOnInit() {
    this.userId$ = this.generalWordsFacade.getUserId().pipe(tap(res => console.log('USER', res)))
    this.getGeneralWords();

  }

  getGeneralWords() {
    this.generalWords$ = this.generalWordsFacade.filterBySearchValue(
      this.filterValue.valueChanges.pipe(startWith('')),
      this.generalWordsFacade.getGeneralWords().pipe(map(words => words.reverse())));
  }
  getActionFromChildren(event: { action: string, payload: Word }) {


    switch (event.action) {
      case 'ADD TO MY WORDS': this.addWordToMyWords(event.payload);
        break;
      case 'DELETE FROM GENERAL LIST': this.deleteWordFromGeneralList(event.payload._id);
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
      .subscribe();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscription$.next();
    this.subscription$.complete();
  }
}
