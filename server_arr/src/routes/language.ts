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
            "/getAllLanguages",
            passport.authenticate("jwt", { session: false }),
            this.languagesController.getAllLanguages
        );

        this.router.get(
            "/getUserLanguages",
            passport.authenticate("jwt", { session: false }),
            this.languagesController.getUserLanguages
        );

        this.router.get(
            "/getCurrentLanguage",
            passport.authenticate("jwt", { session: false }),
            this.languagesController.getCurrentLanguage
        );

        this.router.post(
            "/createLanguage",
            passport.authenticate("jwt", { session: false }),
            this.languagesController.createLanguage
        );

        this.router.patch(
            "/editLanguage",
            passport.authenticate("jwt", { session: false }),
            this.languagesController.editLanguage
        );

        this.router.delete(
            "/deleteLanguage/:id",
            passport.authenticate("jwt", { session: false }),
            this.languagesController.deleteLanguage
        );

        this.router.post(
            "/setCurrentLanguage",
            passport.authenticate("jwt", { session: false }),
            this.languagesController.setCurrentLanguage
        );

        this.router.post(
            "/addUserLanguages",
            passport.authenticate("jwt", { session: false }),
            this.languagesController.addUserLanguages
        );

        this.router.post(
            "/deleteUserLanguage",
            passport.authenticate("jwt", { session: false }),
            this.languagesController.deleteUserLanguage
        );
    }
}
