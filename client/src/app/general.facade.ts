import { GeneralService } from './shared/services/general.service';
import { NotificationsService } from './shared/services/notifications.service';
import { ApiWordsService } from './shared/services/api/api-words.service';
import { ApiLanguagesService } from './shared/services/api/api-languages.service';
import { Injectable } from '@angular/core';
import { tap, switchMap, filter, map, catchError } from 'rxjs/operators';
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

      getAllWordsFromServerAndSetCurrentLanguage() {
            return this.apiLanguageService.getCurrentLanguage$()
                  .pipe(
                        switchMap(currentLang => {
                              if (currentLang) {
                                    this.generalState.setCurrentLanguage(currentLang);
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
                        tap(words => console.log('USER WORDS', words)),
                  );
      }

      setUserWords(words: Word[]) {
            this.generalState.setUserWords(words);
      }

      getWordsGroups() {
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
                  )
      }

      updateWordList() {
            this.generalService.updateWordList();
      }

      isUpdateWordList$() {
            return this.generalService.updateWords$;
      }

      getCurrentLanguage$() {
            return this.generalState.getCurrentLearningLanguage$();
      }

      setCurrentLanguage(language: Language) {
            this.generalState.setCurrentLanguage(language);
      }

      getWordsQuantity$() {
            return this.generalState.getQuantityWords$();
      }

      setWordsQuantity() {
            this.generalState.setQuantityWords$(this.generalState.getUserWords().length);
      }
}