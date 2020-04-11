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
const core_1 = require("@angular/core");
const rxjs_1 = require("rxjs");
const animations_1 = require("@angular/animations");
const kf = __importStar(require("../shared/keyframes"));
const operators_1 = require("rxjs/operators");
let WordTrainingComponent = class WordTrainingComponent {
    constructor(wordTrainingService, vocabularyService, fb, router, notification) {
        this.wordTrainingService = wordTrainingService;
        this.vocabularyService = vocabularyService;
        this.fb = fb;
        this.router = router;
        this.notification = notification;
        this.unsubscribe$ = new rxjs_1.Subject();
        this.userWords = [];
        this.userRandomWords = [];
        this.wordsFiltredByMode = [];
        this.start = false;
        this.loadingSpinner = true;
        this.knownWords = 0;
        this.notknownWords = 0;
        this.wordIndex = 0;
        this.favoritesWordsQuantity = 0;
        this.wordsForResult = [];
        this.unknownMode = false;
        this.favoriteMode = this.fb.control('all');
    }
    ngOnInit() {
        this.getUserWords();
        this.favoriteMode.valueChanges.pipe(operators_1.takeUntil(this.unsubscribe$)).subscribe((value) => {
            this.restartGame();
            if (value === 'all') {
                this.onClassicMode();
            }
            else if (value === 'favorites') {
                this.onFavoriteMode();
            }
        });
        this.getTrainWords();
    }
    onStart() {
        this.startAnimation('bounceInDown');
        this.start = true;
        this.getRandomWords(this.wordsFiltredByMode);
    }
    onFavorite() {
        // this.user
    }
    /** Create list of random words from words of user */
    getRandomWords(arrayOfWords) {
        this.userRandomWords = this.wordTrainingService.getRandomWords(arrayOfWords);
    }
    nextWord() {
        if (this.wordIndex === this.userRandomWords.length - 1) {
            this.getRandomWords(this.userRandomWords);
            this.wordIndex = 0;
        }
        else {
            this.wordIndex++;
        }
    }
    prevWord() {
        this.startAnimation('bounceInLeft');
        console.log('works');
        if (this.wordIndex === 0) {
            this.wordIndex = this.userRandomWords.length - 1;
        }
        else {
            this.wordIndex--;
        }
    }
    getUserWords() {
        // if (localStorage.getItem('userData')) {
        //   // this.userWords = this.getWordFromLocalStorage();
        //   console.log('WORD TRAIN WORDS LOCAL STR', this.userWords);
        //   this.loadingSpinner = false;
        //   this.onClassicMode();
        // } else {
        this.wordTrainingService.getUserWords()
            .pipe(
        // tap(words => words.length === 0 ? this.router.navigate(['vocabulary']) : null),
        operators_1.takeUntil(this.unsubscribe$))
            .subscribe((words) => {
            if (words !== null) {
                this.userWords = words;
                // if (this.userWords.length === 0) {
                //   this.router.navigate(['vocabulary']);
                //   return;
                // }
                this.favoritesWordsQuantity = 0;
                this.userWords.map(word => word.isFavorite === true ? this.favoritesWordsQuantity++ : word);
                console.log('WORD TRAIN WORDS', this.userWords);
                console.log('SUBSCRIBE', this.wordTrainingService.getUserWords());
                if (this.start === false) {
                    this.onClassicMode();
                }
            }
            else {
                console.log('Update data');
            }
            this.loadingSpinner = false;
        });
        // }
    }
    // getWordFromLocalStorage() {
    //   return JSON.parse(localStorage.getItem('userData')).words;
    // }
    onFavoriteMode() {
        this.startAnimation('bounceInDown');
        this.wordsFiltredByMode = this.userWords.filter((word) => word.isFavorite === true);
        this.getRandomWords(this.wordsFiltredByMode);
        this.wordIndex = 0;
        this.unknownMode = false;
    }
    onClassicMode() {
        this.startAnimation('bounceInDown');
        this.wordsFiltredByMode = this.userWords.filter((word) => word);
        this.getRandomWords(this.wordsFiltredByMode);
        this.wordIndex = 0;
        this.unknownMode = false;
    }
    unknownWordMode(words) {
        this.start = true;
        this.unknownMode = true;
        this.startAnimation('bounceInDown');
        this.wordsFiltredByMode = words;
        this.getRandomWords(this.wordsFiltredByMode);
        this.wordIndex = 0;
        this.favoriteMode.patchValue('unknown');
    }
    dontKnow(word) {
        this.startAnimation('bounceOutUp');
        // this.startAnimation('bounceInRight');
        const notKnownWord = Object.assign({}, word);
        notKnownWord.knowen = false;
        this.wordTrainingService.addWordToResultWords(this.wordsForResult, notKnownWord);
        setTimeout(() => {
            this.addToFavorites(word);
            this.nextWord();
            this.notknownWords++;
        }, 300);
    }
    onKnow(word) {
        const knownWord = Object.assign({}, word);
        knownWord.knowen = true;
        this.wordTrainingService.addWordToResultWords(this.wordsForResult, knownWord);
        this.startAnimation('bounceInRight');
        console.log('know');
        this.nextWord();
        this.knownWords++;
    }
    restartGame() {
        this.notknownWords = 0;
        this.knownWords = 0;
        this.clearWordsForResult();
    }
    setFavorite(word) {
        this.vocabularyService.editWord(word)
            .pipe(operators_1.takeUntil(this.unsubscribe$))
            .subscribe(res => {
            console.log(res);
        }, err => this.notification.error('', err.error.message));
    }
    addToFavorites(word) {
        console.log('add to fav');
        if (word.isFavorite === false) {
            word.isFavorite = true;
            this.setFavorite(word);
        }
    }
    removeFromFavorites(word) {
        console.log('remove to fav');
        if (word.isFavorite === true) {
            word.isFavorite = false;
            this.setFavorite(word);
            this.vocabularyService.editWord(word);
        }
    }
    startAnimation(stateAnimate) {
        console.log(stateAnimate);
        if (!this.animationState) {
            this.animationState = stateAnimate;
        }
    }
    resetAnimationState() {
        this.animationState = '';
    }
    goToTrainResult() {
        this.wordTrainingService.setTrainResult(this.wordsForResult);
        this.router.navigate(['train-result']);
    }
    getTrainWords() {
        this.wordTrainingService.getTrainWords$()
            .pipe(operators_1.takeUntil(this.unsubscribe$))
            .subscribe((data) => {
            if (data.length !== 0) {
                this.unknownWordMode(data);
            }
        });
    }
    clearWordsForResult() {
        this.wordsForResult = [];
    }
    setDefaultMode() {
        this.favoriteMode.patchValue('all');
    }
    ngOnDestroy() {
        // Called once, before the instance is destroyed.
        // Add 'implements OnDestroy' to the class.
        console.log(this.favoriteMode.value);
        this.unknownMode = false;
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
};
__decorate([
    core_1.ViewChild('flipCard', { read: true, static: true })
], WordTrainingComponent.prototype, "flipCard", void 0);
WordTrainingComponent = __decorate([
    core_1.Component({
        selector: 'app-word-training',
        templateUrl: './word-training.component.html',
        styleUrls: ['./word-training.component.scss'],
        animations: [
            animations_1.trigger('wordCardAnimator', [
                animations_1.transition('* => bounceInRight', animations_1.animate(500, animations_1.keyframes(kf.bounceInRight))),
                animations_1.transition('* => bounceOutUp', animations_1.animate(500, animations_1.keyframes(kf.bounceOutUp))),
                animations_1.transition('* => bounceInDown', animations_1.animate(500, animations_1.keyframes(kf.bounceInDown))),
                animations_1.transition('* => bounceInLeft', animations_1.animate(500, animations_1.keyframes(kf.bounceInLeft)))
            ])
        ]
    })
], WordTrainingComponent);
exports.WordTrainingComponent = WordTrainingComponent;
//# sourceMappingURL=word-training.component.js.map