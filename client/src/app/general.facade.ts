import { GeneralService } from './shared/services/general.service';
import { NotificationsService } from './shared/services/notifications.service';
import { ApiWordsService } from './shared/services/api/api-words.service';
import { ApiLanguagesService } from './shared/services/api/api-languages.service';
import { Injectable } from '@angular/core';
import { tap, switchMap, filter, map, catchError, retry, take } from 'rxjs/operators';
import { GeneralState } from './general.state';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Language, Word } from './shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class GeneralFacade {
  constructor(
    private apiLanguageService: ApiLanguagesService,
    private apiWordsService: ApiWordsService,
    private generalState: GeneralState,
    private router: Router,
    private notifications: NotificationsService,
    private generalService: GeneralService
  ) { }

  getUserWordsFromServer() {
    return this.getCurrentLanguage$()
      .pipe(
        retry(1),
        switchMap(currentLang => {
          if (currentLang) {
            return this.apiWordsService.getWordsFromServer(currentLang._id);
          } else {
            this.router.navigate(['languages']);
            return of([]);
          }
        }),
        catchError(err => {
          this.notifications.error(err.message, err.error);
          return throwError(err);
        }),

        // tap(words => this.generalService.setQuantityWords(words.length)),
        tap(words => words ? this.generalState.setUserWords(words) : []),
        tap(words => {
          this.setWordsQuantity();
          this.setQuantityWordsInGroups(words);
        }
        ),
        tap(words => console.log('USER WORDS', words)),
      );
  }

  getCurrentLanguage$() {
    if (!this.generalState.getCurrentLearningLanguage()) {
      this.apiLanguageService.getCurrentLanguage$()
        .pipe(
          take(1),
          tap(lang => this.generalState.setCurrentLanguage(lang)
          )).subscribe(() => console.log('LANG GOT'), err => console.log(err), () => console.log('COMPLETE LANG SUBS'));
    }

    return this.generalState.getCurrentLearningLanguage$().pipe(filter(lang => lang !== null));

  }

  setUserWords(words: Word[]) {
    this.generalState.setUserWords(words);
  }

  getUserWords() {
    return this.generalState.getUserWords()
  }

  getWordsGroups(words: Word[]) {
    return this.generalState.getCurrentLearningLanguage$()
      .pipe(
        filter(language => language !== null),
        switchMap(language =>
          this.apiWordsService.getAllWordsGroups(language)
        ),
        catchError(err => {
          this.notifications.error(err, '');
          return throwError(err);
        }),
        map(groups => groups ? this.generalState.setWordsGroups(groups) : [])
      );
  }

  setQuantityWordsInGroups(words: Word[]) {
    const groups = this.generalState.getWordsGroups();

    const updatedGroups = groups.map(group => {
      if (group._id === '2') {
        return { ...group, wordQuantity: words.filter(word => word.isFavorite === true).length };
      }
      return { ...group, wordQuantity: words.filter(word => word.assignedGroups.includes(group._id)).length };
    });

    this.generalState.setWordsGroups(updatedGroups);
  }

  updateWordList() {
    this.generalService.updateWordList();
  }

  isUpdateWordList$() {
    return this.generalService.updateWords$;
  }


  setCurrentLanguage(language: Language) {
    this.setUserWords(null);
    this.generalState.setCurrentLanguage(language);
    this.updateWordList();
  }

  getWordsQuantity$() {
    return this.generalState.getQuantityWords$();
  }

  setWordsQuantity() {
    this.generalState.setQuantityWords$(this.generalState.getUserWords().length);
  }

  refreshGeneralState() {
    this.generalState.refreshGeneralState();
  }
}
