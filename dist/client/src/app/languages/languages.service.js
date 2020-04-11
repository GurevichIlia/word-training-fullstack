"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_config_1 = require("../app.config");
const core_1 = require("@angular/core");
let LanguagesService = class LanguagesService {
    constructor(http) {
        this.http = http;
    }
    getAllLanguages() {
        return this.http.get(`${app_config_1.baseUrl}languages/getAllLanguages`);
    }
    addLanguage(language) {
        return this.http.post(`${app_config_1.baseUrl}languages/createLanguage`, language);
    }
    editLanguage(language) {
        return this.http.patch(`${app_config_1.baseUrl}languages/editLanguage`, language);
    }
    deleteLanguage(languageId) {
        return this.http.delete(`${app_config_1.baseUrl}languages/deleteLanguage/${languageId}`);
    }
    setCurrentLanguageOnServer(languageId) {
        return this.http.post(`${app_config_1.baseUrl}languages/setCurrentLanguage`, { currentLanguage: languageId });
    }
};
LanguagesService = __decorate([
    core_1.Injectable()
], LanguagesService);
exports.LanguagesService = LanguagesService;
//# sourceMappingURL=languages.service.js.map