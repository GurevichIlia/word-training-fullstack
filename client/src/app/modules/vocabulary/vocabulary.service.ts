
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class VocabularyService {
  // words = new BehaviorSubject<Word[]>([]);
  // words$: Observable<Word[]>;
  constructor(

  ) {
    ;
  }

  // getWordsFromServer(langId: string): Observable<Word[]> {
  //   return this.http.get<Word[]>(`/api/vocabulary/${langId}`);
  // }

  // addWord(word: Word): Observable<Word> {
  //   const lang = this.generalService.currentLearningLanguage.getValue();
  //   return this.http.post<Word>(`/api/vocabulary/${lang._id}`, word);
  // }

  // editWord(word: Word): Observable<Word> {
  //   const lang = this.generalService.currentLearningLanguage.getValue();
  //   return this.http.patch<Word>(`/api/vocabulary/editWord/${lang._id}`, word);
  // }

  // deleteWordFromServer(wordId: string): Observable<Word[]> {
  //   const lang = this.generalService.currentLearningLanguage.getValue();
  //   return this.http.delete<Word[]>(`/api/vocabulary/deleteWord/${wordId}`);
  // }

  // createWordGroup(name: string, ) {
  //   const languageId = this.generalService.currentLearningLanguage.getValue()._id;

  //   return this.http.post<Word>(`/api/word-group/create`, { name, languageId });
  // }

  // assignGroup(groupId: string, selectedWords: string[]) {
  //   return this.http.post<Word>(`/api/word-group/assign-group`, { groupId, selectedWords });
  // }

  // getAllWordsGroups(language: Language) {
  //   return this.http.get<WordGroup[]>(`/api/word-group/getAll/${language._id}`);
  // }

  // setWords(words: Word[]) {
  //   this.words.next(words);
  // }

  // getCurrentWords$() {
  //   return this.words$;
  // }


  // setFavorite(word: Word) {
  //   if (word) {
  //     word.isFavorite = !word.isFavorite;
  //   }
  // }

  // findWordIndex(words: Word[], word: Word) {
  //   return words.findIndex(existingWord => existingWord._id === word._id);
  // }


  // deleteWord(word: Word) {
  //   const index = this.findWordIndex(this.words.value, word);
  //   this.words.getValue().splice(index, 1);
  // }

  // onEdit(editedWord: Word) {
  //   const index = this.findWordIndex(this.words.value, editedWord);
  //   this.words.getValue().splice(index, 1, editedWord);
  // }

  // getAllWordsFromServer() {
  //   this.words$ = this.apiLanguageService.getCurrentLanguage$()
  //     .pipe(
  //       switchMap(currentLang => {
  //         if (currentLang) {
  //           this.generalService.setCurrentLanguage(currentLang);
  //           return this.apiWordsService.getWordsFromServer(currentLang._id);
  //           // .pipe(
  //           //   switchMap(words => {
  //           //     this.setQuantityWords(words.length)
  //           //     this.vocabularyService.setWords(words.reverse());
  //           //     return this.vocabularyService.getCurrentWords$();
  //           //   }));
  //         } else {
  //           this.router.navigate(['languages']);
  //           return of([]);
  //         }
  //       }),
  //       tap(words => this.generalService.setQuantityWords(words.length)),
  //       tap(words => console.log('USER WORDS', words)),
  //       shareReplay()
  //     );
  // }

  public selectWord(alreadySelectedId: string[], newWordId: string) {
    let newSelectedProductArray = [...alreadySelectedId]

    const productId = newSelectedProductArray.find(id => id === newWordId);

    if (productId) {
      return newSelectedProductArray = newSelectedProductArray.filter(id => id !== productId)
    }
    newSelectedProductArray.push(newWordId)

    return newSelectedProductArray;

  }



}
