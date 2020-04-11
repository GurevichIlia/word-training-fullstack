"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const operators_1 = require("rxjs/operators");
let SelectLanguageGuardGuard = class SelectLanguageGuardGuard {
    constructor(generalService, router) {
        this.generalService = generalService;
        this.router = router;
    }
    canActivate(next, state) {
        let canActive = false;
        return this.generalService.getCurrentLanguage$().pipe(operators_1.take(1), operators_1.map(lang => {
            console.log('GUARD LANG', lang);
            if (lang) {
                canActive = true;
            }
            else {
                canActive = false;
            }
            return canActive;
        }));
    }
};
SelectLanguageGuardGuard = __decorate([
    core_1.Injectable({
        providedIn: 'root'
    })
], SelectLanguageGuardGuard);
exports.SelectLanguageGuardGuard = SelectLanguageGuardGuard;
//# sourceMappingURL=select-language-guard.guard.js.map