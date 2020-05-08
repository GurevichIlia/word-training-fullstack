import { takeUntil, startWith } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { VocabularyService } from './../../../vocabulary/vocabulary.service';
import { Subject } from 'rxjs';
import { GeneralFacade } from 'src/app/general.facade';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  subscription$ = new Subject();
  constructor(
    private generaFacade: GeneralFacade
  ) { }

  ngOnInit() {
    this.generaFacade.isUpdateWordList$()
      .pipe(
        startWith(' ')
      )
      .subscribe(() => this.getUserWords());

    this.getWordsGroup();
  }

  getUserWords() {
    this.generaFacade.getAllWordsFromServerAndSetCurrentLanguage()
      .pipe(
        takeUntil(this.subscription$)
      )
      .subscribe(res => {
        this.generaFacade.setWordsQuantity();
      });
  }

  getWordsGroup() {
    this.generaFacade.getWordsGroups()
      .pipe(
        takeUntil(this.subscription$)
      )
      .subscribe();
  }


  ngOnDestroy() {
    this.subscription$.next()
    this.subscription$.complete()
  }
}
