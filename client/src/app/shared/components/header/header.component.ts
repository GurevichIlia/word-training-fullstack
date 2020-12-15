import { allWordsQuantitySelector, allWordsSelector } from './../../../store/selectors/vocabulary.selectors';
import { LanguageInterface } from 'src/app/modules/languages/types/languages.interfaces';
import { isLoggedInSelector } from '../../../modules/authorization/store/selectors/auth.selectors';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NbMenuItem, NbMenuService } from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { Observable, pipe, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { GeneralFacade } from 'src/app/general.facade';
import { AppStateInterface } from 'src/app/store/reducers';
import { CurrentUserInterface } from '../../../shared/interfaces';
import { AuthService } from 'src/app/modules/authorization/services/auth.service';
import { currentLanguageSelector } from 'src/app/store/selectors/language.selector';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn$: Observable<boolean>;
  // themeControl: FormControl;
  user: CurrentUserInterface;
  unsubscribe$ = new Subject();
  currentLanguage$: Observable<LanguageInterface>;
  quantityWords$: Observable<number>;
  // items: NbMenuItem[] = [
  //   { title: 'Vocabulary', link: 'vocabulary' },
  //   { title: 'Word train', link: 'word-training' },
  //   { title: 'Change language', link: 'languages' },
  //   { title: 'Log out', link: '/login', icon: 'log-out' }];

  location$: Observable<string> = this.generalFacade.getLocation$();
  constructor(
    private authService: AuthService,
    private menuService: NbMenuService,
    private generalFacade: GeneralFacade,
    private store$: Store<AppStateInterface>


  ) {
    //   this.themeControl = new FormControl('');
    // }
    // get theme() {
    //   return this.themeControl;
  }
  ngOnInit() {
    this.isLoggedIn$ = this.store$.pipe(select(isLoggedInSelector), tap(e => console.log('IS LOGGED', e)))
    this.currentLanguage$ = this.store$.pipe(select(currentLanguageSelector), tap(lang => console.log('LANGUAGE HEADER', lang)));

    // this.menuService.onItemClick()
    //   .pipe(
    //     takeUntil(this.unsubscribe$)
    //   )
    //   .subscribe(data => {
    //     if (data.item.title === 'Log out') {
    //       this.logout();
    //     }
    //   });
    this.getquantityWords();
  }


  // getIsLoggedIn() {
  //   this.isLoggedIn$ = this.authService.isAuthenticated$().pipe(tap(res => console.log(res)));
  // }



  // getCurrentLanguage() {
  //   this.currentLanguage$ = this.generalFacade.getCurrentLearningLanguage$().pipe(tap(lang => console.log('LANGUAGE HEADER', lang)));
  // }

  getquantityWords() {
    this.quantityWords$ = this.store$.pipe(select(allWordsQuantitySelector))
      .pipe(
        tap(q => console.log('QUANTITY', q)),
        // tap(() => this.getCurrentLanguage())
      );
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
