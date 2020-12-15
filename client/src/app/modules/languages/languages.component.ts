import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { GeneralFacade } from 'src/app/general.facade';
import { NotificationsService } from 'src/app/shared/services/notifications.service';
import { AppStateInterface } from 'src/app/store/reducers';
import { LanguagesService } from './languages.service';
import { DeleteUserLanguageAction, FetchAllLanguagesAction, FetchUserLanguagesAction, setCurrentLearningLanguageAction } from './store/actions/languages.actions';
import {
  currentLanguageSelector,
} from '../../store/selectors/language.selector';
import { ActiveLanguagesTab } from './types/languages.enums';
import { LanguageInterface } from './types/languages.interfaces';
import { activeTabSelector, allLanguagesSelector, userlanguagesSelector, isLoadingSelector } from './store/selectors/languages.selectors';
import { selectVocabularyGroupAction } from 'src/app/store/actions/vocabulary.actions';
import { defaultGroups } from 'src/app/core/models/groups.model';


@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss']
})
export class LanguagesComponent implements OnInit, OnDestroy {

  allLanguages$: Observable<LanguageInterface[]>;
  userLanguages$: Observable<LanguageInterface[]>;
  activeTab$: Observable<ActiveLanguagesTab>;
  currentLearningLanguage$: Observable<LanguageInterface>;
  subscription$ = new Subject();
  isLoading$: Observable<boolean>

  languageIdCandidateToLearn: string;

  constructor(
    private notifications: NotificationsService,
    private languagesService: LanguagesService,
    private router: Router,
    private generalFacade: GeneralFacade,
    private store$: Store<AppStateInterface>
  ) {
  }

  ngOnInit() {
    this.fetchData()
    this.initializeValues()

  }

  initializeValues() {
    this.currentLearningLanguage$ = this.store$.pipe(select(currentLanguageSelector))
    this.userLanguages$ = this.store$.pipe(select(userlanguagesSelector))
    this.allLanguages$ = this.store$
      .pipe(
        select(allLanguagesSelector),
        filter(languages => languages !== null),
        // switchMap(languages => this.languagesService.markLanguageAsAddedToUserLanguages(languages, this.userLanguages$))
      )
    // switchMap(allLanguages => this.languagesService.markAsAddedToUserLanguages(allLanguages, this.userLanguages$)))
    this.activeTab$ = this.store$.pipe(select(activeTabSelector))
    this.isLoading$ = this.store$.pipe(select(isLoadingSelector))
  }

  fetchData() {
    this.store$.dispatch(FetchAllLanguagesAction())
    this.store$.dispatch(FetchUserLanguagesAction())

  }
  // getCurrentLearningLanguage() {
  //   this.currentLearningLanguage$ = this.languagesService.getCurrentLearningLanguage$();

  // }

  // getAllLanguages() {
  //   this.allLanguages$ = combineLatest([this.languagesService.getAllLanguages(), this.userLanguages$])
  //     .pipe(
  //       map(([allLanguages, userLanguages]) => {

  //         return allLanguages.map(language => {
  //           const foundLanguage = userLanguages.find(userLanguage => language._id === userLanguage._id);
  //           if (foundLanguage) {
  //             return { ...foundLanguage, isSelected: true };
  //           } else {
  //             return { ...language, isSelected: false };
  //           }

  //         });
  //       }),
  //       map(languages => languages.map(language => this.languagesService.addFlagToLanguage(language))),

  //       shareReplay(),
  //       tap(res => console.log('ALL LANGUAGES', res)));
  // }

  // getUserLanguages() {
  //   this.userLanguages$ = this.languagesService.getUserLanguages()
  //     .pipe(
  //       tap(languages => console.log('USER LANGUAGES', languages)),
  //       // tap(languages => languages.length > 0 ? this.selectedTab = 0 : this.selectedTab = 1),

  //       // tap(langauges => langauges.length === 0 ? this.setCurrentLearningLanguage('') : ''),
  //       map(languages => languages.map(langauge => ({ ...langauge, isSelected: true }))),

  //     );

  // }

  goToVocabulary() {
    this.router.navigate(['vocabulary']);
  }

  setCurrentLearningLanguage({ languageId, userLanguages }) {
    if (userLanguages.length === 0) {
      return this.notifications.warning('', 'Please add language');
    }

    if (languageId) {
      this.languageIdCandidateToLearn = null;
      this.setCurrentLanguageOnServer(languageId)
    } else {
      this.notifications.warning('', 'Please select language');
    }
  }

  setCurrentLanguageOnServer(languageId) {

    this.store$.dispatch(setCurrentLearningLanguageAction({ languageId }))
    const ALL_WORDS = 0
    this.store$.dispatch(selectVocabularyGroupAction({ group: defaultGroups[ALL_WORDS] }))

    // this.languagesService.setCurrentLanguageOnServer(languageId).
    // pipe(
    //   takeUntil(this.subscription$)
    // )
    // .subscribe(res => {
    //   if (res && res.currentLanguage && res.currentLanguage._id) {
    //     // this.languagesService.setCurrentLearningLanguage({ ...res.currentLanguage });
    //     // this.store$.dispatch(setLearninLanguageAction({ currentLanguage: res.currentLanguage }))
    //     this.goToVocabulary();
    //   }
    // },
    //   err => this.notifications.error('', err.error.message));
  }


  // onEdit(langId: string) {
  //   if (langId) {
  //     this.editingLanguage$ = this.findLanguage(langId, this.allLanguages$);
  //     this.changeMode('editlanguage');
  //   } else {
  //     this.notifications.warning('', 'Please select language');
  //   }
  // }


  // findLanguage(id: string, languages$: Observable<LanguageInterface[]>) {
  //   return languages$
  //     .pipe(
  //       map(languages => languages.find(lang => lang._id === id))
  //     );
  // }

  // addLanguageToUserLanguages(language: LanguageInterface) {
  //   this.languageIdCandidateToLearn = language._id;
  //   // this.languagesService.addUserLanguages([language])
  //   //   .pipe(
  //   //     takeUntil(this.subscription$)
  //   //   )
  //   //   .subscribe(res => {

  //   //     this.getAllLanguages();
  //   //     this.getUserLanguages();
  //   //     console.log('AFTER ADD LANGUAGES', res);
  //   //   }, err => this.notifications.error('', err.error.message));

  // }

  // deleteUserLanguage(languageId: string) {
  //   this.store$.dispatch(DeleteUserLanguageAction({ languageId }))
  //   // this.languagesService.deleteUserLanguage(languageId)
  //   //   .pipe(
  //   //     tap(res => this.generalFacade.setCurrentLanguage(null)),
  //   //     takeUntil(this.subscription$)
  //   //   )
  //   //   .subscribe(res => {

  //   //     this.getUserLanguages();
  //   //     this.getAllLanguages();
  //   //     this.getCurrentLearningLanguage();
  //   //     console.log('AFTER Delete LANGUAGE', res);
  //   //   }, err => this.notifications.error('', err.error.message));

  // }

  unsubscribe() {
    this.subscription$.next();
    this.subscription$.complete();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.

  }
}
