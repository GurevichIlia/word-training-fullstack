import { GeneralService } from './../shared/services/general.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';
import { Word, Language } from '../shared/interfaces';
import { baseUrl } from '../app.config';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VocabularyService {
  words = new BehaviorSubject<Word[]>([]);
  words$ = this.words.asObservable();
  constructor(
    private http: HttpClient,
    private generalService: GeneralService
  ) {
    ;
  }

  getWordsFromServer(langId: string): Observable<Word[]> {
    return this.http.get<Word[]>(`${baseUrl}vocabulary/${langId}`);
  }

  addWord(word: Word): Observable<Word> {
    const lang = this.generalService.currentLearningLanguage.getValue();
    return this.http.post<Word>(`${baseUrl}vocabulary/${lang._id}`, word);
  }

  editWord(word: Word): Observable<Word> {
    const lang = this.generalService.currentLearningLanguage.getValue();
    return this.http.patch<Word>(`${baseUrl}vocabulary/editWord/${lang._id}`, word);
  }

  deleteWordFromServer(wordId: string): Observable<Word[]> {
    const lang = this.generalService.currentLearningLanguage.getValue();
    return this.http.delete<Word[]>(`${baseUrl}vocabulary/deleteWord/${wordId}`);
  }


  setWords(words: Word[]) {
    this.words.next(words);
  }

  getCurrentWords$() {
    return this.words$;
  }


  setFavorite(word: Word) {
    if (word) {
      word.isFavorite = !word.isFavorite;
    }
  }

  findWordIndex(words: Word[], word: Word) {
    return words.findIndex(existingWord => existingWord._id === word._id);
  }

  deleteWord(word: Word) {
    const index = this.findWordIndex(this.words.value, word);
    this.words.getValue().splice(index, 1);
  }

  onEdit(editedWord: Word) {
    const index = this.findWordIndex(this.words.value, editedWord);
    this.words.getValue().splice(index, 1, editedWord);
  }
}
