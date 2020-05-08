import passport from "passport";
import { WordsController } from "../controllers/words";
import { Router } from "express";

export class WordsRoutes {
    router: Router;
    wordsController: WordsController = new WordsController();
    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.get(
            "/:languageId",
            passport.authenticate("jwt", { session: false }),
            this.wordsController.getAllWords
        );
        // this.router.get(
        //     "/getWordById",
        //     passport.authenticate("jwt", { session: false }),
        //     this.wordsController.editWordById
        // );uuu
        this.router.post(
            "/:languageId",
            passport.authenticate("jwt", { session: false }),
            this.wordsController.createNewWord
        );

        this.router.patch(
            "/editWord/:languageId",
            passport.authenticate("jwt", { session: false }),
            this.wordsController.editWordById
        );

        this.router.delete(
            "/deleteWord/:wordId",
            passport.authenticate("jwt", { session: false }),
            this.wordsController.deleteWordById
        );

 
    }
}
