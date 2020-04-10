import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthorizationComponent } from './authorization.component';
import { RegistrationComponent } from './registration/registration.component';
import { SharedModule } from './../shared/shared.module';
import { LoginComponent } from './login/login.component';

const authRoutes: Routes = [
  { path: '', component: AuthorizationComponent,  pathMatch: 'full', redirectTo: 'login', },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },

];


@NgModule({
  declarations: [
    AuthorizationComponent,
    LoginComponent,
    RegistrationComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(authRoutes),
    SharedModule
  ]
})
export class AuthorizationModule { }