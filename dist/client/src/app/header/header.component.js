"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const rxjs_1 = require("rxjs");
const forms_1 = require("@angular/forms");
const operators_1 = require("rxjs/operators");
let HeaderComponent = class HeaderComponent {
    constructor(authService, menuService, generalService) {
        this.authService = authService;
        this.menuService = menuService;
        this.generalService = generalService;
        this.unsubscribe$ = new rxjs_1.Subject();
        this.items = [
            { title: 'Vocabulary', link: 'vocabulary' },
            { title: 'Word train', link: 'word-training' },
            { title: 'Change language', link: 'languages' },
            { title: 'Log out', link: 'authorization/login', icon: 'log-out' }
        ];
        this.themeControl = new forms_1.FormControl('');
    }
    get theme() {
        return this.themeControl;
    }
    ngOnInit() {
        this.getIsLoggedIn();
        this.getUserName();
        this.menuService.onItemClick()
            .pipe(operators_1.takeUntil(this.unsubscribe$))
            .subscribe(data => {
            if (data.item.title === 'Log out') {
                this.logout();
            }
        });
        this.getCurrentLanguage();
        this.getquantityWords();
    }
    getUserName() {
        this.user = this.authService.getCurrentUser();
    }
    getIsLoggedIn() {
        this.isLoggedIn$ = this.authService.isAuthenticated$().pipe(operators_1.tap(res => console.log(res)));
    }
    logout() {
        // console.log('log')
        this.authService.logOut();
    }
    getCurrentLanguage() {
        this.currentLanguage$ = this.generalService.currentLearningLanguage$.pipe(operators_1.tap(lang => console.log('LANGUAGE HEADER', lang)));
    }
    getquantityWords() {
        this.quantityWords$ = this.generalService.getQuantityWords$().pipe(operators_1.tap(q => console.log('QUANTITY', q)));
    }
    ngOnDestroy() {
        // Called once, before the instance is destroyed.
        // Add 'implements OnDestroy' to the class.
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
};
HeaderComponent = __decorate([
    core_1.Component({
        selector: 'app-header',
        templateUrl: './header.component.html',
        styleUrls: ['./header.component.scss']
    })
], HeaderComponent);
exports.HeaderComponent = HeaderComponent;
//# sourceMappingURL=header.component.js.map