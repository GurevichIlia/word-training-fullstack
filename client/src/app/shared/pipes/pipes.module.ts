import { ConvertToPercentPipe } from './convert-to-percent.pipe';
import { ReverseArrayPipe } from './reverse-array.pipe';
import { NgModule } from '@angular/core';
import { WordsFilterPipe } from './words-filter.pipe';



@NgModule({
  imports: [],
  exports: [
    ReverseArrayPipe,
    ConvertToPercentPipe,
    WordsFilterPipe
  ],
  declarations: [
    ReverseArrayPipe,
    ConvertToPercentPipe,
    WordsFilterPipe
  ],
  providers: [],
})
export class PipesModule { }
