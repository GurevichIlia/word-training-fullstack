"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const router_1 = require("@angular/router");
const shared_module_1 = require("./../shared/shared.module");
const word_training_component_1 = require("./word-training.component");
const wordtrainingRoutes = [
    { path: '', component: word_training_component_1.WordTrainingComponent }
];
let WordTrainingModule = class WordTrainingModule {
};
WordTrainingModule = __decorate([
    core_1.NgModule({
        declarations: [word_training_component_1.WordTrainingComponent],
        imports: [
            common_1.CommonModule,
            shared_module_1.SharedModule,
            router_1.RouterModule.forChild(wordtrainingRoutes)
        ]
    })
], WordTrainingModule);
exports.WordTrainingModule = WordTrainingModule;
//# sourceMappingURL=word-training.module.js.map