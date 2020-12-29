import { ConvertToPercentPipe } from './convert-to-percent.pipe';
import { ReverseArrayPipe } from './reverse-array.pipe';
import { NgModule } from '@angular/core';
import { WordsFilterPipe } from './words-filter.pipe';
import { WordMenuPipe } from './word-menu.pipe';



@NgModule({
  imports: [],
  exports: [
    ReverseArrayPipe,
    ConvertToPercentPipe,
    WordsFilterPipe,
    WordMenuPipe
  ],
  declarations: [
    ReverseArrayPipe,
    ConvertToPercentPipe,
    WordsFilterPipe,
    WordMenuPipe
  ],
  providers: [],
})
export class PipesModule { }
