import { map } from 'rxjs/operators';
import { WordGroup, Word } from 'src/app/shared/interfaces';
import { Injectable } from '@angular/core';
import { GeneralState } from 'src/app/general.state';
import { Observable, combineLatest } from 'rxjs';
import { WordCounterService } from 'src/app/shared/components/word-counter/word-counter.service';
import { WordTrainingFacade } from '../word-training.facade';

@Injectable()
export class TrainResultService {

  constructor(
    private counterService: WordCounterService,
  ) { }



  // setDefaultValueForSelectedGroupForTraining() {
  //   this.generalState.setSelectedGroupForTraining(ALL_WORDS_GROUP);
  // }
  // setSelectedGroupForTraining(group: WordGroup) {
  //   this.generalState.setSelectedGroupForTraining(group);
  // }

  // updateWords() {
  //   return this.trainingService.updateWords();
  // }

  // getTrainingResult$() {
  //   return this.counterService.getTrainResult$();
  // }

  // getTrainedGroup() {
  //   return this.trainingService.getSelectedGroupForTraining();
  // }

  // counterResult$() {
  //   return combineLatest(
  //     [
  //       this.counterService.totalCardsLearned$(),
  //       this.counterService.getQuantityLearnedWords$(),
  //       this.counterService.getQuantityAllWords$()
  //     ]
  //   ).pipe(
  //     map(
  //       ([totalCardsLearned, quantityLearnedWords, quantityWordsInGroup]) =>
  //         ({ totalCardsLearned, quantityLearnedWords, quantityWordsInGroup })));
  // }


  // clearCounterState() {
  //   this.counterService.clearCounterState();
  // }

  // startTraining() {
  //   this.trainingService.onStartTraining();
  // }

  // getGroupStatistics$(words$: Observable<Word[]>) {
  //   return this.vocabularyFacade.getGroupStatistics(words$);
  // }
}
