import { Language } from '../shared/interfaces';
import { baseUrl } from '../app.config';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class LanguagesService {

  constructor(private http: HttpClient) { }

  getAllLanguages(): Observable<Language[]> {
    return this.http.get<Language[]>(`${baseUrl}languages/getAllLanguages`);
  }

  addLanguage(language: Language): Observable<Language> {
    return this.http.post<Language>(`${baseUrl}languages/createLanguage`, language);
  }

  editLanguage(language: Language): Observable<Language> {
    return this.http.patch<Language>(`${baseUrl}languages/editLanguage`, language);
  }

  deleteLanguage(languageId: string): Observable<Language[]> {
    return this.http.delete<Language[]>(`${baseUrl}languages/deleteLanguage/${languageId}`);
  }

  setCurrentLanguageOnServer(languageId: string) {
    return this.http.post<Language>(`${baseUrl}languages/setCurrentLanguage`, { currentLanguage: languageId });

  }

}
