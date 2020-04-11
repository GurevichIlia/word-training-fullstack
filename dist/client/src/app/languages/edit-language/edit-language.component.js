"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
let EditLanguageComponent = class EditLanguageComponent {
    constructor() {
        this.editLanguage = new core_1.EventEmitter();
        this.changeMode = new core_1.EventEmitter();
    }
    ngOnInit() {
    }
    onEdit() {
        this.editLanguage.emit(this.language);
    }
    onCancel() {
        this.changeMode.emit();
    }
};
__decorate([
    core_1.Input()
], EditLanguageComponent.prototype, "language", void 0);
__decorate([
    core_1.Output()
], EditLanguageComponent.prototype, "editLanguage", void 0);
__decorate([
    core_1.Output()
], EditLanguageComponent.prototype, "changeMode", void 0);
EditLanguageComponent = __decorate([
    core_1.Component({
        selector: 'app-edit-language',
        templateUrl: './edit-language.component.html',
        styleUrls: ['./edit-language.component.scss']
    })
], EditLanguageComponent);
exports.EditLanguageComponent = EditLanguageComponent;
//# sourceMappingURL=edit-language.component.js.map