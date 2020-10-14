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
const Word_1 = __importDefault(require("../Models/Word"));
const User_1 = __importDefault(require("../Models/User"));
const GeneralWord_1 = __importDefault(require("../Models/GeneralWord"));
const index_1 = require("./../helper-functions/index");
const csv_to_json_1 = require("./../utils/csv-to-json");
const path_1 = __importDefault(require("path"));
const file_handler_1 = require("../utils/file-handler");
const fileHandler = new file_handler_1.FileHandler();
class WordsController {
    constructor() {
        this.getAllWordsForCurrentUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // const user = req.user as { _id: string, email: string }
                // const words = await Word.find({
                //     language: req.query.languageId,
                // });
                const currentLanguage = req.query.languageId;
                const user = yield User_1.default.findOne({ _id: req.user });
                const words = index_1.getWordsByLanguage(currentLanguage, user.words);
                // const newwords = words.map(word => {
                //     word.assignedGroups.push('1')
                //     return word
                // })
                res.status(200).json(words);
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
                const isExistWord = user.words.find(word => word.word === req.body.word && word.translation === req.body.translation);
                if (isExistWord) {
                    res.status(200).json({ newWord: isExistWord, message: 'Word already added' });
                    return;
                }
                const newWord = yield new Word_1.default({
                    word: req.body.word,
                    translation: req.body.translation,
                    isFavorite: req.body.isFavorite,
                    language: req.query.languageId,
                    assignedGroups: req.body.assignedGroups ? req.body.assignedGroups : []
                });
                user.words.unshift(newWord);
                const updatedUser = yield User_1.default.findOneAndUpdate({ _id: user.id }, { $set: user }, { new: true });
                res.status(201).json({ newWord, message: 'Successfully added' });
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
        this.addWordsFromCSV = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.default.findOne({ _id: req.user });
                // multer({ dest: "./uploads/" }).single("csvFile"), (file) => {
                //     return file
                // },
                const csvFile = req.file;
                const filePath = `${csvFile.path}`;
                console.log('FILE PATH', filePath);

                const wordsFromCSV = yield csv_to_json_1.CSVtoJson.createJsonArray(filePath);
                const assignedGroups = JSON.parse(req.query.assignedGroups);
                yield wordsFromCSV.forEach((word) => __awaiter(this, void 0, void 0, function* () {
                    if (!word || !word.Translation || !word.Word)
                        return;
                    const newWord = yield new Word_1.default({
                        word: word.Word,
                        translation: word.Translation,
                        language: req.query.languageId,
                        assignedGroups: assignedGroups ? assignedGroups : []
                    });
                    user.words.unshift(newWord);
                }));
                fileHandler.deleteFile(filePath);
                // const words = await new Word().collection.insertMany(wordsFromCSV);
                // user.words = [...user.words, ...words.ops]
                const updatedUser = yield User_1.default.findOneAndUpdate({ _id: user.id }, { $set: user }, { new: true });
                res.status(201).json(updatedUser);
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
        this.addNewWords = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const user = yield User_1.default.findOne({ _id: req.user });
                const newWords = req.body.words;
                const words = yield new Word_1.default().collection.insertMany(newWords);
                user.words = [...user.words, ...words.ops];
                const updatedUser = yield User_1.default.findOneAndUpdate({ _id: user.id }, { $set: user }, { new: true });
                res.status(201).json((_a = updatedUser) === null || _a === void 0 ? void 0 : _a.words);
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
        this.updateUserWords = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            try {
                const wordsToUpdate = req.body.words;
                const user = yield User_1.default.findOne({ _id: req.user });
                const words = user.words.filter(word => word.language == req.query.languageId);
                const updatedWords = wordsToUpdate.map(word => {
                    const findedWord = words.find(existWord => existWord.id === word.id);
                    if (findedWord) {
                        return Object.assign(Object.assign({}, findedWord), word);
                    }
                    else {
                        return word;
                    }
                });
                user.words = updatedWords;
                const updatedUser = yield User_1.default.findOneAndUpdate({ _id: req.user }, { $set: user }, { new: true });
                // const updatedWord = await Word.findOneAndUpdate({ _id: word._id }, { $set: word })
                // return updatedWord
                // // const user = req.user as { _id: string, email: string }
                // const test = await Promise.all(promises);
                // const updatedWords = await Word.find({
                //     language: req.query.languageId,
                //     user: user._id
                // });
                // console.log()
                res.status(201).json((_b = updatedUser) === null || _b === void 0 ? void 0 : _b.words);
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
        this.editWordByIdForCurrentUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
                res.status(200).json(editedWord);
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
        this.deleteWordByIdForCurrentUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.default.findOne({ _id: req.user });
                // user.words = user.words.filter(word => word._id.toString() !== req.params.wordId)
                // const deletedWordIndex = user.words.findIndex(word => word._id.toString() == req.params.wordId)
                const deletedWord = user.words.splice(+req.params.wordIndex, 1);
                // console.log('DELETED WORD', deletedWord, new Date().getTime())
                const updatedUser = yield User_1.default.findOneAndUpdate({ _id: user.id }, { $set: user }, { new: true });
                // console.log('USER UPDATED', new Date().getTime())
                res.status(200).json({
                    word: deletedWord,
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
                const words = yield GeneralWord_1.default.find({ language: req.query.languageId });
                res.status(200).json(words);
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
        this.addWordsToGeneralList = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.default.findOne({ _id: req.user });
                const words = req.body.words;
                if (words && words.length > 0) {
                    words.forEach((word) => __awaiter(this, void 0, void 0, function* () {
                        const newWord = yield new GeneralWord_1.default({
                            word: word.word,
                            translation: word.translation,
                            language: req.query.languageId,
                            assignedGroups: word.assignedGroups,
                            user: user._id
                        }).save();
                    }));
                }
                res.status(201).json({ addedWord: '' });
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
        this.deleteWordFromGeneralList = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('WORD ID', req.query.wordId);
                const deletedWord = yield GeneralWord_1.default.findOneAndRemove({ _id: req.query.wordId });
                if (deletedWord) {
                    res.status(200).json({
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
// this.router.get("words/getAllWords", this.wordsController);
// this.router.get("words/getWordById", this.wordsController);
// this.router.post("words/addNewWord", this.wordsController);
// this.router.patch("words/editWordById", this.wordsController);
// this.router.delete("words/deleteWordById", this.wordsController);
//# sourceMappingURL=words.js.map