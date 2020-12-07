import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Word, WordGroup } from 'src/app/shared/interfaces';
import { AppStateInterface } from 'src/app/store/reducers';
import { NavigationService } from './core/services/navigation.service';
import { GeneralState } from './general.state';
import { LanguageInterface } from './modules/languages/types/languages.interfaces';
import { ApiLanguagesService } from './shared/services/api/api-languages.service';
import { ApiWordsService } from './shared/services/api/api-words.service';
import { GeneralService } from './shared/services/general.service';
import { NotificationsService } from './shared/services/notifications.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralFacade {
  constructor(
    private apiLanguageService: ApiLanguagesService,
    private apiWordsService: ApiWordsService,
    private generalState: GeneralState,
    private notifications: NotificationsService,
    private generalService: GeneralService,
    private navigationService: NavigationService,
    private store$: Store<AppStateInterface>
  ) {
  }

  // getUserWordsFromServer() {
  //   return this.getCurrentLearningLanguage$()
  //     .pipe(
  //       retry(1),
  //       switchMap(currentLang => {
  //         if (currentLang) {
  //           return this.apiWordsService.getWordsFromServerForUser(currentLang._id);
  //         } else {
  //           // this.router.navigate(['/languages']);
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
  //         // this.setQuantityWordsInGroups(words);
  //       }
  //       ),
  //       tap(words => console.log('USER WORDS', words)),
  //     );
  // }


  getCurrentLearningLanguage$() {
    if (!this.generalState.getCurrentLearningLanguage$()) {
      this.generalState.setCurrentLanguage(this.apiLanguageService.getCurrentLanguage$());
    }

    return this.generalState.getCurrentLearningLanguage$();
    // return of({})
  }

  extractValueForMethodFromObservable<T>(obs$: Observable<any>, callback): Observable<T> {
    return obs$
      .pipe(
        switchMap(value => callback(value) as Observable<T>)
      );
  }
  // getCurrentLearningLanguage() {
  //   return this.generalState.getCurrentLearningLanguage();
  // }



  setUserWords(words: Word[]) {
    this.generalState.setUserWords(words);
  }

  getUserWords() {
    return this.generalState.getUserWords();
  }

  getWordsGroups() {
    // if (!this.generalState.getWordsGroups$()) {

    //   const groups$ = this.generalState.getCurrentLearningLanguage$()
    //     .pipe(
    //       map(language => language ? language : null),
    //       filter(language => language !== null),
    //       switchMap(language => {
    //         return this.groupsApiService.getAllWordsGroups(language)

    //       }
    //       ),
    //       catchError(err => {
    //         this.notifications.error(err, '');
    //         return throwError(err);
    //       }),
    //       shareReplay(1)
    //     );


    //   this.generalState.setWordsGroups(groups$);

    // }

    // return this.generalState.getWordsGroups$().pipe(
    //   map(groups => {
    //     // return groups ? [...this.generalState.getDefaultGroups(), ...groups] : [];
    //     // this.generalState.setSelectedGroupForTraining(groups[0]);
    //     return groups;
    //   }),
    //   switchMap((groups: WordGroup[]) => this.setQuantityWordsInGroups(groups)),
    // );


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
          // const newGroup: WordGroup = { ...group, wordQuantity: words.filter(word => word.assignedGroups.includes(group._id)).length };

          return group;
        });
        return updatedGroups;
      })
    );
  }

  filterWordsByFavorite(allWords: Observable<Word[]>) {
    return allWords.pipe(
      map(words => words.filter(word => word.isFavorite))
    );
  }

  updateWordList() {
    this.generalState.setWordsGroups(null);

    this.generalService.updateWordList();
  }

  isUpdateWordList$() {
    return this.generalService.updateWords$;
  }


  setCurrentLanguage(language: Observable<LanguageInterface>) {
    this.setUserWords(null);
    this.generalState.setCurrentLanguage(language);
    this.updateWordList();
  }

  getWordsQuantity$() {
    return this.generalState.getQuantityWords$();
  }

  // setWordsQuantity() {
  //   this.generalState.setQuantityWords$(this.generalState.getUserWords().length);
  // }

  refreshGeneralState() {
    this.generalState.refreshGeneralState();
  }

  getLocation$() {
    // return this.generalState.getLocation$();
    return this.navigationService.getCurrentLocation$();
  }

  setLocation(location: { name: string }) {
    this.generalState.setLocation(location);
  }


}
