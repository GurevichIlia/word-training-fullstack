"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const express_1 = require("express");
const language_1 = require("../controllers/language");
class LanguagesRoutes {
    constructor() {
        this.languagesController = new language_1.LanguagesController();
        this.router = express_1.Router();
        this.routes();
    }
    routes() {
        this.router.get("/getAllLanguages", passport_1.default.authenticate("jwt", { session: false }), this.languagesController.getAllLanguages);
        this.router.get("/getCurrentLanguage", passport_1.default.authenticate("jwt", { session: false }), this.languagesController.getCurrentLanguage);
        this.router.post("/createLanguage", passport_1.default.authenticate("jwt", { session: false }), this.languagesController.createLanguage);
        this.router.patch("/editLanguage", passport_1.default.authenticate("jwt", { session: false }), this.languagesController.editLanguage);
        this.router.delete("/deleteLanguage/:id", passport_1.default.authenticate("jwt", { session: false }), this.languagesController.deleteLanguage);
        this.router.post("/setCurrentLanguage", passport_1.default.authenticate("jwt", { session: false }), this.languagesController.setCurrentLanguage);
    }
}
exports.LanguagesRoutes = LanguagesRoutes;
//# sourceMappingURL=language.js.map