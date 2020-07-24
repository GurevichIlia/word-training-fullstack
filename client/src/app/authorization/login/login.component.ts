import { animate, keyframes, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, of } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { GeneralFacade } from 'src/app/general.facade';
import * as kf from '../../shared/keyframes';
import { AuthService } from '../../shared/services/auth.service';
import { LocalstorageService } from '../../shared/services/localstorage.service';
import { NotificationsService } from '../../shared/services/notifications.service';



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
  loginForm: FormGroup;
  passwordInputColor = '';
  emailInputColor = '';
  errorMessage = '';
  animationState: string;
  subscription$ = new Subject();
  isShowLoginError = false;
  isRegisterSuccess = false;
  isLoading = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private localStorageService: LocalstorageService,
    private notifications: NotificationsService,
    private generalFacade: GeneralFacade
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.setUserLoginDataAfterRegistration();
  }

  login() {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.authService.login(this.loginForm.value)
      .pipe(
        finalize(() => this.isLoading = false),
        takeUntil(this.subscription$)
      )
      .subscribe(res => {
        if (res) {
          this.authService.setIsAuthenticated(true);
          this.localStorageService.setItem('words-token', res.token);
          if (res.currentLanguage) {
            this.generalFacade.setCurrentLanguage(of(res.currentLanguage));
            this.router.navigate(['vocabulary']);
          } else {
            this.router.navigate(['languages']);
          }
          this.notifications.success('', res.message);
          this.authService.setCurrentUser(null);
        }
      }, err => {
        if (err.error.message === 'Email is not found' || err.error.message === 'Password is not correct') {
          this.isShowLoginError = true;
        }
        this.notifications.error('', err.error.message);
      });

  }


  setUserLoginDataAfterRegistration() {
    const user = this.authService.getCurrentUser()
    if (user) {
      this.loginForm.patchValue({
        email: user.email,
      });
      this.isRegisterSuccess = true;
    }
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
    this.router.navigate(['registration']);
  }

  ngOnDestroy() {
    this.subscription$.next();
    this.subscription$.complete();
  }
}
