import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/modules/authorization/services/auth.service';
import { NotificationsService } from 'src/app/shared/services/notifications.service';
import { registerAction } from '../store/actions/auth.actions';
import { backendErrorsSelector, isSubmittingSelector } from '../store/selectors/auth.selectors';
import { AppStateInterface } from './../../../store/reducers';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit, OnDestroy {
  registrationForm: FormGroup;
  registrationError = false;
  isPasswordsDontMatch = false;
  // unsubscribe$ = new Subject();
  // isLoading = false;

  isSubmitting$: Observable<boolean>;
  registrationError$: Observable<string>
  constructor(
    private authService: AuthService,
    // private router: Router,
    private fb: FormBuilder,
    private notifications: NotificationsService,
    private store$: Store<AppStateInterface>
  ) { }

  ngOnInit() {

    this.initializeForm();
    this.initializeValue();
  }

  initializeValue() {
    this.isSubmitting$ = this.store$.pipe(select(isSubmittingSelector));
    this.registrationError$ = this.store$.pipe(select(backendErrorsSelector))
  }

  initializeForm() {
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

  get password() {
    return this.registrationForm.get('password');
  }

  get confirmPassword() {
    return this.registrationForm.get('confPassword');
  }

  createUser() {
    this.isPasswordsDontMatch = !this.authService.isPasswordsMatch(this.password.value, this.confirmPassword.value)

    if (this.registrationForm.invalid || this.isPasswordsDontMatch) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    this.store$.dispatch(registerAction({ requestData: this.registrationForm.value }));
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    // this.unsubscribe$.next();
    // this.unsubscribe$.complete();
  }
}
