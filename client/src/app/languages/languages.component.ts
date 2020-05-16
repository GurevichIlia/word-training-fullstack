
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { Language } from '../shared/interfaces';
import { LanguagesService } from './languages.service';
import { NotificationsService } from './../shared/services/notifications.service';
import { Observable, Subject, of, combineLatest, pipe } from 'rxjs';
import { tap, takeUntil, map, switchMap, shareReplay, startWith } from 'rxjs/operators';




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
    this.currentLearningLanguage$ = this.languagesService.getCurrentLanguage$();

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
        shareReplay(),
        tap(res => console.log('ALL LANGUAGES', res)));
  }

  getUserLanguages() {
    this.userLanguages$ = this.languagesService.getUserLanguages()
      .pipe(
        tap(res => console.log('USER LANGUAGES', res)),
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
      this.languagesService.setCurrentLanguageOnServer(languageId).
        pipe(
          takeUntil(this.subscription$)
        )
        .subscribe(res => {
          if (res.currentLanguage._id) {
            this.goToVocabulary();
            this.languagesService.setCurrentLearningLanguage(res.currentLanguage);
          }
        },
          err => this.notifications.error('', err.error.message));
    } else {
      this.notifications.warning('', 'Please select language');
    }
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
    this.languagesService.addUserLanguages([language])
      .pipe(
        takeUntil(this.subscription$)
      )
      .subscribe(res => {
        this.getUserLanguages();
        this.getAllLanguages();
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
