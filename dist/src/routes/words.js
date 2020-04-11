"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const words_1 = require("./../controllers/words");
const express_1 = require("express");
class WordsRoutes {
    constructor() {
        this.wordsController = new words_1.WordsController();
        this.router = express_1.Router();
        this.routes();
    }
    routes() {
        this.router.get("/:languageId", passport_1.default.authenticate("jwt", { session: false }), this.wordsController.getAllWords);
        // this.router.get(
        //     "/getWordById",
        //     passport.authenticate("jwt", { session: false }),
        //     this.wordsController.editWordById
        // );uuu
        this.router.post("/:languageId", passport_1.default.authenticate("jwt", { session: false }), this.wordsController.createNewWord);
        this.router.patch("/editWord/:languageId", passport_1.default.authenticate("jwt", { session: false }), this.wordsController.editWordById);
        this.router.delete("/deleteWord/:wordId", passport_1.default.authenticate("jwt", { session: false }), this.wordsController.deleteWordById);
    }
}
exports.WordsRoutes = WordsRoutes;
//# sourceMappingURL=words.js.map