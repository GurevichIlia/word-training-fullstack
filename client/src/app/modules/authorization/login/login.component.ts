import { NavigationService } from './../../../core/services/navigation.service';
import { LoginRequestInterface } from './../../../core/models/auth.model';
import { animate, keyframes, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { GeneralFacade } from 'src/app/general.facade';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';
import { NotificationsService } from 'src/app/shared/services/notifications.service';
import * as kf from '../../../shared/keyframes';
import { CurrentUserInterface } from './../../../shared/interfaces';
import { AppStateInterface } from './../../../store/reducers';
import { currentUserSelector, isSubmittingSelector, backendErrorsSelector } from '../store/selectors/auth.selectors';
import { AppRoutes } from 'src/app/core/routes/routes';
import { loginAction } from '../store/actions/auth.actions';




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
  isRegisterSuccess$: Observable<boolean>;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private localStorageService: LocalstorageService,
    private notifications: NotificationsService,
    private generalFacade: GeneralFacade,
    private store$: Store<AppStateInterface>,
    private navigation: NavigationService
  ) { }

  ngOnInit() {
    this.initializeForm();
    this.initializeValue();
  }

  initializeValue() {
    this.isRegisterSuccess$ = this.store$.pipe(
      select(currentUserSelector),
      map(user => {
        if (user) {
          this.setUserLoginDataAfterRegistration(user)
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
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
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
    // this.isLoading = true;
    // this.authService.login(this.loginForm.value)
    //   .pipe(
    //     finalize(() => this.isLoading = false),
    //     takeUntil(this.subscription$)
    //   )
    //   .subscribe(res => {
    //     if (res) {
    //       this.authService.setIsAuthenticated(true);
    //       this.localStorageService.setItem('words-token', res.token);
    //       if (res.currentLanguage) {
    //         this.generalFacade.setCurrentLanguage(of(res.currentLanguage));
    //         this.router.navigate(['vocabulary']);
    //       } else {
    //         this.router.navigate(['languages']);
    //       }
    //       this.notifications.success('', res.message);
    //       this.authService.setCurrentUser(null);
    //     }
    //   }, err => {
    //     if (err.error.message === 'Email is not found' || err.error.message === 'Password is not correct') {
    //       this.isShowLoginError = true;
    //     }
    //     this.notifications.error('', err.error.message);
    //   });

  }


  setUserLoginDataAfterRegistration(user: CurrentUserInterface) {
    // const user = this.authService.getCurrentUser()

    this.loginForm.patchValue({
      email: user.email,
    });

  }


  startAnimation(state) {
    console.log(state);
    if (!this.animationState) {
      this.animationState = state;
    }
  }

  resetAnimationState() {
    this.animationState = '';
  }

  goToRegistration() {
    this.navigation.navigateTo(AppRoutes.Register);
  }

  ngOnDestroy() {
    this.subscription$.next();
    this.subscription$.complete();
  }
}
