import { StopWordsTrainGuard } from './../../shared/guards/stop-words-train.guard';
import { NbCardModule, NbButtonModule } from '@nebular/theme';
import { CommonModule } from '@angular/common';
import { GroupStatisticsModule } from './../../shared/components/group-statistics/group-statistics.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WordCounterModule } from 'src/app/shared/components/word-counter/word-counter.module';
import { WordCounterService } from 'src/app/shared/components/word-counter/word-counter.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { GroupListModule } from './../../shared/components/group-list/group-list.module';
import { SelectGroupComponent } from './select-group/select-group.component';
import { TrainComponent } from './train/train.component';
import { WordCardComponent } from './train/word-card/word-card.component';
import { WordTrainingComponent } from './word-training.component';
import { WordTrainingFacade } from './word-training.facade';
import { WordTrainingService } from './word-training.service';
import { UtilsService } from 'src/app/shared/services/utils.service';



const wordtrainingRoutes: Routes = [
  {
    path: '', component: WordTrainingComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'select-group' },
      { path: 'select-group', component: SelectGroupComponent, },
      { path: 'training', component: TrainComponent, canDeactivate: [StopWordsTrainGuard] },
      {
        path: 'train-result', loadChildren: () => import('./train-result/train-result.module').then(m => m.TrainResultModule),
      },
    ],

  }
];

@NgModule({
  declarations: [
    WordTrainingComponent,
    TrainComponent,
    SelectGroupComponent,
    WordCardComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(wordtrainingRoutes),

    GroupListModule,
    WordCounterModule,
    GroupStatisticsModule,

    NbCardModule,
    NbButtonModule
  ],
  providers: [
    WordTrainingFacade,
    WordTrainingService,
    WordCounterService,
    UtilsService
  ]
})
export class WordTrainingModule { }
