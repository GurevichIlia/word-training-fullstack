import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../general.service';
import { Observable } from 'rxjs';
import { Word, WordGroup, Language } from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiWordsService {

  constructor(
    private http: HttpClient,
    private generalService: GeneralService
  ) { }

  getWordsFromServer(langId: string): Observable<Word[]> {
    return this.http.get<Word[]>(`/api/vocabulary/${langId}`);
  }

  addWord(word: Word, language: Language): Observable<Word> {

    return this.http.post<Word>(`/api/vocabulary/${language._id}`, word);
  }

  editWord(word: Word, language: Language): Observable<Word> {

    return this.http.patch<Word>(`/api/vocabulary/editWord/${language._id}`, word);
  }

  deleteWordFromServer(wordId: string): Observable<Word[]> {

    return this.http.delete<Word[]>(`/api/vocabulary/deleteWord/${wordId}`);
  }

  createWordGroup(name: string, language: Language) {
    const languageId = language._id;
    return this.http.post<Word>(`/api/word-group/create`, { name, languageId });
  }

  assignGroup(groupId: string, selectedWords: string[]) {
    return this.http.post<Word>(`/api/word-group/assign-group`, { groupId, selectedWords });
  }

  getAllWordsGroups(language: Language) {
    return this.http.get<WordGroup[]>(`/api/word-group/getAll/${language._id}`);
  }

  updateWords(words: Word[], language: Language) {
    return this.http.post<Word[]>(`/api/vocabulary/updateWords/${language._id}`, { words });

  }
}
