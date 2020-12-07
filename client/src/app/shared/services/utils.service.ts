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
        if (words && group) {
          return words.filter(word => word.assignedGroups.includes(group._id))

        }

        return []
      })
    )
  }
}
