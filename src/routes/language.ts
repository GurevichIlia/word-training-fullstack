import passport from "passport";
import { Router } from "express";
import { LanguagesController } from "../controllers/language";

export class LanguagesRoutes {
    router: Router;
    languagesController: LanguagesController = new LanguagesController();
    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.get(
            "/",
            passport.authenticate("jwt", { session: false }),
            this.languagesController.getAllLanguages
        );
      //   this.router.get(
      //       "/getWordById",
      //       passport.authenticate("jwt", { session: false }),
      //       this.languagesController.
      //   );
        this.router.post(
            "/",
            passport.authenticate("jwt", { session: false }),
            this.languagesController.createLanguage
        );
        this.router.patch(
            "/",
            passport.authenticate("jwt", { session: false }),
            this.languagesController.editLanguage
        );
        this.router.delete(
            "/:id",
            passport.authenticate("jwt", { session: false }),
            this.languagesController.deleteLanguage
        );
    }
}
