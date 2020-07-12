import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NbMenuItem, NbMenuService } from '@nebular/theme';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { GeneralFacade } from 'src/app/general.facade';
import { Language, User } from '../../../shared/interfaces';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn$: Observable<boolean>;
  themeControl: FormControl;
  user: User;
  unsubscribe$ = new Subject();
  currentLanguage$: Observable<Language>;
  quantityWords$: Observable<number>;
  items: NbMenuItem[] = [
    { title: 'Vocabulary', link: 'vocabulary' },
    { title: 'Word train', link: 'word-training' },
    { title: 'Change language', link: 'languages' },
    { title: 'Log out', link: '/login', icon: 'log-out' }];

  location$: Observable<{ name: string }>
  constructor(
    private authService: AuthService,
    private menuService: NbMenuService,
    private generalFacade: GeneralFacade

  ) {
    this.themeControl = new FormControl('');
  }
  get theme() {
    return this.themeControl;
  }
  ngOnInit() {
    this.getIsLoggedIn();
    this.getUserName();
    this.menuService.onItemClick()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(data => {
        if (data.item.title === 'Log out') {
          this.logout();
        }
      });
    this.getquantityWords();
  }

  getUserName() {

    this.user = this.authService.getCurrentUser();
  }

  getIsLoggedIn() {
    this.isLoggedIn$ = this.authService.isAuthenticated$().pipe(tap(res => console.log(res)));
  }

  logout() {
    // console.log('log')
    this.authService.logOut();
  }

  getCurrentLanguage() {
    this.currentLanguage$ = this.generalFacade.getCurrentLearningLanguage$().pipe(tap(lang => console.log('LANGUAGE HEADER', lang)));
  }

  getquantityWords() {
    this.quantityWords$ = this.generalFacade.getWordsQuantity$()
      .pipe(
        tap(q => console.log('QUANTITY', q)),
        tap(() => this.getCurrentLanguage()));
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
