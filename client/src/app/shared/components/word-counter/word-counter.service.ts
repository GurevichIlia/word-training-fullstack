import { GeneralState } from 'src/app/general.state';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Word } from 'src/app/shared/interfaces';

@Injectable()
export class WordCounterService {
  totalCardsLearned = new BehaviorSubject(0);
  private trainedWords = new BehaviorSubject<Word[]>([]);
  trainedWords$ = this.trainedWords.asObservable();

  constructor(
    private generalState: GeneralState
  ) { }

  setQuntityCards(quantity: number) {

  }

  getQuantityAllWords$() {
    return this.generalState.getSelectedGroupForTraining$()
      .pipe(map(group => group.wordQuantity), tap(group => console.log('SELECTED GROUP', group)));
  }

  getQuantityLearnedWords$() {
    return this.getTrainResult$().pipe(map(words => words.length), tap(res => console.log(this.getTrainResult())));
  }

  totalCardsLearned$() {
    return this.totalCardsLearned.asObservable();
  }

  increaseCardCounter() {
    const counter = this.totalCardsLearned.getValue() + 1;

    this.totalCardsLearned.next(counter);
  }

  setTrainResult(words: Word[]) {
    this.trainedWords.next(words);
  }

  getTrainResult() {
    return this.trainedWords.getValue();
  }

  getTrainResult$() {
    return this.trainedWords$;
  }

  addWordToTrainResult(word: Word) {
    this.increaseCardCounter();
    const wordClone = { ...word };
    const wordsInResult = [...this.getTrainResult()];

    if (wordsInResult.length === 0) {
      wordsInResult.push(wordClone);
      this.setTrainResult(wordsInResult);
      return;
    }

    const wordIndex = wordsInResult.findIndex(existingWord => existingWord._id === wordClone._id);
    if (wordIndex >= 0) {
      wordsInResult[wordIndex] = wordClone;
    } else {
      wordsInResult.push(wordClone);
    }

    this.setTrainResult(wordsInResult);

  }

  clearCounterState() {
    this.setTrainResult([]);
    this.totalCardsLearned.next(0);

  }
}
