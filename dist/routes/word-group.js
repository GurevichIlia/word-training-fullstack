"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const word_group_1 = require("../controllers/word-group");
const express_1 = require("express");
class WordGroupRoutes {
    constructor() {
        this.wordGroupController = new word_group_1.WordGroupController();
        this.router = express_1.Router();
        this.routes();
    }
    routes() {
        this.router.get("/getAllGroups", passport_1.default.authenticate("jwt", { session: false }), this.wordGroupController.getAllWordGroups);
        this.router.post("/create", passport_1.default.authenticate("jwt", { session: false }), this.wordGroupController.saveGroup);
        this.router.post("/deleteGroup", passport_1.default.authenticate("jwt", { session: false }), this.wordGroupController.deleteWordGroup);
        this.router.post("/assign-group", passport_1.default.authenticate("jwt", { session: false }), this.wordGroupController.assignGroup);
        // this.router.patch(
        //       "/editWord/:languageId",
        //       passport.authenticate("jwt", { session: false }),
        //       this.wordGroupController.editWordById
        // );
        // this.router.delete(
        //       "/deleteWord/:wordId",
        //       passport.authenticate("jwt", { session: false }),
        //       this.wordGroupController.deleteWordById
        // );
    }
}
exports.WordGroupRoutes = WordGroupRoutes;
//# sourceMappingURL=word-group.js.map