import { FileHandler } from './../utils/file-handler';
import passport from "passport";
import { WordsController } from "../controllers/words";
import { Router } from "express";
import multer from 'multer'
export class WordsRoutes {
    router: Router;
    wordsController: WordsController = new WordsController();
    fileHandler = new FileHandler()
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

        this.router.get(
            "/addMyWords",
            passport.authenticate("jwt", { session: false }),
            this.wordsController.addMyWords
        );

        this.router.post(
            "/addWordsFromCSV",
            passport.authenticate("jwt", { session: false }),
            multer({ dest: this.fileHandler.pathToSave() }).single("csvFile"), function (req, res, next) {
                req.file;
                next()
            },
            this.wordsController.addWordsFromCSV
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
