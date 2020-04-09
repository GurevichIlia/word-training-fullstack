import { UserModel, Language as LangModel } from './../interfaces';
import errorHandler from "../utils/errorHandler";
import { Response, Request } from "express";
import Language from "../Models/Language";
import Word from "../Models/Word";
import User from "../Models/User";

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


    getCurrentLanguage = async (req: Request, res: Response) => {
        try {
            const user = await User.findOne({ _id: req.user}) as UserModel
            const currentLang = user.currentLanguage;
            res.status(200).json({ currentLang });
        } catch (error) {
            errorHandler(res, error)
        }
    }

    setCurrentLanguage = async (req: Request, res: Response) => {
        try {
            const user: UserModel = req.user as UserModel;
            const currentLanguage = await Language.findOne({ _id: req.body.currentLanguage }) as LangModel;

            user.currentLanguage = currentLanguage
            const updatedUser = await User.findOneAndUpdate({ _id: user._id }, { $set: user }) as UserModel
            res.status(200).json({
                currentLanguage: updatedUser.currentLanguage,
                message: 'Language selected'
            })
        } catch (error) {
            errorHandler(res, error);

        }
    }
}
