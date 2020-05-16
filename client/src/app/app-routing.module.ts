import { AuthGuard } from './shared/guards/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { WordsTrainGuard } from './shared/guards/words-train.guard';


const routes: Routes = [

  {
    path: '', loadChildren: () => import('./authorization/authorization.module').then(m => m.AuthorizationModule),
  },

  {
    path: '', loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule),
  },

  { path: '**', redirectTo: '/login' },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
