import { GeneralFacade } from './../general.facade';
import { Language, LanguageResponse } from '../shared/interfaces';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'

}
)
export class LanguagesService {
  // shareReplay(1));
  constructor(
    private http: HttpClient,
    private generalFacade: GeneralFacade
  ) { }

  getAllLanguages(): Observable<Language[]> {
    return this.http.get<Language[]>(`/api/languages/getAllLanguages`)
  }

  getCurrentLearningLanguage$() {
    // if (!this.currentLang$) {
    //   this.currentLang$ = this.http.get<{ currentLang: Language }>(`/api/languages/getCurrentLanguage`).pipe(map(({ currentLang }) => currentLang),

    // }
    // // tslint:disable-next-line: max-line-length
    // return this.currentLang$;

    return this.generalFacade.getCurrentLearningLanguage$();
  }

  getUserLanguages(): Observable<Language[]> {
    return this.http.get<Language[]>(`/api/languages/getUserLanguages`);
  }

  addLanguage(language: Language): Observable<Language> {
    return this.http.post<Language>(`/api/languages/createLanguage`, language);
  }

  addUserLanguages(languages: Language[]): Observable<Language[]> {
    return this.http.post<Language[]>(`/api/languages/addUserLanguages`, { userLanguages: languages });
  }

  editLanguage(language: Language): Observable<Language> {
    return this.http.patch<Language>(`/api/languages/editLanguage`, language);
  }

  deleteLanguage(languageId: string): Observable<Language[]> {
    return this.http.delete<Language[]>(`/api/languages/deleteLanguage/${languageId}`);
  }

  setCurrentLanguageOnServer(languageId: string) {
    return this.http.post<LanguageResponse>(`/api/languages/setCurrentLanguage`, { currentLanguage: languageId });

  }

  deleteUserLanguage(languageId: string) {
    if (confirm('Would toy like to delete this langauge?')) {

      return this.getCurrentLearningLanguage$()
        .pipe(
          switchMap(currentLanguage => {
            if (currentLanguage && currentLanguage._id === languageId) {
              this.setCurrentLanguageOnServer(undefined);
              return this.http.post<Language>(`/api/languages/deleteUserLanguage`, { languageId });

            }
          })
        )


    }

  }

  // setCurrentLearningLanguage(language: Language) {
  //   this.generalFacade.setCurrentLanguage(language);
  // }

  addToCandidates(candidates: Language[], language: Language) {

    const alreadyAddedLanguge = candidates.find(existLanguage => existLanguage._id === language._id);

    if (alreadyAddedLanguge) {
      candidates = candidates.filter(existLanguage => existLanguage._id !== language._id)
    } else {
      candidates.push(language);
    }
    return candidates;
  }

  addFlagToLanguage(language: Language) {
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
  }

  // getCurrentLearningLanguage() {
  //   return this.generalFacade.getCurrentLearningLanguage();
  // }
}
