import { Words } from 'src/app/shared/models/words.model';
import { Pipe, PipeTransform } from '@angular/core';
import { Word } from '../interfaces';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  
  transform(value: any, args?: any): any {
    if (args) {
      const founded = this._filter(value, args);
      return founded;
    } else {
      return value;
    }

  }
  private _filter(array: Word[], value: string): Word[] {
    const filterValue = value.toLowerCase();
    return array.filter(word => word.word.toLowerCase().includes(filterValue) || word.translation.toLowerCase().includes(filterValue));
  }
}
