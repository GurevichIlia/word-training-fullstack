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
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const Language_1 = __importDefault(require("../Models/Language"));
const User_1 = __importDefault(require("../Models/User"));
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
                const gotUser = req.user;
                const user = yield User_1.default.findOne({ _id: gotUser });
                const languages = user.userLanguages;
                res.status(200).json(languages);
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
                const user = yield User_1.default.findOne({ _id: req.user });
                const currentLang = user.currentLanguage;
                res.status(200).json({ currentLang });
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
        this.setCurrentLanguage = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const currentLanguage = yield Language_1.default.findOne({ _id: req.body.currentLanguage });
                user.currentLanguage = currentLanguage;
                const updatedUser = yield User_1.default.findOneAndUpdate({ _id: user._id }, { $set: user }, { new: true });
                res.status(200).json({
                    currentLanguage: updatedUser.currentLanguage,
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
                const user = yield User_1.default.findOne({ _id: req.user });
                const selectedUserLanguages = req.body.userLanguages;
                const promises = yield selectedUserLanguages.map((language) => __awaiter(this, void 0, void 0, function* () {
                    const lang = yield Language_1.default.findOne({ _id: language });
                    return lang;
                }));
                const userLanguages = yield Promise.all(promises);
                if (user.userLanguages) {
                    user.userLanguages = [...user.userLanguages, ...userLanguages];
                    // user.userLanguages = userLanguages.map(language => user.userLanguages.splice(index))
                }
                else {
                    user.userLanguages = userLanguages;
                }
                const updatedUser = yield User_1.default.findOneAndUpdate({ _id: user._id }, { $set: user }, { new: true });
                res.status(200).json({
                    userLanguages: updatedUser.userLanguages,
                    message: 'Languages added'
                });
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
        this.deleteUserLanguage = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const user = yield User_1.default.findOne({ _id: req.user });
                const languageIdToDelete = req.body.languageId;
                user.userLanguages = user.userLanguages.filter(language => languageIdToDelete != language._id);
                console.log('USER', user.currentLanguage);
                console.log('USER LANG', (_a = user.currentLanguage) === null || _a === void 0 ? void 0 : _a._id);
                console.log('DELETE LANG', languageIdToDelete);
                if (((_b = user.currentLanguage) === null || _b === void 0 ? void 0 : _b._id) === languageIdToDelete) {
                    user.currentLanguage = null;
                }
                console.log('AFTER DELETE', user.currentLanguage);
                if (user.userLanguages.length === 0) {
                    user.currentLanguage = null;
                }
                const foundLangauge = user.userLanguages.find(lang => { var _a; return ((_a = user.currentLanguage) === null || _a === void 0 ? void 0 : _a._id) === lang._id; });
                if (!foundLangauge) {
                    user.currentLanguage = null;
                }
                console.log('USER CURRENT LANG', user.currentLanguage);
                const updatedUser = yield User_1.default.findOneAndUpdate({ _id: user._id }, { $set: user }, { new: true });
                console.log('USER CURRENT LANG AFTER UPDATE', updatedUser.currentLanguage);
                res.status(200).json({
                    currentLearningLanguage: updatedUser.currentLanguage,
                    userLanguages: updatedUser.userLanguages,
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