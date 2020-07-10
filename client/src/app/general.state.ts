import { WordGroup } from './shared/interfaces';

import { Injectable } from '@angular/core';
import { Language, Word } from '../app/shared/interfaces';

import { BehaviorSubject, Observable } from 'rxjs';

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

  private currentLearningLanguage$: Observable<Language>;
  private readonly quantityAllWords$ = new BehaviorSubject<number>(null);
  private readonly userWords$ = new BehaviorSubject<Word[]>(null);
  // private readonly userWordsGroups$ = new BehaviorSubject<WordGroup[]>(this.defaultGroups);

  private userWordsGroups$: Observable<WordGroup[]>;

  private readonly userName$ = new BehaviorSubject<string>('');

  private readonly selectedGroupForTraining$ = new BehaviorSubject<string>('1');

  private currentLocation$ = new BehaviorSubject<{ name: string }>({ name: '' });
  constructor() {

  }

  setCurrentLanguage(language: Observable<Language>) {
    this.currentLearningLanguage$ = language;
  }

  getCurrentLearningLanguage$() {
    return this.currentLearningLanguage$;
  }

  // getCurrentLearningLanguage() {
  //   return this.currentLearningLanguage$.getValue();
  // }

  setUserWords(words: Word[]) {
    return this.userWords$.next(words);
  }

  getUserWords$() {
    return this.userWords$.asObservable();
  }

  getUserWords() {
    return this.userWords$.getValue();
  }

  setWordsGroups(wordsGroups: Observable<WordGroup[]>) {
    this.userWordsGroups$ = wordsGroups;
  }

  getWordsGroups$() {
    return this.userWordsGroups$;
  }

  // getWordsGroups() {
  //   return this.userWordsGroups$.getValue();
  // }

  setQuantityWords$(value: number) {
    this.quantityAllWords$.next(value);
  }

  getQuantityWords$() {
    return this.quantityAllWords$.asObservable();
  }

  setSelectedGroupForTraining(groupId: string) {
    this.selectedGroupForTraining$.next(groupId);
  }

  getSelectedGroupForTraining() {
    return this.selectedGroupForTraining$.asObservable();
  }

  getDefaultGroups() {
    return this.defaultGroups;
  }

  setLocation(location: { name: string }) {
    this.currentLocation$.next(location);
  }

  getLocation$() {
    return this.currentLocation$.asObservable();
  }

  refreshGeneralState() {
    this.setCurrentLanguage(null);
    this.setUserWords(null);
    this.setQuantityWords$(0);
    this.userName$.next('');
    this.setWordsGroups(null);
    this.setSelectedGroupForTraining('');
    console.log('STATE REFRESHED');
  }
}
