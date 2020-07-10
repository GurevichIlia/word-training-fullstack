import { GeneralFacade } from 'src/app/general.facade';
import { ApiWordsService } from '../../shared/services/api/api-words.service';
import { GeneralState } from '../../general.state';
import { Injectable } from '@angular/core';
import { WordTrainingService } from '../../word-training/word-training.service';
import { map, switchMap } from 'rxjs/operators';
import { Word } from '../../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class TrainResultService {

  constructor(
    private generalFacade: GeneralFacade,
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
    return this.generalFacade.getCurrentLearningLanguage$()
    .pipe(
      switchMap(language => {
      return this.wordApiService.updateWords(allWords, language);
    }));
  }

  getTrainedGroup() {
    return this.trainingService.getSelectedGroupForTraining()
      .pipe(
        switchMap(id => {
          return this.trainingService.getWordGroups().pipe(map(groups => groups.find(group => group._id === id)));
        }));
  }


}
