import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Language } from './../interfaces';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  currentLearningLanguage = new BehaviorSubject<Language>({} as Language);
  currentLearningLanguage$ = this.currentLearningLanguage.asObservable();

  quantityWords = new BehaviorSubject<number>(null);
  quantityWords$ = this.quantityWords.asObservable();
  constructor(
    private http: HttpClient) {
    // if (localStorage.getItem('words-language')) {
    //   const lang = JSON.parse(localStorage.getItem('words-language'))
    //   this.setCurrentLanguage(lang);

    // }
  }

  setCurrentLanguage(language: Language) {
    this.currentLearningLanguage.next(language);

    // = of(language);
  }





  setQuantityWords(value: number) {
    this.quantityWords.next(value);
  }
  getQuantityWords$() {
    return this.quantityWords$;
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
}
