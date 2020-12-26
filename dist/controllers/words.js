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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const groups_heplers_1 = require("../helper-functions/groups.heplers");
const GeneralWord_1 = __importDefault(require("../Models/GeneralWord"));
const Word_1 = __importDefault(require("../Models/Word"));
const WordGroup_1 = __importDefault(require("../Models/WordGroup"));
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const file_handler_1 = require("../utils/file-handler");
const csv_to_json_1 = require("./../utils/csv-to-json");
class WordsController {
    constructor() {
        this.getAllWordsForCurrentUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const words = yield getWords(user);
                res.status(200).json({ words, user, });
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
        // public addMyWords = async (req: Request, res: Response) => {
        //     try {
        //         const user = req.user as IRequestUserInfo
        //         // const user: UserModel = await User.findById(userInRequest._id) as UserModel;
        //         const newWords = user.words as WordModel[]
        //        await newWords?.forEach(async element => {
        //             const newWord: WordModel = await new Word({
        //                 isFavorite: false,
        //                 word: element.word,
        //                 levelKnowledge: element.levelKnowledge,
        //                 translation: element.translation,
        //                 language: user.currentLanguage?._id,
        //                 user: user._id,
        //                 assignedGroups: element.assignedGroups
        //             })
        //             const isExist = await Word.exists({ user: user._id, word: newWord.word, translation: newWord.translation })
        //             if (!isExist) {
        //                 await newWord.save()
        //             }
        //         });
        //         const words = await getWords(user)
        //         res.status(200).json({ words, user, });
        //     } catch (error) {
        //         errorHandler(res, error);
        //     }
        // };
        this.createNewWordForUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const user = req.user;
                const newWord = yield new Word_1.default({
                    word: req.body.word,
                    translation: req.body.translation,
                    isFavorite: req.body.isFavorite,
                    language: (_a = user.currentLanguage) === null || _a === void 0 ? void 0 : _a._id,
                    user: user._id,
                    assignedGroups: req.body.assignedGroups ? req.body.assignedGroups : []
                });
                const isExist = yield Word_1.default.exists({ user: user._id, word: newWord.word, translation: newWord.translation });
                if (!isExist) {
                    yield newWord.save();
                }
                else {
                    const words = yield getWords(user);
                    res.status(403).json({ words, message: 'Word already exists' });
                    return;
                }
                ;
                console.log('new word', newWord);
                const words = yield getWords(user);
                const groups = yield getGroups(user, words);
                res.status(201).json({ words, groups, message: 'Successfully added' });
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
        this.addWordsFromCSV = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var e_1, _b;
            var _c;
            try {
                // const user: UserModel = await User.findOne({ _id: req.user }) as UserModel;
                // const currentUserLanguage = user.currentLanguage
                // if (!currentUserLanguage) throw new Error('Language does not exists')
                // multer({ dest: "./uploads/" }).single("csvFile"), (file) => {
                //     return file
                // },
                const user = req.user;
                const csvFile = req.file;
                const filePath = process.env.NODE_ENV === 'production' ? `${csvFile.path}` : `${path_1.default.resolve()}/${csvFile.path}`;
                console.log('PATH', csvFile.path);
                const wordsFromCSV = yield csv_to_json_1.CSVtoJson.createJsonArray(filePath);
                const assignedGroups = JSON.parse(req.query.assignedGroups);
                try {
                    for (var wordsFromCSV_1 = __asyncValues(wordsFromCSV), wordsFromCSV_1_1; wordsFromCSV_1_1 = yield wordsFromCSV_1.next(), !wordsFromCSV_1_1.done;) {
                        let word = wordsFromCSV_1_1.value;
                        if (word && word.Translation && word.Word) {
                            const newWord = yield new Word_1.default({
                                isFavorite: false,
                                word: word.Word,
                                translation: word.Translation,
                                language: (_c = user.currentLanguage) === null || _c === void 0 ? void 0 : _c._id,
                                user: user._id,
                                assignedGroups: assignedGroups ? assignedGroups : []
                            });
                            const isExist = yield Word_1.default.exists({
                                user: user._id,
                                language: newWord.language,
                                word: newWord.word,
                                translation: newWord.translation
                            });
                            console.log('IS EXIST', isExist);
                            if (!isExist) {
                                yield newWord.save();
                            }
                            else {
                                yield Word_1.default.findOneAndUpdate({ user: user._id, word: newWord.word, translation: newWord.translation }, { assignedGroups: newWord.assignedGroups });
                            }
                            // await newWord.save()
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (wordsFromCSV_1_1 && !wordsFromCSV_1_1.done && (_b = wordsFromCSV_1.return)) yield _b.call(wordsFromCSV_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                // wordsFromCSV.forEach(async word => {
                // if (word && word.Translation && word.Word) {
                //     const newWord: WordModel = await new Word({
                //         isFavorite: false,
                //         word: word.Word,
                //         translation: word.Translation,
                //         language: user.currentLanguage?._id,
                //         user: user._id,
                //         assignedGroups: assignedGroups ? assignedGroups : []
                //     });
                //     const isExist = await Word.exists({ user: user._id, word: newWord.word, translation: newWord.translation })
                //     if (!isExist) {
                //         await newWord.save()
                //     }
                //     console.log('wordsFromCSV', newWord)
                //     // await newWord.save()
                // }
                // })
                const fileHandler = new file_handler_1.FileHandler();
                fileHandler.deleteFile(filePath);
                const words = yield getWords(user);
                const groups = yield getGroups(user, words);
                // const words = await new Word().collection.insertMany(wordsFromCSV);
                // user.words = [...user.words, ...words.ops]
                // const updatedUser = await User.findOneAndUpdate({ _id: user.id }, { $set: user }, { new: true })
                // const words = getWordsByLanguage(currentUserLanguage._id, updatedUser?.words || [])
                res.status(201).json({ words, groups });
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
        // public addNewWords = async (req: Request, res: Response) => {
        //     try {
        //         const user: UserModel = await User.findOne({ _id: req.user }) as UserModel;
        //         const newWords = req.body.words
        //         const words = await new Word().collection.insertMany(newWords);
        //         user.words = [...user.words, ...words.ops]
        //         const updatedUser = await User.findOneAndUpdate({ _id: user.id }, { $set: user }, { new: true })
        //         res.status(201).json(updatedUser?.words);
        //     } catch (error) {
        //         errorHandler(res, error);
        //     }
        // }
        this.updateUserWords = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const wordsToUpdate = req.body.words;
                const user = req.user;
                const currentUserLanguage = user.currentLanguage;
                if (!currentUserLanguage)
                    throw new Error('Language does not exists');
                for (let word of wordsToUpdate) {
                    yield Word_1.default.findOneAndUpdate({ _id: word._id }, { $set: word });
                }
                const words = yield getWords(user);
                const groups = yield getGroups(user, words);
                res.status(201).json({ words, groups });
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
        this.editWordByIdForCurrentUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const editedWord = req.body;
                const updatedWord = yield Word_1.default.findOneAndUpdate({ _id: editedWord._id }, { $set: editedWord }, { new: true });
                const words = yield getWords(user);
                const groups = yield getGroups(user, words);
                // Send groups back to client to update state if quantity of words changed
                // Because we use this method to delete word from a group
                res.status(200).json({ words, groups });
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
        this.deleteWordByIdForCurrentUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const wordIdToDelete = req.params.wordId;
                yield Word_1.default.findByIdAndRemove({ _id: wordIdToDelete });
                const words = yield getWords(user);
                const groups = yield getGroups(user, words);
                res.status(200).json({
                    words,
                    groups,
                    message: 'Removed'
                });
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
        // public deleteWordFromGroup = async (req: Request, res: Response) => {
        //     try {
        //         const user = req.user as IRequestUserInfo
        //         const wordIdToDelete = req.params.wordId
        //         await Word.findByIdAndRemove({ _id: wordIdToDelete })
        //         const words = await getWords(user)
        //         res.status(200).json({
        //             words,
        //             message: 'Removed'
        //         })
        //     } catch (error) {
        //         errorHandler(res, error);
        //     }
        // };
        // public addWordsToGeneralList = async (req: Request, res: Response) => {
        //     try {
        //         const newWords: [] = req.body.words
        //         const words = await new GeneralWord().collection.insertMany(newWords);
        //         res.status(201).json(words);
        //     } catch (error) {
        //         errorHandler(res, error)
        //     }
        // }
        this.getGeneralWords = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const currentUserLanguage = user.currentLanguage;
                if (!currentUserLanguage)
                    throw new Error('Language does not exists');
                const words = yield GeneralWord_1.default.find({ language: currentUserLanguage._id });
                res.status(200).json(words);
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
        this.addWordsToGeneralList = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _d;
            try {
                const user = req.user;
                const words = req.body.words;
                if (words && words.length > 0) {
                    words.forEach((word) => __awaiter(this, void 0, void 0, function* () {
                        var _e;
                        const newWord = yield new GeneralWord_1.default({
                            word: word.word,
                            translation: word.translation,
                            language: (_e = user.currentLanguage) === null || _e === void 0 ? void 0 : _e._id,
                            assignedGroups: word.assignedGroups,
                            user: user._id
                        }).save();
                    }));
                }
                const generalWords = yield GeneralWord_1.default.find({ language: (_d = user.currentLanguage) === null || _d === void 0 ? void 0 : _d._id });
                res.status(201).json({ addedWord: '', generalWords });
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
        this.deleteWordFromGeneralList = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const deletedWord = yield GeneralWord_1.default.findOneAndRemove({ _id: req.query.wordId });
                const currentUserLanguage = user.currentLanguage;
                if (!currentUserLanguage)
                    throw new Error('Language does not exists');
                const words = yield GeneralWord_1.default.find({ language: currentUserLanguage._id.toString() });
                if (deletedWord) {
                    res.status(200).json({
                        words,
                        word: deletedWord,
                        message: 'Removed'
                    });
                }
                else {
                    throw new Error('Word not found');
                }
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
    }
}
exports.WordsController = WordsController;
function getWords(user) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        return (yield Word_1.default.find({ user: user, language: (_a = user.currentLanguage) === null || _a === void 0 ? void 0 : _a._id })).reverse();
    });
}
function getGroups(user, words) {
    return __awaiter(this, void 0, void 0, function* () {
        const currentUserLanguage = user.currentLanguage;
        if (!currentUserLanguage)
            throw new Error('Language does not exists');
        const userGroups = yield WordGroup_1.default.find({
            language: currentUserLanguage._id,
            user: user
        });
        const groups = groups_heplers_1.getAllUserGroups(userGroups, currentUserLanguage._id, words);
        return groups;
    });
}
//# sourceMappingURL=words.js.map