import { animate, keyframes, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
  }

  login() {
    console.log(this.loginForm.value);
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value)
        .pipe(
          takeUntil(this.subscription$)
        )
        .subscribe(res => {
          if (res) {
            console.log('AFTER LOGIN', res);
            this.authService.setIsAuthenticated(true);
            this.localStorageService.setItem('token', res.token);
            if (res.currentLanguage) {
              this.generalFacade.setCurrentLanguage(res.currentLanguage);
              this.router.navigate(['vocabulary']);
            } else {
              this.router.navigate(['languages']);

            }
            this.notifications.success('', res.message);

          }
        }, err => {
          this.notifications.error('', err.error.message);
        });
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
