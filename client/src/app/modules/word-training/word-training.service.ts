import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Word } from 'src/app/shared/interfaces';
import { ApiWordsService } from 'src/app/shared/services/api/api-words.service';


@Injectable()
export class WordTrainingService {
  animationState$ = new BehaviorSubject('');
  constructor(
    private wordsApiService: ApiWordsService,
  ) {
  }

  startAnimation(stateAnimate) {
    console.log(stateAnimate);
    // if (!this.animationState) {
    //   this.animationState = stateAnimate;
    // }
    if (!this.animationState$.getValue()) {
      this.animationState$.next(stateAnimate)
    }
  }

  resetAnimationState() {
    // this.animationState = '';
    this.animationState$.next('')

  }

  getAnimationState() {
    return this.animationState$.asObservable();
  }



  // favoriteToggle(word: Word) {
  //   const newWord = { ...word, isFavorite: !word.isFavorite };
  //   return this.generalState.getCurrentLearningLanguage$().pipe(switchMap(language => this.wordsApiService.editWord(newWord, language)));
  // }

}
