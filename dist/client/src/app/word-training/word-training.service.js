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
let WordTrainingService = class WordTrainingService {
    constructor(vocabularyService) {
        this.vocabularyService = vocabularyService;
        this.trainWords = new rxjs_1.BehaviorSubject([]);
        this.currentTrainWords$ = this.trainWords.asObservable();
        this.trainingResult = new rxjs_1.BehaviorSubject([]);
        this.currentTrainingResult$ = this.trainingResult.asObservable();
    }
    getUserWords() {
        return this.vocabularyService.getCurrentWords$();
    }
    getRandomWords(words) {
        for (let i = words.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * words.length);
            const temp = words[i];
            words[i] = words[j];
            words[j] = temp;
        }
        return words;
    }
    addWordToResultWords(resultWords, word) {
        resultWords.push(word);
        console.log('RESULT WORDS', resultWords);
        return resultWords;
    }
    setTrainResult(words) {
        this.trainingResult.next(words);
    }
    getTrainResult() {
        return this.trainingResult.getValue();
    }
    getTrainResult$() {
        return this.currentTrainingResult$;
    }
    setTrainWords(words) {
        this.trainWords.next(words);
    }
    getTrainWords() {
        return this.trainWords.getValue();
    }
    getTrainWords$() {
        return this.currentTrainWords$;
    }
    setTrainMode() {
    }
};
WordTrainingService = __decorate([
    core_1.Injectable({
        providedIn: 'root'
    })
], WordTrainingService);
exports.WordTrainingService = WordTrainingService;
//# sourceMappingURL=word-training.service.js.map