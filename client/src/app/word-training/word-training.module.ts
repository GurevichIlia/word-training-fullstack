import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from './../shared/shared.module';
import { WordTrainingComponent } from './word-training.component';
import { InstructionsComponent } from './instructions/instructions.component';
import { TrainComponent } from './train/train.component';
import { SelectLanguageGuardGuard } from '../shared/guards/select-language-guard.guard';
import { WordCounterComponent } from './word-counter/word-counter.component';
import { SelectGroupComponent } from './select-group/select-group.component';

const wordtrainingRoutes: Routes = [
  {
    path: '', component: WordTrainingComponent,
    canActivate: [SelectLanguageGuardGuard], children: [
      { path: '', pathMatch: 'full', redirectTo: 'select-group' },
      { path: 'select-group', component: SelectGroupComponent, canActivate: [SelectLanguageGuardGuard] },
      { path: 'basic', component: TrainComponent, canActivate: [SelectLanguageGuardGuard] },
      {
        path: 'train-result', loadChildren: () => import('../modules/train-result/train-result.module').then(m => m.TrainResultModule),
      },
    ]
  }
];

@NgModule({
  declarations: [WordTrainingComponent, InstructionsComponent, TrainComponent, SelectGroupComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(wordtrainingRoutes)
  ]
})
export class WordTrainingModule { }
