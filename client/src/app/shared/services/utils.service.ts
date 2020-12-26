import { Injectable } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Word, WordGroup } from '../interfaces';

@Injectable()
export class UtilsService {


  trackBy(index, word: Word) {
    if (!word) {
      return null;
    } else {
      return word._id;
    }
  }

  filterByGroup(words$: Observable<Word[]>, group$: Observable<WordGroup>): Observable<Word[]> {
    return combineLatest([
      words$,
      group$
    ]).pipe(
      map(([words, group]) => {
        return this.filter(words, group)
      })
    )
  }

  private isFavoriteWords(group: WordGroup): boolean {
    return group._id === '2'
  }

  filter(words: Word[], selectedGroup: WordGroup): Word[] {
    if (words && selectedGroup) {

      if (this.isFavoriteWords(selectedGroup)) {
        return words.filter(word => word.isFavorite)
      }
      return words.filter(word => word.assignedGroups.includes(selectedGroup._id))

    }
    return []
  }

}

