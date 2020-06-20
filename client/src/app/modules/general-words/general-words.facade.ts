import { ApiWordsService } from './../../shared/services/api/api-words.service';
import { GeneralState } from 'src/app/general.state';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class GeneralWordsFacade {
  constructor(
    private apiWords: ApiWordsService,
    private generalState: GeneralState
  ) {

  }

  getGeneralWords() {
    return this.apiWords.getGeneralWordsForAll(this.generalState.getCurrentLearningLanguage()._id)
  }
}
