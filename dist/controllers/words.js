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
const path_1 = __importDefault(require("path"));
const GeneralWord_1 = __importDefault(require("../Models/GeneralWord"));
const User_1 = __importDefault(require("../Models/User"));
const Word_1 = __importDefault(require("../Models/Word"));
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const file_handler_1 = require("../utils/file-handler");
const index_1 = require("./../helper-functions/index");
const csv_to_json_1 = require("./../utils/csv-to-json");
const fileHandler = new file_handler_1.FileHandler();
class WordsController {
    constructor() {
        this.getAllWordsForCurrentUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // const user = await User.findOne({ _id: req.user }) as UserModel
                // const currentUserLanguage = user.currentLanguage;
                // if (!currentUserLanguage) throw new Error('Language does not exists')
                // const words = await Word.find({
                //     user: user._id,
                //     language: currentUserLanguage._id,
                // });
                const user = yield User_1.default.findOne({ _id: req.user });
                const currentUserLanguage = user.currentLanguage;
                if (!currentUserLanguage)
                    throw new Error('Language does not exists');
                if (user.wordsForBackup.length === 0) {
                    user.wordsForBackup = [...user.words];
                }
                const words = index_1.getWordsByLanguage(currentUserLanguage._id, user.words);
                res.status(200).json({ words, user });
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
        // public getWordById = async (req: Request, res: Response) => {
        //     try {
        //     } catch (error) {
        //         errorHandler(res, error);
        //     }wsd
        // };
        this.createNewWordForUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.default.findOne({ _id: req.user });
                const currentUserLanguage = user.currentLanguage;
                if (!currentUserLanguage)
                    throw new Error('Language does not exists');
                // if (!updatedUser || !updatedUser.currentLanguage) throw new Error('User or language does not exists')
                const isExistWord = user.words.find(word => word.word === req.body.word && word.translation === req.body.translation);
                if (isExistWord) {
                    res.status(403).json({ newWord: isExistWord, message: 'Word already exists' });
                    return;
                }
                const newWord = yield new Word_1.default({
                    word: req.body.word,
                    translation: req.body.translation,
                    isFavorite: req.body.isFavorite,
                    language: currentUserLanguage._id,
                    user: user._id,
                    assignedGroups: req.body.assignedGroups ? req.body.assignedGroups : []
                });
                console.log('NEW WORD', typeof newWord._id);
                user.wordsForBackup.unshift(newWord);
                user.words.unshift(newWord);
                const updatedUser = yield User_1.default.findOneAndUpdate({ _id: user.id }, { $set: user }, { new: true });
                if (!updatedUser)
                    throw new Error('User does not exists');
                const words = index_1.getWordsByLanguage(currentUserLanguage._id, updatedUser.words);
                res.status(201).json({ words, message: 'Successfully added', user: updatedUser, userOlder: user });
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
        this.addWordsFromCSV = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const user = yield User_1.default.findOne({ _id: req.user });
                const currentUserLanguage = user.currentLanguage;
                if (!currentUserLanguage)
                    throw new Error('Language does not exists');
                // multer({ dest: "./uploads/" }).single("csvFile"), (file) => {
                //     return file
                // },
                const csvFile = req.file;
                console.log('FILE PATH', csvFile.path);
                const filePath = process.env.NODE_ENV === 'production' ? `${csvFile.path}` : `${path_1.default.resolve()}/${csvFile.path}`;
                console.log('FILE PATH', filePath);
                const wordsFromCSV = yield csv_to_json_1.CSVtoJson.createJsonArray(filePath);
                console.log('ASSIGN GROUPS', req.query.assignedGroups);
                const assignedGroups = JSON.parse(req.query.assignedGroups);
                yield wordsFromCSV.forEach((word) => __awaiter(this, void 0, void 0, function* () {
                    if (!word || !word.Translation || !word.Word)
                        return;
                    const newWord = yield new Word_1.default({
                        word: word.Word,
                        translation: word.Translation,
                        language: currentUserLanguage._id,
                        assignedGroups: assignedGroups ? assignedGroups : []
                    });
                    user.words.unshift(newWord);
                }));
                fileHandler.deleteFile(filePath);
                // const words = await new Word().collection.insertMany(wordsFromCSV);
                // user.words = [...user.words, ...words.ops]
                const updatedUser = yield User_1.default.findOneAndUpdate({ _id: user.id }, { $set: user }, { new: true });
                const words = index_1.getWordsByLanguage(currentUserLanguage._id, ((_a = updatedUser) === null || _a === void 0 ? void 0 : _a.words) || []);
                res.status(201).json(words);
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
        this.addNewWords = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            try {
                const user = yield User_1.default.findOne({ _id: req.user });
                const newWords = req.body.words;
                const words = yield new Word_1.default().collection.insertMany(newWords);
                user.words = [...user.words, ...words.ops];
                const updatedUser = yield User_1.default.findOneAndUpdate({ _id: user.id }, { $set: user }, { new: true });
                res.status(201).json((_b = updatedUser) === null || _b === void 0 ? void 0 : _b.words);
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
        this.updateUserWords = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _c;
            try {
                const wordsToUpdate = req.body.words;
                const user = yield User_1.default.findOne({ _id: req.user });
                const currentUserLanguage = user.currentLanguage;
                if (!currentUserLanguage)
                    throw new Error('Language does not exists');
                // // let wordsByLanguage = user.words.filter(word => checkByLanguage(word.language, currentUserLanguage._id));
                let words = [...user.words];
                // console.log(' WORDS TO UPDATE', wordsToUpdate)
                user.words = words.map(word => {
                    const foundWord = wordsToUpdate.find(wordToUpdate => {
                        // console.log(wordToUpdate._id, word._id)
                        // console.log(typeof wordToUpdate._id, typeof word._id)
                        // console.log(wordToUpdate.word, word.word)
                        return wordToUpdate._id.toString() === word._id.toString();
                    });
                    if (foundWord) {
                        return Object.assign({}, foundWord);
                    }
                    return word;
                });
                const updatedUser = yield User_1.default.findOneAndUpdate({ _id: req.user }, { $set: user }, { new: true });
                const wordsByLanguage = index_1.getWordsByLanguage(currentUserLanguage._id, ((_c = updatedUser) === null || _c === void 0 ? void 0 : _c.words) || []);
                res.status(201).json(wordsByLanguage);
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
        this.editWordByIdForCurrentUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _d;
            try {
                const user = yield User_1.default.findOne({ _id: req.user });
                const editedWord = req.body;
                user.words = user.words.map(word => {
                    return word._id == editedWord._id ? Object.assign(Object.assign({}, word), editedWord) : word;
                });
                const updatedUser = yield User_1.default.findOneAndUpdate({ _id: user.id }, { $set: user }, { new: true });
                // const editedWord = await Word.findOneAndUpdate(
                //     { _id: req.body._id },
                //     { $set: req.body },
                //     { new: true }
                // )
                if (!updatedUser || !updatedUser.currentLanguage)
                    throw new Error('User or language does not exists');
                const words = index_1.getWordsByLanguage(updatedUser.currentLanguage._id, (_d = updatedUser) === null || _d === void 0 ? void 0 : _d.words);
                res.status(200).json({ words });
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
        this.deleteWordByIdForCurrentUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _e;
            try {
                const user = yield User_1.default.findOne({ _id: req.user });
                user.words = user.words.filter(word => word._id.toString() !== req.params.wordId);
                const updatedUser = yield User_1.default.findOneAndUpdate({ _id: user.id }, { $set: user }, { new: true });
                // console.log('USER UPDATED', new Date().getTime())
                if (!updatedUser || !updatedUser.currentLanguage)
                    throw new Error('User or language does not exists');
                const words = index_1.getWordsByLanguage(updatedUser.currentLanguage._id, (_e = updatedUser) === null || _e === void 0 ? void 0 : _e.words);
                res.status(200).json({
                    words,
                    message: 'Removed'
                });
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
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
                const user = yield User_1.default.findOne({ _id: req.user });
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
            try {
                const user = yield User_1.default.findOne({ _id: req.user });
                const currentUserLanguage = user.currentLanguage;
                if (!currentUserLanguage)
                    throw new Error('Language does not exists');
                const words = req.body.words;
                if (words && words.length > 0) {
                    words.forEach((word) => __awaiter(this, void 0, void 0, function* () {
                        const newWord = yield new GeneralWord_1.default({
                            word: word.word,
                            translation: word.translation,
                            language: currentUserLanguage._id,
                            assignedGroups: word.assignedGroups,
                            user: user._id
                        }).save();
                    }));
                }
                const generalWords = yield GeneralWord_1.default.find({ language: currentUserLanguage._id });
                res.status(201).json({ addedWord: '', generalWords });
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
        this.deleteWordFromGeneralList = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('WORD ID', req.query.wordId);
                const deletedWord = yield GeneralWord_1.default.findOneAndRemove({ _id: req.query.wordId });
                const user = yield User_1.default.findOne({ _id: req.user });
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
                    throw new Error();
                }
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
    }
}
exports.WordsController = WordsController;
function checkByLanguage(language, language2) {
    return language.toString() === language2.toString();
}
// this.router.get("words/getAllWords", this.wordsController);
// this.router.get("words/getWordById", this.wordsController);
// this.router.post("words/addNewWord", this.wordsController);
// this.router.patch("words/editWordById", this.wordsController);
// this.router.delete("words/deleteWordById", this.wordsController);
//# sourceMappingURL=words.js.map