"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const languages_1 = require("../helper-functions/languages");
const Language_1 = __importDefault(require("../Models/Language"));
const User_1 = __importDefault(require("../Models/User"));
const UserLanguage_1 = __importDefault(require("../Models/UserLanguage"));
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
class LanguagesController {
    constructor() {
        this.getAllLanguages = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                // const languages = await Language.find({ user: user });
                const languages = yield Language_1.default.find();
                res.status(200).json(languages);
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
        this.getUserLanguages = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // const user = await User.findOne({ _id: req.user }) as UserModel;
                // const languages = user.userLanguages;
                const user = req.user;
                const userLanguages = yield languages_1.getUserLanguages(user);
                res.status(200).json(userLanguages);
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
        this.createLanguage = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // const user = req.user as { _id: string; email: string };
                const newLanguage = yield new Language_1.default({
                    name: req.body.name,
                });
                yield newLanguage.save();
                res.status(201).json(newLanguage);
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
        this.deleteLanguage = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield Language_1.default.remove({ _id: req.params.id });
                // await Word.remove({ category: req.params.id });
                res.status(200).json({
                    message: "Language removed"
                });
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
        this.editLanguage = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const editedLanguage = yield Language_1.default.findOneAndUpdate({ _id: req.body._id }, { $set: req.body }, { new: true });
                res.status(200).json(editedLanguage);
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
        this.getCurrentLanguage = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
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
                const currentLang = yield languages_1.getLearningLanguage(user);
                res.status(200).json({ currentLang });
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
        this.setCurrentLanguage = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const user = req.user;
                // const currentLanguage = req.body.currentLanguage as string
                const languageCandidate = yield Language_1.default.findOne({ _id: req.body.currentLanguage });
                const updated = yield User_1.default.findOneAndUpdate({ _id: user.id }, { currentLanguage: languageCandidate }, { new: true });
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
                    currentLanguage: (_a = updated) === null || _a === void 0 ? void 0 : _a.currentLanguage,
                    message: 'Language selected'
                });
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
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
        this.addUserLanguages = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const selectedUserLanguages = req.body.userLanguages;
                const lang = selectedUserLanguages[0];
                const newUserLanguage = yield new UserLanguage_1.default({
                    langId: lang._id,
                    name: lang.name,
                    userId: user._id
                });
                const isExist = yield UserLanguage_1.default.exists({ userId: user._id, name: newUserLanguage.name, langId: newUserLanguage.langId });
                if (!isExist) {
                    yield newUserLanguage.save();
                }
                const allLanguages = yield Language_1.default.find();
                const userLanguages = yield languages_1.getUserLanguages(user);
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
                });
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
        this.deleteUserLanguage = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            try {
                // const user: UserModel = await User.findOne({ _id: req.user }) as UserModel;
                const user = req.user;
                const languageIdToDelete = req.body.languageId;
                if (((_b = user.currentLanguage) === null || _b === void 0 ? void 0 : _b._id.toString()) === languageIdToDelete) {
                    user.currentLanguage = null;
                    yield User_1.default.findOneAndUpdate({ _id: user._id }, { $set: user });
                }
                const langs = yield UserLanguage_1.default.findOneAndRemove({ userId: user._id, langId: languageIdToDelete });
                // console.log('LANGUAGE DLETE', langs, typeof languageIdToDelete)
                const allLanguages = yield Language_1.default.find();
                const userLanguages = yield languages_1.getUserLanguages(user);
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
                });
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
    }
}
exports.LanguagesController = LanguagesController;
//# sourceMappingURL=language.js.map