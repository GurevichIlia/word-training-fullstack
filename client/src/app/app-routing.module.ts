import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WordsTrainGuard } from './shared/guards/words-train.guard';


const routes: Routes = [
      { path: '', pathMatch: 'full', redirectTo: '/vocabulary', },
      { path: 'authorization', loadChildren: () => import('./authorization/authorization.module').then(m => m.AuthorizationModule) },
      { path: 'languages', loadChildren: () => import('./languages/languages.module').then(m => m.LanguagesModule) },
      { path: 'word-training', loadChildren: () => import('./word-training/word-training.module').then(m => m.WordTrainingModule),
       canActivate: [WordsTrainGuard] },
      { path: 'vocabulary', loadChildren: () => import('./vocabulary/vocabulary.module').then(m => m.VocabularyModule) },
      { path: 'train-result', loadChildren: () => import('./train-result/train-result.module').then(m => m.TrainResultModule), 
       canActivate: [WordsTrainGuard]  },



      { path: '**', redirectTo: '/authorization' },
];


@NgModule({
      imports: [RouterModule.forRoot(routes)],
      exports: [RouterModule]
})
export class AppRoutingModule { }