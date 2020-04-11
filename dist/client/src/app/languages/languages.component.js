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
const operators_1 = require("rxjs/operators");
let LanguagesComponent = class LanguagesComponent {
    constructor(notifications, languagesService, router, generalService) {
        this.notifications = notifications;
        this.languagesService = languagesService;
        this.router = router;
        this.generalService = generalService;
        this.isNewLanguage = false;
        this.mode = 'initial'; // initial, editlanguage, newlanguage
        this.subscription$ = new rxjs_1.Subject();
        // this.selectedLang = new FormControl('');
    }
    ngOnInit() {
        this.getLanguages();
        this.currentLearningLanguage$ = this.generalService.getCurrentLanguage$();
    }
    getLanguages() {
        this.languages$ = this.languagesService.getAllLanguages().pipe(operators_1.tap(res => console.log('LANGUAGES', res)));
    }
    goToVocabulary() {
        this.router.navigate(['vocabulary']);
    }
    setCurrentLearningLanguage(languageId) {
        if (languageId) {
            this.languagesService.setCurrentLanguageOnServer(languageId).subscribe(res => {
                if (res) {
                    this.goToVocabulary();
                }
            }, err => this.notifications.error('', err.error.message));
        }
        else {
            this.notifications.warning('', 'Please select language');
        }
    }
    addNewLang(language) {
        if (language) {
            const newLanguage = { name: language };
            this.languagesService.addLanguage(newLanguage)
                .pipe(operators_1.takeUntil(this.subscription$))
                .subscribe(res => {
                this.getLanguages();
                this.isNewLanguage = !this.isNewLanguage;
                this.notifications.success(newLanguage.name, 'Successfully added');
                this.changeMode('initial');
            }, err => this.notifications.error('', err.error.message));
        }
        else {
            this.notifications.warning('', 'Language name required');
        }
    }
    onEdit(langId) {
        if (langId) {
            this.editingLanguage$ = this.findLanguage(langId, this.languages$);
            this.changeMode('editlanguage');
        }
        else {
            this.notifications.warning('', 'Please select language');
        }
    }
    editLang(lang) {
        this.languagesService.editLanguage(lang)
            .pipe(operators_1.takeUntil(this.subscription$))
            .subscribe(res => {
            this.getLanguages();
            this.changeMode('initial');
        }, err => this.notifications.error('', err.error.message));
    }
    deleteLang(langId) {
        if (langId) {
            this.languagesService.deleteLanguage(langId)
                .pipe(operators_1.takeUntil(this.subscription$))
                .subscribe(res => {
                this.getLanguages();
            }, err => this.notifications.error('', err.error.message));
        }
        else {
            this.notifications.warning('', 'Please select language');
        }
    }
    findLanguage(id, languages$) {
        return languages$.pipe(operators_1.map(languages => languages.find(lang => lang._id === id)));
    }
    // Change bitween add and select language
    // changeMode() {
    //   // this.isNewLanguage = !this.isNewLanguage;
    //   // this.language = {} as Language;
    // }
    getActionFromChildren({ action, payload }) {
        switch (action) {
            case 'CHANGE MODE':
                this.changeMode(payload);
                // tslint:disable-next-line: align
                break;
            case 'SELECT':
                this.setCurrentLearningLanguage(payload);
                // tslint:disable-next-line: align
                break;
            case 'SAVE':
                this.addNewLang(payload);
                // tslint:disable-next-line: align
                break;
            case 'EDIT':
                this.onEdit(payload);
                // tslint:disable-next-line: align
                break;
            case 'DELETE':
                this.deleteLang(payload);
                // tslint:disable-next-line: align
                break;
            case 'UPDATE':
                this.editLang(payload);
                // tslint:disable-next-line: align
                break;
            default:
                break;
        }
    }
    changeMode(modeName) {
        this.mode = modeName;
    }
    unsubscribe() {
        this.subscription$.next();
        this.subscription$.complete();
    }
    ngOnDestroy() {
        this.unsubscribe();
        // Called once, before the instance is destroyed.
        // Add 'implements OnDestroy' to the class.
    }
};
LanguagesComponent = __decorate([
    core_1.Component({
        selector: 'app-languages',
        templateUrl: './languages.component.html',
        styleUrls: ['./languages.component.scss']
    })
], LanguagesComponent);
exports.LanguagesComponent = LanguagesComponent;
//# sourceMappingURL=languages.component.js.map