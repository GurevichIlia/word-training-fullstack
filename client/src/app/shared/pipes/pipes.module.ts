import { ConvertToPercentPipe } from './convert-to-percent.pipe';
import { ReverseArrayPipe } from './reverse-array.pipe';
import { NgModule } from '@angular/core';
import { WordsFilterPipe } from './words-filter.pipe';
import { WordMenuPipe } from './word-menu.pipe';
import { VerbConjugationPipe } from './verb-conjugation.pipe';
import { ConjugationTemplatePipe } from './conjugation-template.pipe';



@NgModule({
  imports: [],
  exports: [
    ReverseArrayPipe,
    ConvertToPercentPipe,
    WordsFilterPipe,
    WordMenuPipe,
    ConjugationTemplatePipe
  ],
  declarations: [
    ReverseArrayPipe,
    ConvertToPercentPipe,
    WordsFilterPipe,
    WordMenuPipe,
    VerbConjugationPipe,
    ConjugationTemplatePipe
  ],
  providers: [],
})
export class PipesModule { }
