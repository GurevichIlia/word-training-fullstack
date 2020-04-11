import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { VocabularyComponent } from './vocabulary.component';
import { SharedModule } from '../shared/shared.module';
import { WordComponent } from './word/word.component';

const vocabularyRoutes: Routes = [
  { path: '', component: VocabularyComponent }
];


@NgModule({
  declarations: [
    VocabularyComponent,
    WordComponent,

  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(vocabularyRoutes)
  ],
})
export class VocabularyModule { }
