
import { TrainResultComponent } from './train-result.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { WordCounterService } from 'src/app/shared/components/word-counter/word-counter.service';
import { GroupStatisticsModule } from 'src/app/shared/components/group-statistics/group-statistics.module';
import { WordCounterModule } from 'src/app/shared/components/word-counter/word-counter.module';
import { NbCardModule, NbListModule, NbProgressBarModule, NbButtonModule } from '@nebular/theme';

const resultRoutes: Routes = [
  { path: '', component: TrainResultComponent }
]

@NgModule({
  declarations: [
    TrainResultComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(resultRoutes),
    GroupStatisticsModule,
    PipesModule,
    WordCounterModule,
    NbCardModule,
    NbListModule,
    NbProgressBarModule,
    NbButtonModule

  ],
  providers: [WordCounterService]
})
export class TrainResultModule { }
