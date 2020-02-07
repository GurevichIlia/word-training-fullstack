import errorHandler from "../utils/errorHandler";
import { Response, Request } from "express";
import Language from "../Models/Language";
import Word from "../Models/Word";

export class LanguagesController {
    public getAllLanguages = async (req: Request, res: Response) => {
        try {
            const user = req.user;
            const languages = await Language.find({ user: user });
            res.status(200).json(languages);
        } catch (error) {
            errorHandler(res, error);
        }
    };

    public createLanguage = async (req: Request, res: Response) => {
        try {
            const user = req.user as { _id: string; email: string };
            console.log("USER", user);

            const newLanguage = await new Language({
                name: req.body.name,
                user: user
            });
            await newLanguage.save();
            res.status(201).json(newLanguage);
        } catch (error) {
            errorHandler(res, error);
        }
    };

    public deleteLanguage = async (req: Request, res: Response) => {
        try {
            await Language.remove({ _id: req.params.id });
            await Word.remove({ category: req.params.id });
            res.status(200).json({
                message: "Language removed"
            });
        } catch (error) {
            errorHandler(res, error);
        }
    };

    public editLanguage = async (req: Request, res: Response) => {
        try {
            const editedLanguage = await Language.findOneAndUpdate(
                { _id: req.body._id },
                { $set: req.body },
                { new: true }
            )
            res.status(200).json(editedLanguage)
        } catch (error) {
            errorHandler(res, error);
        }
    };
}
