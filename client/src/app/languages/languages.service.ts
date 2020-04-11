import { Language } from '../shared/interfaces';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class LanguagesService {

  constructor(private http: HttpClient) { }

  getAllLanguages(): Observable<Language[]> {
    return this.http.get<Language[]>(`/api/languages/getAllLanguages`);
  }

  addLanguage(language: Language): Observable<Language> {
    return this.http.post<Language>(`/api/languages/createLanguage`, language);
  }

  editLanguage(language: Language): Observable<Language> {
    return this.http.patch<Language>(`/api/languages/editLanguage`, language);
  }

  deleteLanguage(languageId: string): Observable<Language[]> {
    return this.http.delete<Language[]>(`/api/languages/deleteLanguage/${languageId}`);
  }

  setCurrentLanguageOnServer(languageId: string) {
    return this.http.post<Language>(`/api/languages/setCurrentLanguage`, { currentLanguage: languageId });

  }

}
