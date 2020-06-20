import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  {
    path: '', component: HomeComponent, children: [
      { path: '', pathMatch: 'full', redirectTo: '/vocabulary' },
      {
        path: 'languages', loadChildren: () => import('./../../languages/languages.module').then(m => m.LanguagesModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'word-training', loadChildren: () => import('./../../word-training/word-training.module').then(m => m.WordTrainingModule),
        // canActivate: [WordsTrainGuard]
      },
      {
        path: 'vocabulary', loadChildren: () => import('./../../vocabulary/vocabulary.module').then(m => m.VocabularyModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'train-result', loadChildren: () => import('../train-result/train-result.module').then(m => m.TrainResultModule),
        // canActivate: [WordsTrainGuard]
      },
      {
        path: 'general-words', loadChildren: () => import('../general-words/general-words.module').then(m => m.GeneralWordsModule),
        // canActivate: [WordsTrainGuard]
      },
      {
        path: 'settings', loadChildren: () => import('../settings/settings.module').then(m => m.SettingsModule),
        // canActivate: [WordsTrainGuard]
      },
      { path: '**', redirectTo: '/vocabulary' },

    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
