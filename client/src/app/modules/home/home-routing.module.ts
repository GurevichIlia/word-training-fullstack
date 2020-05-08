import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WordsTrainGuard } from 'src/app/shared/guards/words-train.guard';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  {
    path: '', component: HomeComponent, children: [
      { path: '', pathMatch: 'full', redirectTo: '/vocabulary' },
      { path: 'languages', loadChildren: () => import('./../../languages/languages.module').then(m => m.LanguagesModule) },
      {
        path: 'word-training', loadChildren: () => import('./../../word-training/word-training.module').then(m => m.WordTrainingModule),
        canActivate: [WordsTrainGuard]
      },
      { path: 'vocabulary', loadChildren: () => import('./../../vocabulary/vocabulary.module').then(m => m.VocabularyModule) },
      {
        path: 'train-result', loadChildren: () => import('./../../train-result/train-result.module').then(m => m.TrainResultModule),
        canActivate: [WordsTrainGuard]
      },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
