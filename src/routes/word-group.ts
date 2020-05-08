import passport from "passport";
import { WordGroupController } from '../controllers/word-group'
import { Router } from "express";

export class WordGroupRoutes {
      router: Router;
      wordGroupController: WordGroupController = new WordGroupController();
      constructor() {
            this.router = Router();
            this.routes();
      }

      routes() {
            this.router.get(
                  "/getAll/:languageId",
                  passport.authenticate("jwt", { session: false }),
                  this.wordGroupController.getAllWordGroups
            );
        
            this.router.post(
                  "/create",
                  passport.authenticate("jwt", { session: false }),
                  this.wordGroupController.createNewWordGroup
            );

            this.router.post(
                  "/assign-group",
                  passport.authenticate("jwt", { session: false }),
                  this.wordGroupController.assignGroup
              );
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