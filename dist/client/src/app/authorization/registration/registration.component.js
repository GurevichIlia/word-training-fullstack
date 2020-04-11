"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const forms_1 = require("@angular/forms");
const core_1 = require("@angular/core");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
let RegistrationComponent = class RegistrationComponent {
    constructor(authService, router, fb, notifications) {
        this.authService = authService;
        this.router = router;
        this.fb = fb;
        this.notifications = notifications;
        this.passwordInputColor = '';
        this.emailInputColor = '';
        this.nameInputColor = '';
        this.emailError = '';
        this.unsubscribe$ = new rxjs_1.Subject();
    }
    ngOnInit() {
        this.registrationForm = this.fb.group({
            nickName: ['', forms_1.Validators.required],
            email: ['', [forms_1.Validators.required, forms_1.Validators.email]],
            password: ['', forms_1.Validators.required],
            confPassword: ['', forms_1.Validators.required]
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
                    .pipe(operators_1.takeUntil(this.unsubscribe$))
                    .subscribe(user => {
                    if (user) {
                        this.authService.setCurrentUser(user);
                        this.goToLogin();
                    }
                }, err => {
                    this.notifications.error(err.error.message, 'Error');
                });
            }
            else {
                this.notifications.warning('', 'Passwords do not match');
            }
        }
        else {
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
    ngOnDestroy() {
        // Called once, before the instance is destroyed.
        // Add 'implements OnDestroy' to the class.
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
};
RegistrationComponent = __decorate([
    core_1.Component({
        selector: 'app-registration',
        templateUrl: './registration.component.html',
        styleUrls: ['./registration.component.scss'],
    })
], RegistrationComponent);
exports.RegistrationComponent = RegistrationComponent;
//# sourceMappingURL=registration.component.js.map