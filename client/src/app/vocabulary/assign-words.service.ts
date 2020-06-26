import { ApiWordsService } from './../shared/services/api/api-words.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AssignWordsService {
  constructor(private api: ApiWordsService) { }

  selectWordForAssign(wordId: string, selectedWords: string[]) {
    let words = [...selectedWords];


    if (words.includes(wordId)) {
      words = words.filter(id => id !== wordId);
    } else {
      words.push(wordId);
    }
    return words;

  }

  assignWords({ groupId, selectedWords }) {
    return this.api.assignGroup(groupId, selectedWords);
  }

}
