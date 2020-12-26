import { AuthService } from 'src/app/modules/authorization/services/auth.service';
import { animate, keyframes, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AppRoutes } from 'src/app/core/routes/routes';
import * as kf from '../../../shared/keyframes';
import { loginAction } from '../store/actions/auth.actions';
import { backendErrorsSelector, isRegistrationSuccessSelector, isSubmittingSelector } from '../store/selectors/auth.selectors';
import { LoginRequestInterface } from './../../../core/models/auth.model';
import { NavigationService } from './../../../core/services/navigation.service';
import { CurrentUserInterface } from './../../../shared/interfaces';
import { AppStateInterface } from './../../../store/reducers';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('loginAnimator', [
      transition('* => swing', animate(500, keyframes(kf.swing)))
    ])
  ]
})
export class LoginComponent implements OnInit, OnDestroy {
  passwordInputColor = '';
  emailInputColor = '';
  errorMessage = '';
  animationState: string;
  subscription$ = new Subject();
  isShowLoginError = false;

  isLoading = false;

  loginForm: FormGroup;
  isSubmittings$: Observable<boolean>
  loginError$: Observable<string>
  isRegistrationSuccess$: Observable<boolean>;
  constructor(
    private fb: FormBuilder,
    private store$: Store<AppStateInterface>,
    private navigation: NavigationService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.initializeForm();
    this.initializeValue();
  }

  initializeValue() {
    this.isRegistrationSuccess$ = this.store$.pipe(
      select(isRegistrationSuccessSelector),
      map(registration => {
        if (registration.isSuccess) {
          this.setUserLoginDataAfterRegistration(registration.user)
          return true
        }
        return false;
      }))

    this.isSubmittings$ = this.store$.pipe(
      select(isSubmittingSelector),
      shareReplay(),
    );

    this.loginError$ = this.store$.pipe(
      select(backendErrorsSelector)
    )
  }

  initializeForm() {
    const lastEmail = this.authService.lastEmail


    this.loginForm = this.fb.group({
      email: [lastEmail, [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const requestData: LoginRequestInterface = this.loginForm.value
    this.store$.dispatch(loginAction({ requestData }))

  }


  setUserLoginDataAfterRegistration(user: CurrentUserInterface) {
    this.loginForm.patchValue({
      email: user.email,
    });

  }


  // startAnimation(state) {
  //   if (!this.animationState) {
  //     this.animationState = state;
  //   }
  // }

  // resetAnimationState() {
  //   this.animationState = '';
  // }

  goToRegistration() {
    this.navigation.navigateTo(AppRoutes.Register);
  }

  ngOnDestroy() {
    this.subscription$.next();
    this.subscription$.complete();
  }
}
