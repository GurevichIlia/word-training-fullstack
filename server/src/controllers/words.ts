import { Request, Response } from "express";
import path from "path";
import { UserModel, WordModel } from "../interfaces";
import GeneralWord from "../Models/GeneralWord";
import User from "../Models/User";
import Word from "../Models/Word";
import errorHandler from "../utils/errorHandler";
import { FileHandler } from '../utils/file-handler';
import { GeneralWord as GeneralWordModel } from './../interfaces';
import { CSVtoJson } from './../utils/csv-to-json';
import { convertArrToObject } from '../utils/add-word-to-user'

const fileHandler = new FileHandler()



export class WordsController {
    public getAllWordsForCurrentUser = async (req: Request, res: Response) => {
        try {
            // const user = req.user as { _id: string, email: string }
            // const words = await Word.find({
            //     language: req.query.languageId,
            // });

            const currentLanguage = req.query.languageId as string
            const user = await User.findOne({ _id: req.user }) as UserModel

            const words = user.wordsAsObject[currentLanguage].words || {}

            // const newwords = words.map(word => {
            //     word.assignedGroups.push('1')
            //     return word
            // })

            res.status(200).json(words);
        } catch (error) {
            errorHandler(res, error);
        }
    };

    // public getWordById = async (req: Request, res: Response) => {
    //     try {
    //     } catch (error) {
    //         errorHandler(res, error);
    //     }wsd
    // };

    public createNewWordForUser = async (req: Request, res: Response) => {
        try {
            const user: UserModel = await User.findOne({ _id: req.user }) as UserModel;

            const currentLanguageId = req.query.languageId

            if (!currentLanguageId) {
                throw new Error('Please select language')
            }

            if (Object.keys(user.wordsAsObject).length > 0 && user.wordsAsObject[currentLanguageId]) {
                const existWords = user.wordsAsObject[currentLanguageId].words

                if (existWords) {
                    const existingWordsIds = Object.keys(existWords)

                    const isExistWord = existingWordsIds.find(wordId => existWords[wordId].word === req.body.word && existWords[wordId].translation === req.body.translation);

                    if (isExistWord) {
                        res.status(403).json({ success: false, message: 'Word already exists' });
                        return
                    }
                } else {
                    user.wordsAsObject[currentLanguageId].words = {}
                }

            }
            const convertedWordFromArray = convertArrToObject(user.words);
            user.wordsAsObject = { ...user.wordsAsObject, ...convertedWordFromArray }


            const newWord: WordModel = await new Word({
                word: req.body.word,
                translation: req.body.translation,
                isFavorite: req.body.isFavorite,
                language: req.query.languageId,
                assignedGroups: req.body.assignedGroups ? req.body.assignedGroups : []
            });



            if (!user.wordsAsObject[currentLanguageId]) {
                user.wordsAsObject[currentLanguageId] = {
                    name: user.currentLanguage?.name || currentLanguageId,
                    words: {}
                }

                user.wordsAsObject[currentLanguageId].words[newWord._id] = newWord


            } else {
                user.wordsAsObject[currentLanguageId].words[newWord._id] = newWord

                if (user.wordsAsObject[currentLanguageId].name === 'test') {
                    user.wordsAsObject[currentLanguageId].name = user.currentLanguage?.name || currentLanguageId
                }
            }

         
            // user.words.unshift(newWord)

            const updatedUser = await User.findOneAndUpdate({ _id: user.id }, { $set: user }, { new: true })
            const words = updatedUser?.wordsAsObject[currentLanguageId].words || []
            res.status(201).json({ words, message: 'Successfully added' });
        } catch (error) {
            errorHandler(res, error);
        }
    };

    public addWordsFromCSV = async (req: Request, res: Response) => {
        try {
            const user: UserModel = await User.findOne({ _id: req.user }) as UserModel;
            // multer({ dest: "./uploads/" }).single("csvFile"), (file) => {
            //     return file
            // },
            const csvFile = req.file;
            console.log('FILE PATH', csvFile.path)
            const filePath = process.env.NODE_ENV === 'production' ? `${csvFile.path}` : `${path.resolve()}/${csvFile.path}`

            console.log('FILE PATH', filePath)
            const wordsFromCSV = await CSVtoJson.createJsonArray(filePath)
            console.log('ASSIGN GROUPS', req.query.assignedGroups)
            const assignedGroups = JSON.parse(req.query.assignedGroups)
            await wordsFromCSV.forEach(async word => {

                if (!word || !word.Translation || !word.Word) return

                const newWord: WordModel = await new Word({
                    word: word.Word,
                    translation: word.Translation,
                    language: req.query.languageId,
                    assignedGroups: assignedGroups ? assignedGroups : []
                });
                user.words.unshift(newWord)
            })

            fileHandler.deleteFile(filePath)

            // const words = await new Word().collection.insertMany(wordsFromCSV);

            // user.words = [...user.words, ...words.ops]

            const updatedUser = await User.findOneAndUpdate({ _id: user.id }, { $set: user }, { new: true })

            res.status(201).json(updatedUser);
        } catch (error) {
            errorHandler(res, error);
        }
    }

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

            res.status(201).json(updatedUser?.words);
        } catch (error) {
            errorHandler(res, error);
        }
    };


    public editWordByIdForCurrentUser = async (req: Request, res: Response) => {
        try {

            const user = await User.findOne({ _id: req.user }) as UserModel;

            const editedWord = req.body as WordModel

            const languageId = user.currentLanguage?._id

            if (languageId) {
                user.wordsAsObject[languageId].words[editedWord._id] = editedWord
            } else {
                throw new Error('Language is not exist')
            }


            const updatedUser = await User.findOneAndUpdate({ _id: user.id }, { $set: user }, { new: true })
            // const editedWord = await Word.findOneAndUpdate(
            //     { _id: req.body._id },
            //     { $set: req.body },
            //     { new: true }
            // )
            const words = updatedUser?.wordsAsObject[languageId].words || []
            res.status(200).json({ words, message: 'Successfully updated' })
        } catch (error) {
            errorHandler(res, error);
        }
    };

    public deleteWordByIdForCurrentUser = async (req: Request, res: Response) => {
        try {
            const user = await User.findOne({ _id: req.user }) as UserModel;
            const wordId = req.params.wordId
            const languageId = user.currentLanguage?._id

            if (languageId) {
                delete user.wordsAsObject[languageId].words[wordId]
            } else {
                throw new Error('Language is not exist')
            }

            // user.words = user.words.filter(word => word._id.toString() !== req.params.wordId)
            const updatedUser = await User.findOneAndUpdate({ _id: user.id }, { $set: user }, { new: true })
            const words = updatedUser?.wordsAsObject[languageId].words || []

            res.status(200).json({
                message: 'Removed',
                words: words
            })
        } catch (error) {
            errorHandler(res, error);
        }
    };


    // public addWordsToGeneralList = async (req: Request, res: Response) => {
    //     try {

    //         const newWords: [] = req.body.words
    //         const words = await new GeneralWord().collection.insertMany(newWords);

    //         res.status(201).json(words);

    //     } catch (error) {
    //         errorHandler(res, error)
    //     }
    // }

    public getGeneralWords = async (req: Request, res: Response) => {
        try {
            const words = await GeneralWord.find({ language: req.query.languageId });
            res.status(200).json(words);
        } catch (error) {
            errorHandler(res, error)
        }
    }

    public addWordsToGeneralList = async (req: Request, res: Response) => {
        try {
            const user: UserModel = await User.findOne({ _id: req.user }) as UserModel;

            const words = req.body.words as GeneralWordModel[]

            if (words && words.length > 0) {
                words.forEach(async word => {
                    const newWord = await new GeneralWord({
                        word: word.word,
                        translation: word.translation,
                        language: req.query.languageId,
                        assignedGroups: word.assignedGroups,
                        user: user._id
                    }).save();
                })
            }




            res.status(201).json({ addedWord: '' });
        } catch (error) {
            errorHandler(res, error);
        }
    };


    public deleteWordFromGeneralList = async (req: Request, res: Response) => {
        try {
            console.log('WORD ID', req.query.wordId)
            const deletedWord = await GeneralWord.findOneAndRemove({ _id: req.query.wordId })
            if (deletedWord) {
                res.status(200).json({
                    word: deletedWord,
                    message: 'Removed'
                })
            } else {
                throw new Error()
            }

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
