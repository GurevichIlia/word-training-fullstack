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
let WordsTrainGuard = class WordsTrainGuard {
    constructor(wordTrainingService, router, notifications) {
        this.wordTrainingService = wordTrainingService;
        this.router = router;
        this.notifications = notifications;
    }
    canActivate() {
        let canActive = false;
        return this.wordTrainingService.getUserWords().pipe(operators_1.take(1), operators_1.map(words => {
            console.log('GUARD TRAIN', words);
            if (words.length >= 5) {
                canActive = true;
            }
            else {
                canActive = false;
                this.notifications.info('', 'Please add minimum 5 words');
                this.router.navigate(['vocabulary']);
            }
            return canActive;
        }));
    }
};
WordsTrainGuard = __decorate([
    core_1.Injectable({
        providedIn: 'root'
    })
], WordsTrainGuard);
exports.WordsTrainGuard = WordsTrainGuard;
//# sourceMappingURL=words-train.guard.js.map