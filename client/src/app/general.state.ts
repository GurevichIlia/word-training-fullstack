import { WordGroup } from './shared/interfaces';

import { Injectable } from '@angular/core';
import { Language, Word } from '../app/shared/interfaces';

import { BehaviorSubject } from 'rxjs';

@Injectable({
      providedIn: 'root'
})
export class GeneralState {
      readonly currentLearningLanguage$ = new BehaviorSubject<Language>(null);
      readonly quantityWords$ = new BehaviorSubject<number>(null);
      readonly userWords$ = new BehaviorSubject<Word[]>([]);
      readonly userWordsGroups$ = new BehaviorSubject<WordGroup[]>([]);

      readonly userName$ = new BehaviorSubject<string>('');


      constructor() {

      }

      setCurrentLanguage(language: Language) {
            this.currentLearningLanguage$.next(language);
      }

      getCurrentLearningLanguage$() {
            return this.currentLearningLanguage$.asObservable();
      }

      getCurrentLearningLanguage() {
            return this.currentLearningLanguage$.getValue();
      }

      setUserWords(words: Word[]) {
            return this.userWords$.next(words)
      }

      getUserWords$() {
            return this.userWords$.asObservable();
      }

      getUserWords() {
            return this.userWords$.getValue()
      }

      setWordsGroups(wordsGroups: WordGroup[]) {
            return this.userWordsGroups$.next(wordsGroups);
      }

      getWordsGroups$() {
            return this.userWordsGroups$.asObservable();
      }

      getWordsGroups() {
            return this.userWordsGroups$.getValue();
      }

      setQuantityWords$(value: number) {
            this.quantityWords$.next(value);
      }

      getQuantityWords$() {
            return this.quantityWords$.asObservable();
      }


}