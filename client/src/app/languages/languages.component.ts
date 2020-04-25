import { FormControl } from '@angular/forms';
import { GeneralService } from './../shared/services/general.service';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { Language } from '../shared/interfaces';
import { LanguagesService } from './languages.service';
import { NotificationsService } from './../shared/services/notifications.service';
import { Observable, Subject, of, combineLatest } from 'rxjs';
import { tap, takeUntil, map, switchMap } from 'rxjs/operators';



@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss']
})
export class LanguagesComponent implements OnInit, OnDestroy {
  
  allLanguages$: Observable<Language[]>;
  userLanguages$: Observable<Language[]>;

  currentLearningLanguage$: Observable<Language>;
  editingLanguage$: Observable<Language>;
  isNewLanguage = false;
  mode = 'initial'; // initial, editlanguage, newlanguage
  subscription$ = new Subject();
  constructor(
    private notifications: NotificationsService,
    private languagesService: LanguagesService,
    private router: Router,
  ) {
    // this.selectedLang = new FormControl('');
  }

  ngOnInit() {
    this.getUserLAnguages();
    this.getAllLanguages();

    this.currentLearningLanguage$ = this.languagesService.getCurrentLanguage$();

  }

  getAllLanguages() {
    this.allLanguages$ = combineLatest([this.languagesService.getAllLanguages(), this.userLanguages$])
      .pipe(
        map(([allLanguages, userLanguages]) => {

          return allLanguages.map(userLanguage => {
            const foundLanguage = userLanguages.find(language => language._id === userLanguage._id);
            if (foundLanguage) {
              return foundLanguage;
            } else {
              return userLanguage;
            }

          });
        }),
        tap(res => console.log('ALL LANGUAGES', res)));
  }

  getUserLAnguages() {
    this.userLanguages$ = this.languagesService.getUserLanguages()
      .pipe(
        map(languages => languages.map(langauge => ({ ...langauge, isSelect: true }))),
        tap(res => console.log('USER LANGUAGES', res)
        ));

  }

  goToVocabulary() {
    this.router.navigate(['vocabulary']);
  }

  setCurrentLearningLanguage(languageId: string) {
    if (languageId) {
      this.languagesService.setCurrentLanguageOnServer(languageId).subscribe(res => {
        if (res) {
          this.goToVocabulary();
        }
      },
        err => this.notifications.error('', err.error.message));
    } else {
      this.notifications.warning('', 'Please select language');
    }
  }

  // addNewLang(language: string) {
  //   if (language) {
  //     const newLanguage = { name: language };
  //     this.languagesService.addLanguage(newLanguage)
  //       .pipe(takeUntil(this.subscription$))
  //       .subscribe(res => {
  //         this.getLanguages();
  //         this.isNewLanguage = !this.isNewLanguage;
  //         this.notifications.success(newLanguage.name, 'Successfully added');
  //         this.changeMode('initial');
  //       }, err => this.notifications.error('', err.error.message));
  //   } else {
  //     this.notifications.warning('', 'Language name required');
  //   }

  // }

  onEdit(langId: string) {
    if (langId) {
      this.editingLanguage$ = this.findLanguage(langId, this.allLanguages$);
      this.changeMode('editlanguage');
    } else {
      this.notifications.warning('', 'Please select language');
    }
  }

  // editLang(lang: Language) {
  //   this.languagesService.editLanguage(lang)
  //     .pipe(takeUntil(this.subscription$))
  //     .subscribe(res => {
  //       this.getLanguages();
  //       this.changeMode('initial');
  //     }, err => this.notifications.error('', err.error.message));

  // }

  // deleteLang(langId: string) {
  //   if (langId) {
  //     this.languagesService.deleteLanguage(langId)
  //       .pipe(takeUntil(this.subscription$))
  //       .subscribe(res => {
  //         this.getLanguages();
  //       }, err => this.notifications.error('', err.error.message));
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
  // Change bitween add and select language
  // changeMode() {
  //   // this.isNewLanguage = !this.isNewLanguage;
  //   // this.language = {} as Language;
  // }

  addUserLanguages(languages: Language[]) {
    console.log('USER LANGUAGES ', languages)
    this.languagesService.addUserLanguages(languages)
      .pipe(
        takeUntil(this.subscription$)
      )
      .subscribe(res => {
        this.getUserLAnguages();
        console.log('AFTER ADD LANGUAGES', res);
      }, err => this.notifications.error('', err.error.message));

  }

  getActionFromChildren({ action, payload }) {
    switch (action) {
      case 'CHANGE MODE': this.changeMode(payload);
        // tslint:disable-next-line: align
        break;
      case 'SELECT': this.setCurrentLearningLanguage(payload as string);
        // tslint:disable-next-line: align
        break;
      // case 'SAVE': this.addNewLang(payload);
      //   // tslint:disable-next-line: align
      //   break;
      case 'EDIT': this.onEdit(payload as string);
        // tslint:disable-next-line: align
        break;
      // case 'DELETE': this.deleteLang(payload as string);
      //   // tslint:disable-next-line: align
      //   break;
      // case 'UPDATE': this.editLang(payload);
      //   // tslint:disable-next-line: align
      //   break;
      default:
        break;
    }
  }

  changeMode(modeName: string) {
    this.mode = modeName;
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
