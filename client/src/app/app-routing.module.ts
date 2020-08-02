import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', redirectTo: 'vocabulary', pathMatch: 'full' },
  {
    path: '', loadChildren: () => import('./modules/authorization/authorization.module').then(m => m.AuthorizationModule),
  },

  {
    path: '', loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule),
  },

  { path: '**', redirectTo: '' },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
