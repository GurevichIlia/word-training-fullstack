import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AssignWordListComponent } from './assign-word-list/assign-word-list.component';
import { VocabularyComponent } from './vocabulary.component';
import { SelectLanguageGuardGuard } from 'src/app/shared/guards/select-language-guard.guard';
import { SharedModule } from 'src/app/shared/shared.module';
import { CsvManagerComponent } from './csv-manager/csv-manager.component';


const vocabularyRoutes: Routes = [
  { path: '', component: VocabularyComponent  , canActivate: [SelectLanguageGuardGuard]}
];


@NgModule({
  declarations: [
    VocabularyComponent,
    AssignWordListComponent,
    CsvManagerComponent,

  ],
  imports: [

    SharedModule,
    RouterModule.forChild(vocabularyRoutes)
  ],
})
export class VocabularyModule { }
