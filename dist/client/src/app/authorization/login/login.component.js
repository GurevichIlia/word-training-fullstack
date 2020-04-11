"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const forms_1 = require("@angular/forms");
const core_1 = require("@angular/core");
const operators_1 = require("rxjs/operators");
const animations_1 = require("@angular/animations");
const kf = __importStar(require("../../shared/keyframes"));
const rxjs_1 = require("rxjs");
let LoginComponent = class LoginComponent {
    constructor(authService, router, fb, localStorageService, notifications, generalService) {
        this.authService = authService;
        this.router = router;
        this.fb = fb;
        this.localStorageService = localStorageService;
        this.notifications = notifications;
        this.generalService = generalService;
        this.passwordInputColor = '';
        this.emailInputColor = '';
        this.errorMessage = '';
        this.subscription$ = new rxjs_1.Subject();
    }
    ngOnInit() {
        this.loginForm = this.fb.group({
            email: ['', [forms_1.Validators.required, forms_1.Validators.email]],
            password: ['', forms_1.Validators.required]
        });
    }
    login() {
        console.log(this.loginForm.value);
        if (this.loginForm.valid) {
            this.authService.login(this.loginForm.value)
                .pipe(operators_1.takeUntil(this.subscription$))
                .subscribe(res => {
                if (res) {
                    console.log('AFTER LOGIN', res);
                    this.authService.setIsAuthenticated(true);
                    this.localStorageService.setItem('token', res.token);
                    this.generalService.setCurrentLanguage(res.currentLanguage);
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
};
LoginComponent = __decorate([
    core_1.Component({
        selector: 'app-login',
        templateUrl: './login.component.html',
        styleUrls: ['./login.component.scss'],
        animations: [
            animations_1.trigger('loginAnimator', [
                animations_1.transition('* => swing', animations_1.animate(500, animations_1.keyframes(kf.swing)))
            ])
        ]
    })
], LoginComponent);
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map