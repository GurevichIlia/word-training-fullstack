import { TrainResultComponent } from './train-result.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

const resultRoutes: Routes = [
  { path: '', component: TrainResultComponent }
]

@NgModule({
  declarations: [TrainResultComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(resultRoutes)
  ]
})
export class TrainResultModule { }
