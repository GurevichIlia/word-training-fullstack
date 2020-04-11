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
class WordsController {
    constructor() {
        this.getAllWords = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const words = yield Word_1.default.find({
                    language: req.params.languageId,
                    user: user._id
                });
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
        //     }
        // };
        this.createNewWord = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const newWord = yield new Word_1.default({
                    word: req.body.word,
                    translation: req.body.translation,
                    isFavorite: req.body.isFavorite,
                    language: req.params.languageId,
                    user: req.user
                }).save();
                res.status(201).json(newWord);
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
        this.editWordById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const editedWord = yield Word_1.default.findOneAndUpdate({ _id: req.body._id }, { $set: req.body }, { new: true });
                res.status(200).json(editedWord);
            }
            catch (error) {
                errorHandler_1.default(res, error);
            }
        });
        this.deleteWordById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedWord = yield Word_1.default.findOneAndRemove({ _id: req.params.wordId });
                res.status(200).json({
                    word: deletedWord,
                    message: 'Removed'
                });
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