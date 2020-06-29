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
            this.wordsController.getAllWordsForCurrentUser
        );

        this.router.post(
            "/createWord",
            passport.authenticate("jwt", { session: false }),
            this.wordsController.createNewWordForUser
        );

        this.router.post(
            "/addWords",
            passport.authenticate("jwt", { session: false }),
            this.wordsController.addNewWords
        );

        this.router.post(
            "/updateWords",
            passport.authenticate("jwt", { session: false }),
            this.wordsController.updateUserWords
        );

        this.router.patch(
            "/editWord",
            passport.authenticate("jwt", { session: false }),
            this.wordsController.editWordByIdForCurrentUser
        );


        this.router.delete(
            "/deleteWord/:wordId",
            passport.authenticate("jwt", { session: false }),
            this.wordsController.deleteWordByIdForCurrentUser
        );

        this.router.post(
            "/addWordsToGeneralList",
            passport.authenticate("jwt", { session: false }),
            this.wordsController.addWordsToGeneralList
        );

        this.router.get(
            "/getGeneralWords",
            passport.authenticate("jwt", { session: false }),
            this.wordsController.getGeneralWords
        );

        this.router.delete(
            "/deleteWordFromGeneralList",
            passport.authenticate("jwt", { session: false }),
            this.wordsController.deleteWordFromGeneralList
        );

        // this.router.post(
        //     "/addWordToMyWords",
        //     passport.authenticate("jwt", { session: false }),
        //     this.wordsController.add
        // );


    }
}
