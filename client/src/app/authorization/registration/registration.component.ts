import { NotificationsService } from '../../shared/services/notifications.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil, debounce, debounceTime, tap } from 'rxjs/operators';

import { AuthService } from '../../shared/services/auth.service';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit, OnDestroy {
  registrationForm: FormGroup;
  registrationError = false;
  isPasswordsDontMatch = false;
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

    // this.checkPasswordsToMatching();
  }

  get email() {
    return this.registrationForm.get('email');
  }


  get password() {
    return this.registrationForm.get('password');
  }

  get confirmPassword() {
    return this.registrationForm.get('confPassword');
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  // checkPasswordsToMatching() {
  //   this.registrationForm.valueChanges
  //     .pipe(
  //       debounceTime(1000),
  //       tap(formValue => {
  //         if (formValue.password && formValue.confPassword) {
  //           this.isPasswordsDontMatch =
  //         }
  //       }
  //       ),
  //       takeUntil(this.unsubscribe$)
  //     )
  //     .subscribe();
  // }

  createUser() {
    this.isPasswordsDontMatch = !this.authService.isPasswordsMatch(this.password.value, this.confirmPassword.value)

    if (this.registrationForm.invalid || this.isPasswordsDontMatch) {
      this.registrationForm.markAllAsTouched();
      return;
    }


    this.authService.registration(this.registrationForm.value)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(user => {
        if (user) {
          this.authService.setCurrentUser(user);
          this.goToLogin();
        }
      }, err => {

        if (err.error.message === 'This email is already exist') {
          this.registrationError = true;
        }
      });
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




  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
