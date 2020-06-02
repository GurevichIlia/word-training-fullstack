import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { Word } from '../shared/interfaces';
import { ALL_WORDS, FAVORITES } from '../vocabulary/vocabulary.facade';
import { GeneralState } from './../general.state';
import { VocabularyFacade } from './../vocabulary/vocabulary.facade';

@Injectable({
  providedIn: 'root'
})
export class WordTrainingService {
  // trainWords = new BehaviorSubject<Word[]>([]);
  // currentTrainWords$ = this.trainWords.asObservable();

  private trainingResult = new BehaviorSubject<Word[]>([]);
  currentTrainingResult$ = this.trainingResult.asObservable();
  constructor(
    private generalState: GeneralState,
    private vocabularyFacade: VocabularyFacade
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
        this.getUserWords().pipe(startWith([] as Word[])),
        this.getSelectedGroupForTraining()
      ]
    )
      .pipe(
        switchMap(([words, selectedGroupForTraining]) => {

          if (selectedGroupForTraining === ALL_WORDS) {

            return of(words);

          } else if (selectedGroupForTraining === FAVORITES) {

            return this.vocabularyFacade.filterWordsByFavorite(of(words));

          } else {

            return of(words.filter(word => word.assignedGroups.includes(selectedGroupForTraining)))
          }

        })
      );
  }
}
