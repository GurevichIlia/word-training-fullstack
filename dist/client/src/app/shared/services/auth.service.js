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
const app_config_1 = require("./../../app.config");
let AuthService = class AuthService {
    constructor(http, localStorage, router) {
        this.http = http;
        this.localStorage = localStorage;
        this.router = router;
        this.isLoggedIn = new rxjs_1.BehaviorSubject(false);
        if (localStorage.getItem('token')) {
            this.setIsAuthenticated(true);
        }
    }
    registration(newUser) {
        return this.http.post(`${app_config_1.baseUrl}auth/registration`, newUser);
    }
    login(user) {
        return this.http.post(`${app_config_1.baseUrl}auth/login`, user);
    }
    logOut() {
        this.setIsAuthenticated(false);
        this.localStorage.removeItem('token');
        this.router.navigate(['authorization/login']);
    }
    setIsAuthenticated(value) {
        this.isLoggedIn.next(value);
    }
    isAuthenticated() {
        return this.isLoggedIn.getValue();
    }
    isAuthenticated$() {
        return this.isLoggedIn;
    }
    setCurrentUser(user) {
        this.currentUser = user;
    }
    getCurrentUser() {
        return this.currentUser;
    }
    isPasswordsMatch(password, confirmPassword) {
        return password === confirmPassword;
    }
};
AuthService = __decorate([
    core_1.Injectable({
        providedIn: 'root'
    })
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map