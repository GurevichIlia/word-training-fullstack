"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
const words_train_guard_1 = require("./words-train.guard");
describe('WordsTrainGuard', () => {
    beforeEach(() => {
        testing_1.TestBed.configureTestingModule({
            providers: [words_train_guard_1.WordsTrainGuard]
        });
    });
    it('should ...', testing_1.inject([words_train_guard_1.WordsTrainGuard], (guard) => {
        expect(guard).toBeTruthy();
    }));
});
//# sourceMappingURL=words-train.guard.spec.js.map