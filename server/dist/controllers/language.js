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
const Word_1 = __importDefault(require("../Models/Word"));
const User_1 = __importDefault(require("../Models/User"));
class LanguagesController {
    constructor() {
        this.getAllLanguages = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const languages = yield Language_1.default.find({ user: user });
                res.status(200).json(languages);
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
        this.createLanguage = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const newLanguage = yield new Language_1.default({
                    name: req.body.name,
                    user: user
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
                yield Word_1.default.remove({ category: req.params.id });
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
                const updatedUser = yield User_1.default.findOneAndUpdate({ _id: user._id }, { $set: user });
                res.status(200).json({
                    currentLanguage: updatedUser.currentLanguage,
                    message: 'Language selected'
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