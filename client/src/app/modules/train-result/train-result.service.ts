import { ApiWordsService } from '../../shared/services/api/api-words.service';
import { GeneralState } from '../../general.state';
import { Injectable } from '@angular/core';
import { WordTrainingService } from '../../word-training/word-training.service';
import { map } from 'rxjs/operators';
import { Word } from '../../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class TrainResultService {

  constructor(
    private trainingService: WordTrainingService,
    private generalState: GeneralState,
    private wordApiService: ApiWordsService) { }

  getFiltredWordsByGroup() {
    return this.trainingService.getFiltredWordsByGroup()
      .pipe(
        map(words => words.filter(word => word.levelKnowledge !== 0))// Don't show words that were not be used in training
      );
  }

  setDefaultValueForSelectedGroupForTraining() {
    this.generalState.setSelectedGroupForTraining('1');
  }

  updateWords() {
    const allWords = this.generalState.getUserWords();
    return this.wordApiService.updateWords(allWords, this.generalState.getCurrentLearningLanguage());
  }
}
