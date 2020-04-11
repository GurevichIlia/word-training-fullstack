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
const app_config_1 = require("src/app/app.config");
const operators_1 = require("rxjs/operators");
let GeneralService = class GeneralService {
    constructor(http) {
        // if (localStorage.getItem('words-language')) {
        //   const lang = JSON.parse(localStorage.getItem('words-language'))
        //   this.setCurrentLanguage(lang);
        this.http = http;
        this.currentLearningLanguage = new rxjs_1.BehaviorSubject({});
        this.currentLearningLanguage$ = this.currentLearningLanguage.asObservable();
        this.quantityWords = new rxjs_1.BehaviorSubject(null);
        this.quantityWords$ = this.quantityWords.asObservable();
        // }
    }
    setCurrentLanguage(language) {
        this.currentLearningLanguage.next(language);
        // = of(language);
    }
    getCurrentLanguage$() {
        // tslint:disable-next-line: max-line-length
        return this.http.get(`${app_config_1.baseUrl}languages/getCurrentLanguage`).pipe(operators_1.map(({ currentLang }) => currentLang), operators_1.shareReplay(1));
    }
    setQuantityWords(value) {
        this.quantityWords.next(value);
    }
    getQuantityWords$() {
        return this.quantityWords$;
    }
    compareFn(c1, c2) {
        return c1 && c2 ? c1.id === c2.id : c1 === c2;
    }
};
GeneralService = __decorate([
    core_1.Injectable({
        providedIn: 'root'
    })
], GeneralService);
exports.GeneralService = GeneralService;
//# sourceMappingURL=general.service.js.map