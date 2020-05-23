import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '', loadChildren: () => import('./authorization/authorization.module').then(m => m.AuthorizationModule),
  },

  {
    path: '', loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule),
  },

  { path: '**', redirectTo: '/vocabulary' },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
