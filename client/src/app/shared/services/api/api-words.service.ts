import { User } from './../../interfaces';
import { shareReplay } from 'rxjs/operators';
import { GeneralWord } from './../../../../../../src/interfaces';
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

  getGeneralWordsForAll(langId: string): Observable<GeneralWord[]> {
    return this.http.get<GeneralWord[]>(`${BASE_URL}/api/vocabulary/getGeneralWords?languageId=${langId}`)
      .pipe(shareReplay());
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
    return this.http.post<WordGroup>(`${BASE_URL}/api/word-group/create`, { name, languageId });
  }

  deleteWordGroup(groupId: string) {
    return this.http.post<Word>(`${BASE_URL}/api/word-group/deleteGroup`, { groupId });

  }

  assignGroup(groupId: string, selectedWords: string[]) {
    return this.http.post<Word>(`${BASE_URL}/api/word-group/assign-group`, { groupId, selectedWords });
  }

  getAllWordsGroups(language: Language) {
    return this.http.get<WordGroup[]>(`${BASE_URL}/api/word-group/getAllGroups?languageId=${language._id}`);
  }

  updateWords(words: Word[], language: Language) {
    return this.http.post<Word[]>(`${BASE_URL}/api/vocabulary/updateWords?languageId=${language._id}`, { words });

  }

  addWordsToGeneralList(words: Word[], language: Language) {
    return this.http.post(`${BASE_URL}/api/vocabulary/addWordsToGeneralList?languageId=${language._id}`, { words })
  }

  deleteWordFromGeneralList(wordId: string) {
    return this.http.delete<{ word: GeneralWord, message: string }>(`${BASE_URL}/api/vocabulary/deleteWordFromGeneralList?wordId=${wordId}`)
  }

  getUserId() {
    return this.http.get<{ userId: string }>(`${BASE_URL}/api/auth/getUserId`);
  }
}
