import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
import { ALL_WORDS_GROUP, FAVORITES } from 'src/app/general.state';
import { GeneralWord } from 'src/app/modules/general-words/types/general-words.interfaces';
import { Word, WordGroup } from '../interfaces';
type SearchValue = string
@Pipe({
  name: 'wordsFilter'
})
export class WordsFilterPipe implements PipeTransform {

  transform(words: (Word | GeneralWord)[], ...args: [SearchValue]): any {
    const searchValue = args[0];

    return this.filterBySearchValue(searchValue, words)
  }

  filterBySearchValue(searchValue: string, words: (Word | GeneralWord)[]) {


    if (searchValue) {
      debugger

      return words.filter(word => word.word.toLowerCase().includes(searchValue.toLowerCase()) ||
        word.translation.toLowerCase().includes(searchValue.toLowerCase()));

    } else {

      return words;

    }
  };


}
