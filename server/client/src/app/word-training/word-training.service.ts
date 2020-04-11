import { VocabularyService } from './../vocabulary/vocabulary.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Word } from '../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class WordTrainingService {
  trainWords = new BehaviorSubject<Word[]>([]);
  currentTrainWords$ = this.trainWords.asObservable();

  private trainingResult = new BehaviorSubject<Word[]>([]);
  currentTrainingResult$ = this.trainingResult.asObservable();
  constructor(private vocabularyService: VocabularyService) {
  }
  getUserWords() {
    return this.vocabularyService.getCurrentWords$();
  }
  getRandomWords(words?: Word[]) {
    for (let i = words.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * words.length);
      const temp = words[i]
      words[i] = words[j]
      words[j] = temp;
    }
    return words;
  }
  addWordToResultWords(resultWords: Word[], word: Word) {
    resultWords.push(word);
    console.log('RESULT WORDS', resultWords);
    return resultWords;
  }

  
  setTrainResult(words: Word[]) {
    this.trainingResult.next(words);
  }
  getTrainResult() {
    return this.trainingResult.getValue();
  }
  getTrainResult$() {
    return this.currentTrainingResult$;
  }
  setTrainWords(words: Word[]) {
    this.trainWords.next(words);
  }
  getTrainWords() {
    return this.trainWords.getValue();
  }
  getTrainWords$() {
    return this.currentTrainWords$;

  }
  setTrainMode() {

  }
}
