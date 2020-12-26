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
const groups_heplers_1 = require("../helper-functions/groups.heplers");
const Word_1 = __importDefault(require("../Models/Word"));
const WordGroup_1 = __importDefault(require("../Models/WordGroup"));
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
class WordGroupController {
    constructor() {
        this.getAllWordGroups = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // const user = req.user as { _id: string, email: string }
                const user = req.user;
                if (!user.currentLanguage)
                    throw new Error('Language is not exists');
                const words = yield Word_1.default.find({ user: user, language: user.currentLanguage._id });
                const userGroups = yield WordGroup_1.default.find({
                    language: user.currentLanguage._id,
                    user: user
                });
                // let allGroups = [...this.getDefaultGroups(), ...userGroups]
                // const words = getWordsByLanguage(req.query.languageId, user.words)
                // this.setQuantityWordsInGroups(allGroups, words);
                const groups = groups_heplers_1.getAllUserGroups(userGroups, user.currentLanguage._id.toString(), words);
                res.status(200).json(groups);
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
        this.saveGroup = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const user = req.user;
                const groupCondidate = req.body.group;
                if (!groupCondidate)
                    return;
                let group;
                if (groupCondidate.id) {
                    group = (yield WordGroup_1.default.findOneAndUpdate({ _id: groupCondidate.id }, { name: groupCondidate.name }, { new: true }));
                }
                else {
                    group = yield new WordGroup_1.default({
                        name: groupCondidate.name,
                        language: groupCondidate.languageId || ((_a = user.currentLanguage) === null || _a === void 0 ? void 0 : _a._id),
                        user: req.user
                    }).save();
                }
                const userGroups = yield WordGroup_1.default.find({
                    language: groupCondidate.languageId || ((_b = user.currentLanguage) === null || _b === void 0 ? void 0 : _b._id),
                    user: user
                });
                if (!user.currentLanguage)
                    throw new Error('Language is not exists');
                const words = yield Word_1.default.find({ user: user, language: user.currentLanguage._id });
                const groups = groups_heplers_1.getAllUserGroups(userGroups, (_c = user.currentLanguage) === null || _c === void 0 ? void 0 : _c._id, words);
                res.status(201).json({
                    groups,
                    group: group
                });
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
        this.deleteWordGroup = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _d;
            try {
                const user = req.user;
                if (!user.currentLanguage)
                    throw new Error('Language is not exists');
                const removedGroup = yield WordGroup_1.default.findOneAndRemove({ _id: req.body.groupId });
                const words = yield Word_1.default.find({ user: user, language: user.currentLanguage._id });
                const userGroups = yield WordGroup_1.default.find({
                    language: user.currentLanguage._id,
                    user: user
                });
                const groups = groups_heplers_1.getAllUserGroups(userGroups, (_d = user.currentLanguage) === null || _d === void 0 ? void 0 : _d._id, words);
                res.status(200).json({ groups });
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
        this.assignGroup = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const groupIdForAssign = req.body.groupId;
                const selectedWords = req.body.selectedWords;
                const user = req.user;
                const language = user.currentLanguage;
                if (!language)
                    throw new Error('Language does not exists');
                selectedWords.forEach((wordId) => __awaiter(this, void 0, void 0, function* () {
                    yield Word_1.default.findOneAndUpdate({ _id: wordId }, { $push: { assignedGroups: groupIdForAssign } });
                }));
                const userGroups = yield WordGroup_1.default.find({
                    language: language._id,
                    user: user
                });
                // const updatedUser = await User.findOneAndUpdate({ _id: user._id }, { $set: user }, { new: true });
                const words = yield Word_1.default.find({ user: user, language: language._id });
                const groups = groups_heplers_1.getAllUserGroups(userGroups, language._id.toString(), words);
                res.status(200).json({
                    groups: groups,
                    wordsAfterAssign: words,
                    message: 'Words added'
                });
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
        // public editWordGroupById = async (req: Request, res: Response) => {
        //       try {
        //             const editedWord = await Word.findOneAndUpdate(
        //                   { _id: req.body._id },
        //                   { $set: req.body },
        //                   { new: true }
        //             )
        //             res.status(200).json(editedWord)
        //       } catch (error) {
        //             errorHandler(res, error);
        //       }
        // };
        // public deleteWordGroupById = async (req: Request, res: Response) => {
        //       try {
        //             const deletedWord = await Word.findOneAndRemove({ _id: req.params.wordId })
        //             res.status(200).json({
        //                   word: deletedWord,
        //                   message: 'Removed'
        //             })
        //       } catch (error) {
        //             errorHandler(res, error);
        //       }
        // };
    }
}
exports.WordGroupController = WordGroupController;
//# sourceMappingURL=word-group.js.map