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
            "/getAllWords",
            passport.authenticate("jwt", { session: false }),
            this.wordsController.getAllWords
        );

        this.router.post(
            "/createWord",
            passport.authenticate("jwt", { session: false }),
            this.wordsController.createNewWord
        );

        this.router.post(
            "/updateWords",
            passport.authenticate("jwt", { session: false }),
            this.wordsController.updateWords
        );

        this.router.patch(
            "/editWord",
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
