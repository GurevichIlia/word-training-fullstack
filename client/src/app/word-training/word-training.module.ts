import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from './../shared/shared.module';
import { WordTrainingComponent } from './word-training.component';

const wordtrainingRoutes: Routes = [
  { path: '', component: WordTrainingComponent }
];

@NgModule({
  declarations: [WordTrainingComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(wordtrainingRoutes)
  ]
})
export class WordTrainingModule { }
