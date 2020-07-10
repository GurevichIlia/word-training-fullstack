
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, shareReplay, takeUntil, tap } from 'rxjs/operators';
import { Language } from '../shared/interfaces';
import { NotificationsService } from './../shared/services/notifications.service';
import { LanguagesService } from './languages.service';





@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss']
})
export class LanguagesComponent implements OnInit, OnDestroy {

  allLanguages$: Observable<Language[]>;
  userLanguages$: Observable<Language[]>;

  currentLearningLanguage$: Observable<Language>;
  subscription$ = new Subject();
  languageIdCandidateToLearn: string;
  selectedTab: 0 | 1;
  constructor(
    private notifications: NotificationsService,
    private languagesService: LanguagesService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.getUserLanguages();
    this.getAllLanguages();

    this.getCurrentLearningLanguage();

  }

  getCurrentLearningLanguage() {
    this.currentLearningLanguage$ = this.languagesService.getCurrentLearningLanguage$();

  }

  getAllLanguages() {
    this.allLanguages$ = combineLatest([this.languagesService.getAllLanguages(), this.userLanguages$])
      .pipe(
        map(([allLanguages, userLanguages]) => {

          return allLanguages.map(language => {
            const foundLanguage = userLanguages.find(userLanguage => language._id === userLanguage._id);
            if (foundLanguage) {
              return { ...foundLanguage, isSelected: true };
            } else {
              return { ...language, isSelected: false };
            }

          });
        }),
        map(languages => languages.map(language => this.languagesService.addFlagToLanguage(language))),

        shareReplay(),
        tap(res => console.log('ALL LANGUAGES', res)));
  }

  getUserLanguages() {
    this.userLanguages$ = this.languagesService.getUserLanguages()
      .pipe(
        tap(languages => console.log('USER LANGUAGES', languages)),
        tap(languages => languages.length > 0 ? this.selectedTab = 0 : this.selectedTab = 1),

        // tap(langauges => langauges.length === 0 ? this.setCurrentLearningLanguage('') : ''),
        map(languages => languages.map(langauge => ({ ...langauge, isSelected: true }))),

      );

  }

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
    this.languagesService.setCurrentLanguageOnServer(languageId).
      pipe(
        takeUntil(this.subscription$)
      )
      .subscribe(res => {
        if (res && res.currentLanguage && res.currentLanguage._id) {
          this.goToVocabulary();
          // this.languagesService.setCurrentLearningLanguage(res.currentLanguage);
        }
      },
        err => this.notifications.error('', err.error.message));
  }


  // onEdit(langId: string) {
  //   if (langId) {
  //     this.editingLanguage$ = this.findLanguage(langId, this.allLanguages$);
  //     this.changeMode('editlanguage');
  //   } else {
  //     this.notifications.warning('', 'Please select language');
  //   }
  // }


  findLanguage(id: string, languages$: Observable<Language[]>) {
    return languages$
      .pipe(
        map(languages => languages.find(lang => lang._id === id))
      );
  }

  addLanguageToUserLanguages(language: Language) {
    this.languageIdCandidateToLearn = language._id;
    this.languagesService.addUserLanguages([language])
      .pipe(
        takeUntil(this.subscription$)
      )
      .subscribe(res => {

        this.getAllLanguages();
        this.getUserLanguages();
        console.log('AFTER ADD LANGUAGES', res);
      }, err => this.notifications.error('', err.error.message));

  }

  deleteUserLanguage(languageId: string) {
    this.languagesService.deleteUserLanguage(languageId)
      .pipe(
        takeUntil(this.subscription$)
      )
      .subscribe(res => {

        this.getUserLanguages();
        this.getAllLanguages();
        this.getCurrentLearningLanguage();
        console.log('AFTER Delete LANGUAGE', res);
      }, err => this.notifications.error('', err.error.message));

  }

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
