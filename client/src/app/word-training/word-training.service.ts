import { switchMap } from 'rxjs/operators';
import { GeneralState } from './../general.state';
import { VocabularyService } from './../vocabulary/vocabulary.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { Word } from '../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class WordTrainingService {
  // trainWords = new BehaviorSubject<Word[]>([]);
  // currentTrainWords$ = this.trainWords.asObservable();

  private trainingResult = new BehaviorSubject<Word[]>([]);
  currentTrainingResult$ = this.trainingResult.asObservable();
  constructor(
    private generalState: GeneralState
  ) {
  }
  getUserWords() {
    return this.generalState.getUserWords$();
  }

  getRandomOrder(words?: Word[]) {
    for (let i = words.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * words.length);
      const temp = words[i];
      words[i] = words[j]
      words[j] = temp;
    }
    return words;
  }

  addWordToResultWords(resultWords: Word[], word: Word) {
    resultWords.push(word);
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

  getWordGroups() {
    return this.generalState.getWordsGroups$();
  }
  // setTrainWords(words: Word[]) {
  //   this.trainWords.next(words);
  // }

  // getTrainWords() {
  //   return this.trainWords.getValue();
  // }

  // getTrainWords$() {
  //   return this.currentTrainWords$;

  // }

  setWordKnowledgeLevel(wordId: string, level: number) {
    const currentWords = this.generalState.getUserWords()
      .map(word => word._id === wordId ? { ...word, levelKnowledge: level } : word);

    this.generalState.setUserWords(currentWords);
  }


  setSelectedGroupForTraining(groupId: string) {
    this.generalState.setSelectedGroupForTraining(groupId);
  }

  getSelectedGroupForTraining() {
    return this.generalState.getSelectedGroupForTraining();
  }

  getFiltredWordsByGroup() {
    return combineLatest(
      [
        this.getUserWords(),
        this.getSelectedGroupForTraining()
      ]
    )
      .pipe(
        switchMap(([words, selectedGroupForTraining]) => {
          return of(words.filter(word => word.assignedGroups.includes(selectedGroupForTraining)));
        })
      );
  }
}
