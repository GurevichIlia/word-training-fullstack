import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { GeneralFacade } from 'src/app/general.facade';
import { AppStateInterface } from 'src/app/store/reducers';
import { globalLoaderSelector } from 'src/app/store/selectors/general.selector';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  subscription$ = new Subject();
  globalLoader$: Observable<boolean>

  // currentLearningLanguage
  constructor(
    private generaFacade: GeneralFacade,
    private router: Router,
    private store$: Store<AppStateInterface>

  ) {
  }

  ngOnInit() {
    this.globalLoader$ = this.store$.pipe(select(globalLoaderSelector))

    // this.store$.dispatch(getLearningLanguageAction())


    // this.store$.pipe(
    //   select(currentUserSelector),
    //   tap(res => console.log('USER', res)),
    //   filter(currentUser => currentUser !== null),
    //   takeUntil(this.subscription$)
    // ).subscribe(({ currentLanguage }) => {
    //   if (currentLanguage) {
    //     this.store$.dispatch(setLearninLanguageAction({ currentLanguage }))
    //   }


    // })



    // // this.checkRoute();
    // this.generaFacade.isUpdateWordList$()
    //   .pipe(
    //     startWith(' '),
    //     takeUntil(this.subscription$)

    //   )
    //   .subscribe(() => {
    //     this.getUserWords();
    //   });
  }

  // getUserWords() {
  //   this.generaFacade.getUserWordsFromServer()
  //     .pipe(
  //       take(1),
  //       takeUntil(this.subscription$)

  //     ).subscribe(() => console.log('USER WORD'));
  // }

  // checkRoute() {
  //   this.router.events.subscribe(res => console.log('ROUTE', res));
  // }

  ngOnDestroy() {
    this.subscription$.next();
    this.subscription$.complete();
  }
}
