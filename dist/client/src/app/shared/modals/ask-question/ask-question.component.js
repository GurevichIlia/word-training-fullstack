"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
let AskQuestionComponent = class AskQuestionComponent {
    constructor(dialogRef) {
        this.dialogRef = dialogRef;
    }
    close(answer) {
        this.dialogRef.close(answer);
    }
};
__decorate([
    core_1.Input()
], AskQuestionComponent.prototype, "title", void 0);
AskQuestionComponent = __decorate([
    core_1.Component({
        selector: 'app-ask-question',
        templateUrl: './ask-question.component.html',
        styleUrls: ['./ask-question.component.scss']
    })
], AskQuestionComponent);
exports.AskQuestionComponent = AskQuestionComponent;
//# sourceMappingURL=ask-question.component.js.map