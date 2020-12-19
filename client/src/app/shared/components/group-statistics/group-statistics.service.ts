import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { LEVEL_LIST } from 'src/app/core';
import { Word } from '../../interfaces';
import { GroupStatistics, KnowledgeLevel } from './group-statistics.component';

@Injectable()
export class GroupStatisticsService {
  getGroupStatistics(words$: Observable<Word[]>): Observable<GroupStatistics> {
    const statistics$: Observable<GroupStatistics> = words$
      .pipe(
        filter(words => words !== null && words !== undefined),
        map(words => {
          const knowledgeLevel: KnowledgeLevel[] = this.getKnowledgeLevel(words, LEVEL_LIST);
          return { knowledgeLevel, allWordsInGroup: words.length };
        })
      );

    return statistics$;
  }

  private getQuntityWordsByLevel(words: Word[], level: number): number {

    return words.length > 0 ? (words.filter(word => word.levelKnowledge === level)).length : 0;
  }

  private getKnowledgeLevel(words: Word[], levelList: { color: string, level: number }[]): KnowledgeLevel[] {

    return levelList.map(item => {
      const knowledgeLevel: KnowledgeLevel = {
        level: item.level,
        color: item.color,
        wordQuantity: this.getQuntityWordsByLevel(words, item.level)
      };

      return knowledgeLevel;
    })
  }
}
