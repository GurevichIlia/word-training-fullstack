import { Request, Response } from "express";
import errorHandler from "../utils/errorHandler";
import Word from "../Models/Word";
import { WordModel, UserModel } from "../interfaces";
import User from "../Models/User";
import GeneralWord from "../Models/GeneralWord";

export class WordsController {
    public getAllWordsForCurrentUser = async (req: Request, res: Response) => {
        try {
            // const user = req.user as { _id: string, email: string }
            // const words = await Word.find({
            //     language: req.query.languageId,
            //     user: user._id
            // });

            const user = await User.findOne({ _id: req.user }) as UserModel

            const words = user.words.filter(word => word.language == req.query.languageId);

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

    public createNewWordForUser = async (req: Request, res: Response) => {
        try {
            const user: UserModel = await User.findOne({ _id: req.user }) as UserModel;
            const newWord: WordModel = await new Word({
                word: req.body.word,
                translation: req.body.translation,
                isFavorite: req.body.isFavorite,
                language: req.query.languageId,
            });


            user.words.unshift(newWord)

            const updatedUser = await User.findOneAndUpdate({ _id: user.id }, { $set: user }, { new: true })
            res.status(201).json({ newWord, updatedUser });
        } catch (error) {
            errorHandler(res, error);
        }
    };

    public addNewWords = async (req: Request, res: Response) => {
        try {
            const user: UserModel = await User.findOne({ _id: req.user }) as UserModel;
            const newWords = req.body.words
            const words = await new Word().collection.insertMany(newWords);

            user.words = [...user.words, ...words.ops]

            const updatedUser = await User.findOneAndUpdate({ _id: user.id }, { $set: user }, { new: true })

            res.status(201).json(updatedUser?.words);
        } catch (error) {
            errorHandler(res, error);
        }
    }

    public updateUserWords = async (req: Request, res: Response) => {
        try {

            const wordsToUpdate = req.body.words as WordModel[];

            const user = await User.findOne({ _id: req.user }) as UserModel

            const words = user.words.filter(word => word.language == req.query.languageId);

            const updatedWords = wordsToUpdate.map(word => {

                const findedWord = words.find(existWord => existWord.id === word.id);

                if (findedWord) {
                    return { ...findedWord, ...word }
                } else {
                    return word;
                }

            })


            user.words = updatedWords as WordModel[]

            const updatedUser = await User.findOneAndUpdate({ _id: req.user }, { $set: user }, { new: true })


            // const updatedWord = await Word.findOneAndUpdate({ _id: word._id }, { $set: word })
            // return updatedWord

            // // const user = req.user as { _id: string, email: string }

            // const test = await Promise.all(promises);

            // const updatedWords = await Word.find({
            //     language: req.query.languageId,
            //     user: user._id
            // });

            // console.log()

            res.status(201).json(updatedUser);
        } catch (error) {
            errorHandler(res, error);
        }
    };


    public editWordByIdForCurrentUser = async (req: Request, res: Response) => {
        try {

            const user = await User.findOne({ _id: req.user }) as UserModel;

            const editedWord = req.body
            console.log('EDITED WORD', editedWord)

            user.words = user.words.map(word => {
                return word._id == editedWord._id ? { ...word, ...editedWord } : word
            })

            const updatedUser = await User.findOneAndUpdate({ _id: user.id }, { $set: user }, { new: true })
            // const editedWord = await Word.findOneAndUpdate(
            //     { _id: req.body._id },
            //     { $set: req.body },
            //     { new: true }
            // )
            res.status(200).json(editedWord)
        } catch (error) {
            errorHandler(res, error);
        }
    };

    public deleteWordByIdForCurrentUser = async (req: Request, res: Response) => {
        try {
            const user = await User.findOne({ _id: req.user }) as UserModel;

            const deletedWordIndex = user.words.findIndex(word => word._id.toString() == req.params.wordId)
            const deletedWord = user.words.splice(deletedWordIndex, 1)
            const updatedUser = await User.findOneAndUpdate({ _id: user.id }, { $set: user }, { new: true })

            res.status(200).json({
                word: deletedWord,
                message: 'Removed'
            })
        } catch (error) {
            errorHandler(res, error);
        }
    };


    public addWordsToGeneralList = async (req: Request, res: Response) => {
        try {

            const newWords: [] = req.body.words
            const words = await new GeneralWord().collection.insertMany(newWords);

            res.status(201).json(words);

        } catch (error) {
            errorHandler(res, error)
        }
    }

    public getGeneralWords = async (req: Request, res: Response) => {
        try {
            const words = await Word.find({ language: req.query.languageId });
            console.log('GENERAL WORDS', words)
            res.status(200).json(words);
        } catch (error) {
            errorHandler(res, error)
        }
    }
    // public deleteWordById = async (req: Request, res: Response) => {
    //     try {
    //         const deletedWord = await Word.findOneAndRemove({ _id: req.params.wordId })
    //         res.status(200).json({
    //             word: deletedWord,
    //             message: 'Removed'
    //         })
    //     } catch (error) {
    //         errorHandler(res, error);
    //     }
    // };
}

// this.router.get("words/getAllWords", this.wordsController);
// this.router.get("words/getWordById", this.wordsController);
// this.router.post("words/addNewWord", this.wordsController);
// this.router.patch("words/editWordById", this.wordsController);
// this.router.delete("words/deleteWordById", this.wordsController);
