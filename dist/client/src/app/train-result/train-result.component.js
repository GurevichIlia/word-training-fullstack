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
let TrainResultComponent = class TrainResultComponent {
    constructor(trainingService, router) {
        this.trainingService = trainingService;
        this.router = router;
        this.knownWordsQuantity = 0;
        this.unknownWordsQuantity = 0;
    }
    ngOnInit() {
        this.getWordsForResult();
        this.setTrainedWords([...this.trainingService.getTrainResult()]);
    }
    getWordsForResult() {
        this.wordsForResult$ = this.trainingService.getTrainResult$().pipe(operators_1.map(words => {
            this.knownWordsQuantity = 0;
            this.unknownWordsQuantity = 0;
            words.map(word => {
                word.knowen === true ? this.knownWordsQuantity++ : '',
                    word.knowen === false ? this.unknownWordsQuantity++ : '';
            });
            console.log('Trained Owrds', this.trainedWords);
            return words;
        }));
    }
    setTrainedWords(words) {
        this.trainedWords = words;
        this.setUnknownWords(words);
    }
    setUnknownWords(words) {
        this.unknownWords = words.filter(data => data.knowen === false);
        console.log(this.unknownWords);
        console.log(this.trainedWords);
        console.log('IMUT WORDS', this.trainingService.getTrainResult());
    }
    getUnknownWords() {
        return this.unknownWords;
    }
    trainUnknownWords() {
        this.trainingService.setTrainWords(this.getUnknownWords());
        this.router.navigate(['word-training']);
    }
    trainAgain() {
        this.router.navigate(['word-training']);
    }
    goToVocabulary() {
        this.router.navigate(['vocabulary']);
    }
};
TrainResultComponent = __decorate([
    core_1.Component({
        selector: 'app-train-result',
        templateUrl: './train-result.component.html',
        styleUrls: ['./train-result.component.scss']
    })
], TrainResultComponent);
exports.TrainResultComponent = TrainResultComponent;
//# sourceMappingURL=train-result.component.js.map