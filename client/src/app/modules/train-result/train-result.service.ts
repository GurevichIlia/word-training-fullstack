import { VocabularyFacade } from './../../vocabulary/vocabulary.facade';
import { combineLatest, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ALL_WORDS_GROUP, GeneralState } from '../../general.state';
import { WordTrainingService } from '../../word-training/word-training.service';
import { WordCounterService } from './../../word-training/word-counter/word-counter.service';
import { map } from 'rxjs/operators';
import { WordGroup, Word } from 'src/app/shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class TrainResultService {

  constructor(
    private trainingService: WordTrainingService,
    private generalState: GeneralState,
    private counterService: WordCounterService,
    private vocabularyFacade: VocabularyFacade) { }



  // setDefaultValueForSelectedGroupForTraining() {
  //   this.generalState.setSelectedGroupForTraining(ALL_WORDS_GROUP);
  // }
  setSelectedGroupForTraining(group: WordGroup) {
    this.generalState.setSelectedGroupForTraining(group);
  }

  updateWords() {
    return this.trainingService.updateWords();
  }

  getTrainingResult$() {
    return this.counterService.getTrainResult$();
  }

  getTrainedGroup() {
    return this.trainingService.getSelectedGroupForTraining();
  }

  counterResult$() {
    return combineLatest(
      [
        this.counterService.totalCardsLearned$(),
        this.counterService.getQuantityLearnedWords$(),
        this.counterService.getQuantityAllWords$()
      ]
    ).pipe(
      map(
        ([totalCardsLearned, quantityLearnedWords, quantityWordsInGroup]) =>
          ({ totalCardsLearned, quantityLearnedWords, quantityWordsInGroup })));
  }


  clearCounterState() {
    this.counterService.clearCounterState();
  }

  startTraining() {
    this.trainingService.onStartTraining();
  }

  getGroupStatistics$(words$: Observable<Word[]>) {
    return this.vocabularyFacade.getGroupStatistics(words$)
  }
}
