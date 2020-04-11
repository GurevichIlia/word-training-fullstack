"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
const select_language_guard_guard_1 = require("./select-language-guard.guard");
describe('SelectLanguageGuardGuard', () => {
    beforeEach(() => {
        testing_1.TestBed.configureTestingModule({
            providers: [select_language_guard_guard_1.SelectLanguageGuardGuard]
        });
    });
    it('should ...', testing_1.inject([select_language_guard_guard_1.SelectLanguageGuardGuard], (guard) => {
        expect(guard).toBeTruthy();
    }));
});
//# sourceMappingURL=select-language-guard.guard.spec.js.map