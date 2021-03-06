import { Request, Response } from "express";
import { getLearningLanguage, getUserLanguages } from '../helper-functions/languages';
import { IRequestUserInfo, Language as LangModel, UserModel } from '../interfaces';
import Language from "../Models/Language";
import User from "../Models/User";
import UserLanguage from '../Models/UserLanguage';
import errorHandler from "../utils/errorHandler";

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
            // const user = await User.findOne({ _id: req.user }) as UserModel;
            // const languages = user.userLanguages;
            const user = req.user as IRequestUserInfo

            const userLanguages = await getUserLanguages(user)
            res.status(200).json(userLanguages);
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

            const user = req.user as IRequestUserInfo

            // const user = await User.findOne({ _id: req.user }) as UserModel

            // const currentLanguage = user.currentLanguage
            // const isLanguageInUserLanguages = user.userLanguages.find(userLanguage => userLanguage._id.toString() === currentLanguage?._id.toString())

            // if (isLanguageInUserLanguages) {
            //     const currentLang = currentLanguage;
            //     res.status(200).json({ currentLang });

            // } else if (!isLanguageInUserLanguages) {
            //     user.currentLanguage = null
            //     const updatedUser = await User.findOneAndUpdate({ _id: user._id }, { $set: user }, { new: true }) as UserModel
            //     const currentLang = updatedUser.currentLanguage
            //     res.status(200).json({ currentLang });
            // }
            const currentLang = await getLearningLanguage(user)

            res.status(200).json({ currentLang });

        } catch (error) {
            errorHandler(res, error)
        }
    }

    setCurrentLanguage = async (req: Request, res: Response) => {
        try {

            const user: UserModel = req.user as UserModel;
            // const currentLanguage = req.body.currentLanguage as string
            const languageCandidate = await Language.findOne({ _id: req.body.currentLanguage }) as LangModel;

            const updated = await User.findOneAndUpdate({ _id: user.id }, { currentLanguage: languageCandidate }, { new: true })

            // const languageCandidate = await Language.findOne({ _id: req.body.currentLanguage }) as LangModel;

            // const currentLanguage = await LearningLanguage.remove({ userId: user._id })
            // console.log('currentLanguage', currentLanguage)

            // await new LearningLanguage({
            //     userId: user._id,
            //     langId: languageCandidate._id,
            //     name: languageCandidate.name
            // }).save()



            // const currentLang = await getLearningLanguage(user)
            // console.log('currentLanguage 2', currentLang)

            // const user: UserModel = req.user as UserModel;
            // const currentLanguage = await Language.findOne({ _id: req.body.currentLanguage }) as LangModel;
            // console.log('CURRENT', currentLanguage)
            // user.currentLanguage = currentLanguage
            // const updatedUser = await User.findOneAndUpdate({ _id: user._id }, { $set: user }, { new: true }) as UserModel
            res.status(200).json({
                currentLanguage: updated?.currentLanguage,
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
            const user = req.user as IRequestUserInfo

            const selectedUserLanguages: LangModel[] = req.body.userLanguages as LangModel[];

            const lang = selectedUserLanguages[0]
            const newUserLanguage = await new UserLanguage({
                langId: lang._id,
                name: lang.name,
                userId: user._id
            })

            const isExist = await UserLanguage.exists({ userId: user._id, name: newUserLanguage.name, langId: newUserLanguage.langId })
            if (!isExist) {
                await newUserLanguage.save()
            }

            const allLanguages = await Language.find();
            const userLanguages = await getUserLanguages(user)



            // const user: UserModel = await User.findOne({ _id: req.user }) as UserModel;
            // const selectedUserLanguages: LangModel[] = req.body.userLanguages as LangModel[];


            // const promises = await selectedUserLanguages.map(async language => {

            //     const lang = await Language.findOne({ _id: language }) as LangModel
            //     return lang;
            // })

            // const userLanguages = await Promise.all(promises);


            // if (user.userLanguages) {
            //     user.userLanguages = [...user.userLanguages, ...userLanguages]
            //     // user.userLanguages = userLanguages.map(language => user.userLanguages.splice(index))
            // } else {
            //     user.userLanguages = userLanguages;
            // }
            // const updatedUser = await User.findOneAndUpdate({ _id: user._id }, { $set: user }, { new: true }) as UserModel
            // const allLanguages = await Language.find();

            res.status(200).json({
                allLanguages,
                userLanguages,
                message: 'Languages added'
            })
        } catch (error) {
            errorHandler(res, error);
        }
    };

    public deleteUserLanguage = async (req: Request, res: Response) => {
        try {
            // const user: UserModel = await User.findOne({ _id: req.user }) as UserModel;
            const user = req.user as IRequestUserInfo

            const languageIdToDelete = req.body.languageId as string

            if (user.currentLanguage?._id.toString() === languageIdToDelete) {
                user.currentLanguage = null
                await User.findOneAndUpdate({ _id: user._id }, { $set: user })
            }

            const langs = await UserLanguage.findOneAndRemove({ userId: user._id, langId: languageIdToDelete })

            // console.log('LANGUAGE DLETE', langs, typeof languageIdToDelete)
            const allLanguages = await Language.find();
            const userLanguages = await getUserLanguages(user)


            // const currentLearningLanguage = userLanguages.find(userLang => userLang._id === user.currentLanguage?._id) || null
            // user.userLanguages = user.userLanguages.filter(language => languageIdToDelete.toString() != language._id.toString())
            // console.log('USER', user.currentLanguage)

            // console.log('USER LANG', user.currentLanguage?._id,)
            // console.log('DELETE LANG', languageIdToDelete)

            // if (user.currentLanguage?._id.toString() === languageIdToDelete.toString()) {
            //     user.currentLanguage = null
            // }
            // console.log('AFTER DELETE', user.currentLanguage)

            // if (user.userLanguages.length === 0) {
            //     user.currentLanguage = null
            // }
            // const foundLangauge = user.userLanguages.find(lang => user.currentLanguage?._id.toString() === lang._id.toString())
            // if (!foundLangauge) {
            //     user.currentLanguage = null
            // }

            // console.log('USER CURRENT LANG', user.currentLanguage)

            // const updatedUser = await User.findOneAndUpdate({ _id: user._id }, { $set: user }, { new: true }) as UserModel

            // console.log('USER CURRENT LANG AFTER UPDATE', updatedUser.currentLanguage)
            // const allLanguages = await Language.find();
            // const lang = await LearningLanguage.findOne({ user: user._id })

            res.status(200).json({
                currentLearningLanguage: user.currentLanguage,
                userLanguages,
                allLanguages,
                message: 'Language removed'
            })
        } catch (error) {
            errorHandler(res, error);
        }
    }
}
