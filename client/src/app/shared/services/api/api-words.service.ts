import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../general.service';
import { Observable } from 'rxjs';
import { Word, WordGroup, Language } from '../../interfaces';
import { BASE_URL } from './api-languages.service';

@Injectable({
  providedIn: 'root'
})
export class ApiWordsService {

  constructor(
    private http: HttpClient,
    private generalService: GeneralService
  ) { }

  getWordsFromServerForUser(langId: string): Observable<Word[]> {
    return this.http.get<Word[]>(`${BASE_URL}/api/vocabulary/getAllWords?languageId=${langId}`);
  }

  getGeneralWordsForAll(langId: string): Observable<Word[]> {
    return this.http.get<Word[]>(`${BASE_URL}/api/vocabulary/getGeneralWords?languageId=${langId}`);
  }

  addWord(word: Word, language: Language): Observable<Word> {

    return this.http.post<Word>(`${BASE_URL}/api/vocabulary/createWord?languageId=${language._id}`, word);
  }

  addWords(words: Word[]): Observable<Word> {

    return this.http.post<Word>(`${BASE_URL}/api/vocabulary/addWords`, { words });
  }

  editWord(word: Word, language: Language): Observable<Word> {

    return this.http.patch<Word>(`${BASE_URL}/api/vocabulary/editWord?languageId=${language._id}`, word);
  }

  deleteWordFromServer(wordId: string): Observable<Word[]> {

    return this.http.delete<Word[]>(`${BASE_URL}/api/vocabulary/deleteWord/${wordId}`);
  }

  createWordGroup(name: string, language: Language) {
    const languageId = language._id;
    return this.http.post<Word>(`${BASE_URL}/api/word-group/create`, { name, languageId });
  }

  assignGroup(groupId: string, selectedWords: string[]) {
    return this.http.post<Word>(`${BASE_URL}/api/word-group/assign-group`, { groupId, selectedWords });
  }

  getAllWordsGroups(language: Language) {
    return this.http.get<WordGroup[]>(`${BASE_URL}/api/word-group/getAll?languageId=${language._id}`);
  }

  updateWords(words: Word[], language: Language) {
    return this.http.post<Word[]>(`${BASE_URL}/api/vocabulary/updateWords?languageId=${language._id}`, { words });

  }
}
