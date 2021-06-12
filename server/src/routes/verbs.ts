import { Router } from 'express';
import multer from 'multer';
import passport from 'passport';
import { VerbsController } from '../controllers/verbs';
import { FileHandler } from '../utils/file-handler';

export class VerbsRoutes {
      router: Router;
      verbsController = new VerbsController()
      fileHandler = new FileHandler()
      constructor() {
            this.router = Router();
            this.routes();
      }

      routes() {
            this.router.get(
                  "/getVerbs",
                  passport.authenticate("jwt", { session: false }),
                  this.verbsController.getVerbs
            );
            this.router.post(
                  "/addVerbsFromCSV",
                  passport.authenticate("jwt", { session: false }),
                  multer({ dest: this.fileHandler.pathToSave() }).single("csvFile"), function (req, res, next) {
                        req.file;
                        next()
                  },
                  this.verbsController.addVerbsFromCSV
            );
            this.router.post(
                  "/getConjugationForVerbs",
                  passport.authenticate("jwt", { session: false }),
                  this.verbsController.getConjugationForVerbs
            );
            this.router.post(
                  "/saveVerbs",
                  passport.authenticate("jwt", { session: false }),
                  this.verbsController.saveVerbs
            );
            this.router.post(
                  "/getConjugationForVerbFromCSV",
                  multer({ dest: this.fileHandler.pathToSave() }).single("csvFile"), function (req, res, next) {
                        req.file;
                        next()
                  },
                  this.verbsController.getConjugationForVerbFromCSV
            );
      }

}