import { WordGroup } from './shared/interfaces';

import { Injectable } from '@angular/core';
import { Language, Word } from '../app/shared/interfaces';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneralState {
  defaultGroups: WordGroup[] = [{
    _id: '1',
    name: 'All',
    wordQuantity: 0,
    shareForAll: false
  },
  {
    _id: '2',
    name: 'Favorites',
    wordQuantity: 0,
    shareForAll: false
  }];

  readonly currentLearningLanguage$ = new BehaviorSubject<Language>(null);
  readonly quantityWords$ = new BehaviorSubject<number>(null);
  readonly userWords$ = new BehaviorSubject<Word[]>(null);
  readonly userWordsGroups$ = new BehaviorSubject<WordGroup[]>(this.defaultGroups);

  readonly userName$ = new BehaviorSubject<string>('');

  readonly selectedGroupForTraining$ = new BehaviorSubject<string>('1');

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
    return this.userWords$.next(words);
  }

  getUserWords$() {
    return this.userWords$.asObservable();
  }

  getUserWords() {
    return this.userWords$.getValue();
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

  setSelectedGroupForTraining(groupId: string) {
    this.selectedGroupForTraining$.next(groupId);
  }

  getSelectedGroupForTraining() {
    return this.selectedGroupForTraining$.asObservable();
  }

  refreshGeneralState() {
    this.setCurrentLanguage(null);
    this.setUserWords(null);
    this.setQuantityWords$(0);
    this.userName$.next('');
    this.setWordsGroups(this.defaultGroups);
    this.setSelectedGroupForTraining('');
    console.log('STATE REFRESHED');
  }
}
