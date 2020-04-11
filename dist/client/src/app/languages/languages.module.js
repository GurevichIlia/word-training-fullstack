"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("@angular/router");
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const new_language_component_1 = require("./new-language/new-language.component");
const languages_component_1 = require("./languages.component");
const select_language_component_1 = require("./select-language/select-language.component");
const languages_service_1 = require("./languages.service");
const shared_module_1 = require("./../shared/shared.module");
const edit_language_component_1 = require("./edit-language/edit-language.component");
const languageRoutes = [
    { path: '', component: languages_component_1.LanguagesComponent }
];
let LanguagesModule = class LanguagesModule {
};
LanguagesModule = __decorate([
    core_1.NgModule({
        declarations: [
            new_language_component_1.NewLanguageComponent,
            languages_component_1.LanguagesComponent,
            select_language_component_1.SelectLanguageComponent,
            edit_language_component_1.EditLanguageComponent
        ],
        imports: [
            common_1.CommonModule,
            shared_module_1.SharedModule,
            router_1.RouterModule.forChild(languageRoutes)
        ],
        providers: [languages_service_1.LanguagesService]
    })
], LanguagesModule);
exports.LanguagesModule = LanguagesModule;
//# sourceMappingURL=languages.module.js.map