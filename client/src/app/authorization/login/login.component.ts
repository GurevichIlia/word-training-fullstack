import { GeneralFacade } from 'src/app/general.facade';
import { GeneralService } from './../../shared/services/general.service';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { NotificationsService } from '../../shared/services/notifications.service';
import { LocalstorageService } from '../../shared/services/localstorage.service';
import { takeUntil } from 'rxjs/operators';

import { trigger, keyframes, animate, transition } from '@angular/animations';
import * as kf from '../../shared/keyframes';
import { AuthService } from '../../shared/services/auth.service';
import { Subject } from 'rxjs';

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
        .pipe(takeUntil(this.subscription$))
        .subscribe(res => {
          if (res) {
            console.log('AFTER LOGIN', res);
            this.authService.setIsAuthenticated(true);
            this.localStorageService.setItem('token', res.token);
            this.generalFacade.setCurrentLanguage(res.currentLanguage);
            this.router.navigate(['vocabulary']);
            this.notifications.success('', res.message);

          }
        }, err => {
          this.notifications.error('', err.error.message);
        });
    }
  }

  //   .then((data) => {
  //   this.authService.userName.next(data.user.displayName);
  //   this.authService.isLogged.next(true);
  //   this.authService.userUid.next(data.user.uid);
  //   this.toastr.success('Successfully');
  //   this.router.navigate(['/home']);
  //   console.log('DATA', data);
  // }).catch(error => {
  //   if (error) {
  //     // if (error.code === 'auth/wrong-password') {
  //     this.startAnimation('swing');

  //     this.emailInputColor = 'danger';
  //     this.passwordInputColor = 'danger';
  //     this.errorMessage = 'Password or email is wrong!';
  //     this.changeDetector.detectChanges();
  //     // } else if (error.code === 'auth/user-not-found') {
  //     //   this.passwordInputColor = 'danger';
  //     //   this.errorMessage = error.message;
  //     //   // this.changeDetector.detectChanges();
  //     // }
  //   } else {
  //   this.emailInputColor = '';
  //   this.passwordInputColor = '';
  // }
  // console.log('ERROR', error);
  //     });
  //   }

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
    this.router.navigate(['authorization/registration']);
  }

  ngOnDestroy() {
    this.subscription$.next();
    this.subscription$.complete();
  }
}
