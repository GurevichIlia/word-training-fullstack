import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { GeneralState } from './../../general.state';



@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  // currentLearningLanguage = new BehaviorSubject<Language>(null);
  // currentLearningLanguage$ = this.currentLearningLanguage.asObservable();

  // quantityWords = new BehaviorSubject<number>(null);
  // quantityWords$ = this.quantityWords.asObservable();
  updateWords$ = new Subject<void>();

  constructor(
    private generalState: GeneralState

  ) {

  }

  updateWordList() {
    this.updateWords$.next();
  }

  // setCurrentLanguage(language: Language) {
  //   this.generalState.setCurrentLanguage(language);
  // }
  // setCurrentLanguage(language: Language) {
  //   this.currentLearningLanguage.next(language);

  //   // = of(language);
  // }


  // setQuantityWords(value: number) {
  //   this.quantityWords.next(value);
  // }

  // getQuantityWords$() {
  //   return this.quantityWords$;
  // }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
}
