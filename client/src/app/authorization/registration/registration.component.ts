import { NotificationsService } from '../../shared/services/notifications.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthService } from '../../shared/services/auth.service';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit, OnDestroy {
  registrationForm: FormGroup;
  passwordIncorrect: boolean;
  passwordInputColor = '';
  emailInputColor = '';
  nameInputColor = '';
  emailError = '';
  unsubscribe$ = new Subject();
  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private notifications: NotificationsService
  ) { }

  ngOnInit() {
    this.registrationForm = this.fb.group({
      nickName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confPassword: ['', Validators.required]
    });
  }

  get email() {
    return this.registrationForm.get('email');
  }

  get registrForm() {
    return this.registrationForm;
  }
  get password() {
    return this.registrationForm.get('password');
  }

  get confirmPassword() {
    return this.registrationForm.get('confPassword');
  }

  goToLogin() {
    this.router.navigate(['authorization/login']);
  }

  createUser() {
    if (this.registrationForm.valid) {
      if (this.authService.isPasswordsMatch(this.password.value, this.confirmPassword.value)) {
        this.authService.registration(this.registrationForm.value)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(user => {
            if (user) {
              this.authService.setCurrentUser(user);
              this.goToLogin();
            }
          }, err => {
            this.notifications.error(err.error.message, 'Error');
          });
      } else {
        this.notifications.warning('', 'Passwords do not match');

      }
    } else {
      this.notifications.warning('', 'Form is invalid');

    }

    // this.authService.registration(this.registrForm.value).then(error => {
    //   if (error) {
    //     if (error.code === 'auth/email-already-in-use') {
    //       this.emailInputColor = 'danger';
    //       this.emailError = error.message;
    //       this.changeDetector.detectChanges();
    //     }
    //   }

    // });
    // console.log('work!');
  }



  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
