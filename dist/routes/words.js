"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const words_1 = require("../controllers/words");
const express_1 = require("express");
class WordsRoutes {
    constructor() {
        this.wordsController = new words_1.WordsController();
        this.router = express_1.Router();
        this.routes();
    }
    routes() {
        this.router.get("/getAllWords", passport_1.default.authenticate("jwt", { session: false }), this.wordsController.getAllWordsForCurrentUser);
        this.router.post("/createWord", passport_1.default.authenticate("jwt", { session: false }), this.wordsController.createNewWordForUser);
        this.router.post("/addWords", passport_1.default.authenticate("jwt", { session: false }), this.wordsController.addNewWords);
        this.router.post("/updateWords", passport_1.default.authenticate("jwt", { session: false }), this.wordsController.updateUserWords);
        this.router.patch("/editWord", passport_1.default.authenticate("jwt", { session: false }), this.wordsController.editWordByIdForCurrentUser);
        this.router.delete("/deleteWord/:wordId", passport_1.default.authenticate("jwt", { session: false }), this.wordsController.deleteWordByIdForCurrentUser);
        this.router.post("/addWordsToGeneralList", passport_1.default.authenticate("jwt", { session: false }), this.wordsController.addWordsToGeneralList);
        this.router.get("/getGeneralWords", passport_1.default.authenticate("jwt", { session: false }), this.wordsController.getGeneralWords);
        this.router.delete("/deleteWordFromGeneralList", passport_1.default.authenticate("jwt", { session: false }), this.wordsController.deleteWordFromGeneralList);
        // this.router.post(
        //     "/addWordToMyWords",
        //     passport.authenticate("jwt", { session: false }),
        //     this.wordsController.add
        // );
    }
}
exports.WordsRoutes = WordsRoutes;
//# sourceMappingURL=words.js.map