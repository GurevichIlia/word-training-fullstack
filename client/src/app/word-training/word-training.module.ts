import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from './../shared/shared.module';
import { WordTrainingComponent } from './word-training.component';
import { InstructionsComponent } from './instructions/instructions.component';
import { TrainComponent } from './train/train.component';
import { SelectLanguageGuardGuard } from '../shared/guards/select-language-guard.guard';

const wordtrainingRoutes: Routes = [
  { path: '', component: WordTrainingComponent, canActivate: [SelectLanguageGuardGuard] }
];

@NgModule({
  declarations: [WordTrainingComponent, InstructionsComponent, TrainComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(wordtrainingRoutes)
  ]
})
export class WordTrainingModule { }
