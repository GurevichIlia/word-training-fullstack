import { Request, Response } from "express";
import errorHandler from "../utils/errorHandler";
import Word from "../Models/Word";
import { WordModel } from "../interfaces";

export class WordsController {
    public getAllWords = async (req: Request, res: Response) => {
        try {
            const user = req.user as { _id: string, email: string }
            const words = await Word.find({
                language: req.params.languageId,
                user: user._id
            });

            res.status(200).json(words);
        } catch (error) {
            errorHandler(res, error);
        }
    };

    // public getWordById = async (req: Request, res: Response) => {
    //     try {
    //     } catch (error) {
    //         errorHandler(res, error);
    //     }
    // };

    public createNewWord = async (req: Request, res: Response) => {
        try {
            const newWord: WordModel = await new Word({
                word: req.body.word,
                translation: req.body.translation,
                isFavorite: req.body.isFavorite,
                language: req.params.languageId,
                user: req.user
            }).save();
            res.status(201).json(newWord);
        } catch (error) {
            errorHandler(res, error);
        }
    };

    public editWordById = async (req: Request, res: Response) => {
        try {
            const editedWord = await Word.findOneAndUpdate(
                { _id: req.body._id },
                { $set: req.body },
                { new: true }
            )
            res.status(200).json(editedWord)
        } catch (error) {
            errorHandler(res, error);
        }
    };

    public deleteWordById = async (req: Request, res: Response) => {
        try {
            const deletedWord = await Word.findOneAndRemove({ _id: req.params.wordId })
            res.status(200).json({
                word: deletedWord,
                message: 'Removed'
            })
        } catch (error) {
            errorHandler(res, error);
        }
    };

}

// this.router.get("words/getAllWords", this.wordsController);
// this.router.get("words/getWordById", this.wordsController);
// this.router.post("words/addNewWord", this.wordsController);
// this.router.patch("words/editWordById", this.wordsController);
// this.router.delete("words/deleteWordById", this.wordsController);
