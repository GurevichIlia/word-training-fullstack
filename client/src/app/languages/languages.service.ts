import { GeneralFacade } from './../general.facade';
import { Language, LanguageResponse } from '../shared/interfaces';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'

}
)
export class LanguagesService {

  constructor(
    private http: HttpClient,
    private generalFacade: GeneralFacade
  ) { }

  getAllLanguages(): Observable<Language[]> {
    return this.http.get<Language[]>(`/api/languages/getAllLanguages`);
  }

  getCurrentLanguage$() {
    // tslint:disable-next-line: max-line-length
    return this.http.get<{ currentLang: Language }>(`/api/languages/getCurrentLanguage`).pipe(map(({ currentLang }) => currentLang), shareReplay(1));
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
    return this.http.post<Language>(`/api/languages/deleteUserLanguage`, { languageId });

  }

  setCurrentLearningLanguage(language: Language) {
    this.generalFacade.setCurrentLanguage(language);
  }

  addToCandidates(candidates: Language[], language: Language) {

    const alreadyAddedLanguge = candidates.find(existLanguage => existLanguage._id === language._id);

    if (alreadyAddedLanguge) {
      candidates = candidates.filter(existLanguage => existLanguage._id !== language._id)
    } else {
      candidates.push(language);
    }
    return candidates;
  }
}
