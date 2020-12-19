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
        this.addMyWords = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.default.findOne({ _id: req.user });
                const newWords = user.words;
                newWords.forEach((element) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const newWord = yield new Word_1.default({
                        isFavorite: false,
                        word: element.word,
                        levelKnowledge: element.levelKnowledge,
                        translation: element.translation,
                        language: (_a = user.currentLanguage) === null || _a === void 0 ? void 0 : _a._id,
                        user: user._id,
                        assignedGroups: element.assignedGroups
                    });
                    const isExist = yield Word_1.default.exists({ user: user._id, word: newWord.word, translation: newWord.translation });
                    if (!isExist) {
                        yield newWord.save();
                    }
                }));
                const words = yield getWords(user);
                res.status(200).json({ words, user, });
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
        this.createNewWordForUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            try {
                const user = req.user;
                const newWord = yield new Word_1.default({
                    word: req.body.word,
                    translation: req.body.translation,
                    isFavorite: req.body.isFavorite,
                    language: (_b = user.currentLanguage) === null || _b === void 0 ? void 0 : _b._id,
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
                res.status(201).json({ words, message: 'Successfully added' });
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
        this.addWordsFromCSV = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
                wordsFromCSV.forEach((word) => __awaiter(this, void 0, void 0, function* () {
                    var _c;
                    if (word && word.Translation && word.Word) {
                        const newWord = yield new Word_1.default({
                            isFavorite: false,
                            word: word.Word,
                            translation: word.Translation,
                            language: (_c = user.currentLanguage) === null || _c === void 0 ? void 0 : _c._id,
                            user: user._id,
                            assignedGroups: assignedGroups ? assignedGroups : []
                        }).save();
                        console.log('wordsFromCSV', newWord);
                        // await newWord.save()
                    }
                }));
                const fileHandler = new file_handler_1.FileHandler();
                fileHandler.deleteFile(filePath);
                const words = yield getWords(user);
                // const words = await new Word().collection.insertMany(wordsFromCSV);
                // user.words = [...user.words, ...words.ops]
                // const updatedUser = await User.findOneAndUpdate({ _id: user.id }, { $set: user }, { new: true })
                // const words = getWordsByLanguage(currentUserLanguage._id, updatedUser?.words || [])
                res.status(201).json(words);
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
        this.addNewWords = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _d;
            try {
                const user = yield User_1.default.findOne({ _id: req.user });
                const newWords = req.body.words;
                const words = yield new Word_1.default().collection.insertMany(newWords);
                user.words = [...user.words, ...words.ops];
                const updatedUser = yield User_1.default.findOneAndUpdate({ _id: user.id }, { $set: user }, { new: true });
                res.status(201).json((_d = updatedUser) === null || _d === void 0 ? void 0 : _d.words);
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
        this.updateUserWords = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const wordsToUpdate = req.body.words;
                const user = req.user;
                const currentUserLanguage = user.currentLanguage;
                if (!currentUserLanguage)
                    throw new Error('Language does not exists');
                yield wordsToUpdate.forEach((word) => __awaiter(this, void 0, void 0, function* () {
                    yield Word_1.default.findOneAndUpdate({ _id: word._id }, { $set: word });
                }));
                const words = yield getWords(user);
                res.status(201).json(words);
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
        this.editWordByIdForCurrentUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _e;
            try {
                const user = req.user;
                const editedWord = req.body;
                const updatedWord = yield Word_1.default.findOneAndUpdate({ _id: editedWord._id }, { $set: editedWord }, { new: true });
                const words = yield Word_1.default.find({ user: user, language: (_e = user.currentLanguage) === null || _e === void 0 ? void 0 : _e._id });
                res.status(200).json({ words });
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
                res.status(200).json({
                    words,
                    message: 'Removed'
                });
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
        // public deleteWordFromGroup = async (req: Request, res: Response) => {
        //     try {
        //         const user = req.user as IRequstUserInfo
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
            var _f;
            try {
                const user = req.user;
                const words = req.body.words;
                if (words && words.length > 0) {
                    words.forEach((word) => __awaiter(this, void 0, void 0, function* () {
                        var _g;
                        const newWord = yield new GeneralWord_1.default({
                            word: word.word,
                            translation: word.translation,
                            language: (_g = user.currentLanguage) === null || _g === void 0 ? void 0 : _g._id,
                            assignedGroups: word.assignedGroups,
                            user: user._id
                        }).save();
                    }));
                }
                const generalWords = yield GeneralWord_1.default.find({ language: (_f = user.currentLanguage) === null || _f === void 0 ? void 0 : _f._id });
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
//# sourceMappingURL=words.js.map