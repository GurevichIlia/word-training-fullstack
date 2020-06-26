import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { VocabularyComponent } from './vocabulary.component';
import { SharedModule } from '../shared/shared.module';
import { WordComponent } from './word/word.component';
import { WordListComponent } from './word-list/word-list.component';
import { SearchComponent } from './search/search.component';
import { AssignWordListComponent } from './assign-word-list/assign-word-list.component';

const vocabularyRoutes: Routes = [
  { path: '', component: VocabularyComponent }
];


@NgModule({
  declarations: [
    VocabularyComponent,
    AssignWordListComponent,

  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(vocabularyRoutes)
  ],
})
export class VocabularyModule { }
