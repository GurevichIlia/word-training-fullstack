import { UserModel, Language as LangModel } from '../interfaces';
import errorHandler from "../utils/errorHandler";
import { Response, Request } from "express";
import Language from "../Models/Language";
import Word from "../Models/Word";
import User from "../Models/User";

export class LanguagesController {
    public getAllLanguages = async (req: Request, res: Response) => {
        try {
            const user = req.user;
            // const languages = await Language.find({ user: user });
            const languages = await Language.find();

            res.status(200).json(languages);
        } catch (error) {
            errorHandler(res, error);
        }
    };

    public getUserLanguages = async (req: Request, res: Response) => {
        try {
            const gotUser = req.user;
            const user = await User.findOne({ _id: gotUser }) as UserModel;
            const languages = user.userLanguages;

            res.status(200).json(languages);
        } catch (error) {
            errorHandler(res, error);
        }
    };

    public createLanguage = async (req: Request, res: Response) => {
        try {
            // const user = req.user as { _id: string; email: string };

            const newLanguage = await new Language({
                name: req.body.name,
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
            // await Word.remove({ category: req.params.id });
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
            const user = await User.findOne({ _id: req.user }) as UserModel
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
            const updatedUser = await User.findOneAndUpdate({ _id: user._id }, { $set: user }, { new: true }) as UserModel

            res.status(200).json({
                currentLanguage: updatedUser.currentLanguage,
                message: 'Language selected'
            })
        } catch (error) {
            errorHandler(res, error);

        }
    }


    // addUserLanguages = async (req: Request, res: Response) => {
    //     try {
    //         const user: UserModel = req.user as UserModel;
    //         const userLanguages: LangModel[] = req.body.userLanguages as LangModel[];

    //         if (user.userLanguages) {
    //             user.userLanguages = [...user.userLanguages, ...userLanguages]
    //         } else {
    //             user.userLanguages = [...userLanguages]
    //         }
    //         console.log('User', user)



    //         const updatedUser = await User.findOneAndUpdate({ _id: user._id }, { $set: user }) as UserModel
    //         res.status(200).json({
    //             userLAnguages: updatedUser.userLanguages,
    //             message: 'Languages added'
    //         })
    //     } catch (error) {
    //         errorHandler(res, error);

    //     }
    // }

    public addUserLanguages = async (req: Request, res: Response) => {
        try {
            const user: UserModel = await User.findOne({ _id: req.user }) as UserModel;
            const selectedUserLanguages: LangModel[] = req.body.userLanguages as LangModel[];


            const promises = await selectedUserLanguages.map(async language => {

                const lang = await Language.findOne({ _id: language }) as LangModel
                return lang;
            })

            const userLanguages = await Promise.all(promises);


            if (user.userLanguages) {
                user.userLanguages = [...user.userLanguages, ...userLanguages]
                // user.userLanguages = userLanguages.map(language => user.userLanguages.splice(index))
            } else {
                user.userLanguages = userLanguages;
            }
            const updatedUser = await User.findOneAndUpdate({ _id: user._id }, { $set: user }, { new: true }) as UserModel

            res.status(200).json({
                userLanguages: updatedUser.userLanguages,
                message: 'Languages added'
            })
        } catch (error) {
            errorHandler(res, error);
        }
    };

    public deleteUserLanguage = async (req: Request, res: Response) => {
        try {
            const user: UserModel = await User.findOne({ _id: req.user }) as UserModel;

            user.userLanguages = user.userLanguages.filter(language => req.body.languageId != language._id)
            console.log('USER', user, user.userLanguages.length)

            if (user.userLanguages.length === 0) {
                user.currentLanguage = undefined
            }

            console.log('USER CURRENT LANG', user.currentLanguage)

            const updatedUser = await User.findOneAndUpdate({ _id: user._id }, { $set: user }) as UserModel

            console.log('USER CURRENT LANG AFTER UPDATE', updatedUser.currentLanguage)

            res.status(200).json({
                userLanguages: updatedUser.userLanguages,
                message: 'Language removed'
            })
        } catch (error) {
            errorHandler(res, error);
        }
    }
}
