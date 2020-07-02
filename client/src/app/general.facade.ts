import { WordGroup } from 'src/app/shared/interfaces';
import { GeneralService } from './shared/services/general.service';
import { NotificationsService } from './shared/services/notifications.service';
import { ApiWordsService } from './shared/services/api/api-words.service';
import { ApiLanguagesService } from './shared/services/api/api-languages.service';
import { Injectable } from '@angular/core';
import { tap, switchMap, filter, map, catchError, retry, take, shareReplay } from 'rxjs/operators';
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
            return this.apiWordsService.getWordsFromServerForUser(currentLang._id);
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
          // this.setQuantityWordsInGroups(words);
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


  // getUserWordsFromServer() {
  //   return this.getCurrentLanguage$()
  //     .pipe(
  //       retry(1),
  //       switchMap(currentLang => {
  //         if (currentLang) {
  //           return this.apiWordsService.getWordsFromServer(currentLang._id);
  //         } else {
  //           this.router.navigate(['languages']);
  //           return of([]);
  //         }
  //       }),
  //       catchError(err => {
  //         this.notifications.error(err.message, err.error);
  //         return throwError(err);
  //       }),

  //       // tap(words => this.generalService.setQuantityWords(words.length)),
  //       tap(words => words ? this.generalState.setUserWords(words) : []),
  //       tap(words => {
  //         this.setWordsQuantity();
  //         this.setQuantityWordsInGroups(words);
  //       }
  //       ),
  //       tap(words => console.log('USER WORDS', words)),
  //     );
  // }


  // getCurrentLanguage$() {
  //   if (!this.generalState.getCurrentLearningLanguage()) {
  //     this.apiLanguageService.getCurrentLanguage$()
  //       .pipe(
  //         take(1),
  //         tap(lang => this.generalState.setCurrentLanguage(lang)
  //         )).subscribe(() => console.log('LANG GOT'), err => console.log(err), () => console.log('COMPLETE LANG SUBS'));
  //   }

  //   return this.generalState.getCurrentLearningLanguage$().pipe(filter(lang => lang !== null));

  // }

  setUserWords(words: Word[]) {
    this.generalState.setUserWords(words);
  }

  getUserWords() {
    return this.generalState.getUserWords();
  }

  getWordsGroups() {
    if (!this.generalState.getWordsGroups$()) {

      const groups$ = this.generalState.getCurrentLearningLanguage$()
        .pipe(
          map(language => language ? language : null),
          filter(language => language !== null),
          switchMap(language => {
            return this.apiWordsService.getAllWordsGroups(language);

          }
          ),
          catchError(err => {
            this.notifications.error(err, '');
            return throwError(err);
          }),
          shareReplay(1)
        );


      this.generalState.setWordsGroups(groups$);
    }

    return this.generalState.getWordsGroups$().pipe(
      map(groups => {
        return groups ? [...this.generalState.getDefaultGroups(), ...groups] : [];

      }),
      switchMap((groups: WordGroup[]) => this.setQuantityWordsInGroups(groups)),
    );


  }

  setQuantityWordsInGroups(groups: WordGroup[]) {

    const words$ = this.generalState.getUserWords$();

    return words$.pipe(
      map(words => {

        if (!words) {
          return [] as WordGroup[];
        }
        const updatedGroups = groups.map(group => {
          if (group._id === '2') {
            const updatedGroup: WordGroup = { ...group, wordQuantity: words.filter(word => word.isFavorite === true).length };
            return updatedGroup;
          }
          const newGroup: WordGroup = { ...group, wordQuantity: words.filter(word => word.assignedGroups.includes(group._id)).length };

          return newGroup
        });
        return updatedGroups;
      })
    );
  }

  updateWordList() {
    this.generalState.setWordsGroups(null);

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
