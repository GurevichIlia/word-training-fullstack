import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from './../../shared/shared.module';
import { AuthorizationComponent } from './authorization.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';


const authRoutes: Routes = [
  {
    path: '', component: AuthorizationComponent, children: [
      { path: '', pathMatch: 'full', redirectTo: '/login' },
      {
        path: 'login', component: LoginComponent,
      },
      {
        path: 'registration', component: RegistrationComponent,
      },
    ]
  },
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
