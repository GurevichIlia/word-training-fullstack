import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectLanguageGuardGuard } from '../shared/guards/select-language-guard.guard';
import { SharedModule } from '../shared/shared.module';
import { AssignWordListComponent } from './assign-word-list/assign-word-list.component';
import { VocabularyComponent } from './vocabulary.component';


const vocabularyRoutes: Routes = [
  { path: '', component: VocabularyComponent  , canActivate: [SelectLanguageGuardGuard]}
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
