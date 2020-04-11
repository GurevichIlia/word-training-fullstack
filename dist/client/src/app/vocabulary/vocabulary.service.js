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
const app_config_1 = require("../app.config");
let VocabularyService = class VocabularyService {
    constructor(http, generalService) {
        this.http = http;
        this.generalService = generalService;
        this.words = new rxjs_1.BehaviorSubject([]);
        this.words$ = this.words.asObservable();
        ;
    }
    getWordsFromServer(langId) {
        return this.http.get(`${app_config_1.baseUrl}vocabulary/${langId}`);
    }
    addWord(word) {
        const lang = this.generalService.currentLearningLanguage.getValue();
        return this.http.post(`${app_config_1.baseUrl}vocabulary/${lang._id}`, word);
    }
    editWord(word) {
        const lang = this.generalService.currentLearningLanguage.getValue();
        return this.http.patch(`${app_config_1.baseUrl}vocabulary/editWord/${lang._id}`, word);
    }
    deleteWordFromServer(wordId) {
        const lang = this.generalService.currentLearningLanguage.getValue();
        return this.http.delete(`${app_config_1.baseUrl}vocabulary/deleteWord/${wordId}`);
    }
    setWords(words) {
        this.words.next(words);
    }
    getCurrentWords$() {
        return this.words$;
    }
    setFavorite(word) {
        if (word) {
            word.isFavorite = !word.isFavorite;
        }
    }
    findWordIndex(words, word) {
        return words.findIndex(existingWord => existingWord._id === word._id);
    }
    deleteWord(word) {
        const index = this.findWordIndex(this.words.value, word);
        this.words.getValue().splice(index, 1);
    }
    onEdit(editedWord) {
        const index = this.findWordIndex(this.words.value, editedWord);
        this.words.getValue().splice(index, 1, editedWord);
    }
};
VocabularyService = __decorate([
    core_1.Injectable({
        providedIn: 'root'
    })
], VocabularyService);
exports.VocabularyService = VocabularyService;
//# sourceMappingURL=vocabulary.service.js.map