import { map } from 'rxjs/operators';
import { WordGroup, Word } from 'src/app/shared/interfaces';
import { Injectable } from '@angular/core';
import { WordTrainingService } from '../word-training/word-training.service';
import { GeneralState } from 'src/app/general.state';
import { WordCounterService } from '../word-training/word-counter/word-counter.service';
import { VocabularyFacade } from '../vocabulary/vocabulary.facade';
import { Observable, combineLatest } from 'rxjs';

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
