
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, EMPTY } from 'rxjs';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { GeneralFacade } from 'src/app/general.facade';
import { AddLanguageToUserLanguagesResponseInterface, DeleteUserLanguageResponseInterface, LanguageInterface, SetCurrentLanguageResponseInterface } from './types/languages.interfaces';

@Injectable(
)
export class LanguagesService {
  // shareReplay(1));
  constructor(
    private http: HttpClient,
    private generalFacade: GeneralFacade
  ) { }

  getAllLanguages(): Observable<LanguageInterface[]> {
    return this.http.get<LanguageInterface[]>(`/api/languages/getAllLanguages`)
  }

  // getCurrentLearningLanguage$() {

  //   return this.generalFacade.getCurrentLearningLanguage$();
  // }

  // setCurrentLearningLanguage(language: Language) {
  //   this.generalFacade.setCurrentLanguage(of(language));
  // }

  getUserLanguages(): Observable<LanguageInterface[]> {
    return this.http.get<LanguageInterface[]>(`/api/languages/getUserLanguages`);
  }

  // addLanguage(language: Language): Observable<Language> {
  //   return this.http.post<Language>(`/api/languages/createLanguage`, language);
  // }

  addUserLanguages(languages: LanguageInterface[]): Observable<LanguageInterface[]> {
    return this.http.post<AddLanguageToUserLanguagesResponseInterface>(`/api/languages/addUserLanguages`, { userLanguages: languages })
      .pipe(map(res => res.userLanguages));
  }

  // editLanguage(language: Language): Observable<Language> {
  //   return this.http.patch<Language>(`/api/languages/editLanguage`, language);
  // }

  // deleteLanguage(languageId: string): Observable<LanguageInterface[]> {
  //   return this.http.delete<LanguageInterface[]>(`/api/languages/deleteLanguage/${languageId}`);
  // }

  setCurrentLanguageOnServer(languageId: string) {
    return this.http.post<SetCurrentLanguageResponseInterface>(`/api/languages/setCurrentLanguage`, { currentLanguage: languageId });

  }

  deleteUserLanguage(languageId: string) {
    if (confirm('Would you like to delete this langauge?')) {

      if (!languageId) return EMPTY;

      return this.http.post<DeleteUserLanguageResponseInterface>(`/api/languages/deleteUserLanguage`, { languageId })
        .pipe(map(res => res.userLanguages));

      // return this.getCurrentLearningLanguage$()
      //   .pipe(
      //     switchMap(currentLanguage => {
      //       if (currentLanguage && currentLanguage._id === languageId) {
      //         // this.setCurrentLanguageOnServer(null);
      //         return this.http.post<Language>(`/api/languages/deleteUserLanguage`, { languageId });

      //       }
      //     })
      //   )

    }

    return EMPTY
  }

  // setCurrentLearningLanguage(language: Language) {
  //   this.generalFacade.setCurrentLanguage(language);
  // }

  addToCandidates(candidates: LanguageInterface[], language: LanguageInterface) {

    const alreadyAddedLanguge = candidates.find(existLanguage => existLanguage._id === language._id);

    if (alreadyAddedLanguge) {
      candidates = candidates.filter(existLanguage => existLanguage._id !== language._id)
    } else {
      candidates.push(language);
    }
    return candidates;
  }

  addCountryFlagToLanguage(languages: LanguageInterface[]): LanguageInterface[] {
    const languagesWithFlags = languages.map(language => {
      const lang = { ...language };
      switch (language.name) {
        case 'Hebrew':
          lang.flag = '../../assets/icons/Flags/iconfinder_flag-israel_748123.png'
          break;
        case 'English':
          lang.flag = '../../assets/icons/Flags/iconfinder_flag-united-kingdom_748024.png'
          break;
        case 'Spain':
          lang.flag = '../../assets/icons/Flags/iconfinder_flag-spain_748120.png'
          break;
        case 'Germany':
          lang.flag = '../../assets/icons/Flags/iconfinder_flag-germany_748067.png'
          break;
        case 'Dutch':
          lang.flag = '../../assets/icons/Flags/iconfinder_flag-the-netherlands_748017.png'
          break;
        case 'France':
          lang.flag = '../../assets/icons/Flags/iconfinder_flag-france_748130.png'
          break;
      }
      return lang;
    })
    return languagesWithFlags;

  }

  // tslint:disable-next-line: max-line-length
  markLanguageAsAddedToUserLanguages(allLanguages: LanguageInterface[], userLanguages$: Observable<LanguageInterface[]>): Observable<LanguageInterface[]> {
    const languages = allLanguages.map(lang => ({ ...lang }))

    return userLanguages$.pipe(
      tap(userLanguages => {
        for (const userLanguage of userLanguages) {

          const matchedLanguageIndex = languages.findIndex(language => userLanguage._id === language._id)
          languages[matchedLanguageIndex].addedToUser = true;
        }
      }),
      map(_ => {
        console.log('CLONE', languages)
        console.log('ORIGINAL', allLanguages)

        return languages;
      })
    )


    // return userLanguages$.pipe(
    //   map(userlanguages =>
    //     userlanguages.map(userLanguage => {
    //       const languageInUserLanguages = allLanguages.find(language => language._id === userLanguage._id)
    //       if (languageInUserLanguages) {
    //         return { ...userLanguage, addedToUser: true }
    //       }
    //       return userLanguage

    //     })))
  }
  // getCurrentLearningLanguage() {
  //   return this.generalFacade.getCurrentLearningLanguage();
  // }
}
