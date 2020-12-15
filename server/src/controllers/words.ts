import { Request, Response } from "express";
import path from "path";
import { UserModel, WordModel } from "../interfaces";
import GeneralWord from "../Models/GeneralWord";
import User from "../Models/User";
import Word from "../Models/Word";
import errorHandler from "../utils/errorHandler";
import { FileHandler } from '../utils/file-handler';
import { getWordsByLanguage } from './../helper-functions/index';
import { GeneralWord as GeneralWordModel } from './../interfaces';
import { CSVtoJson } from './../utils/csv-to-json';

const fileHandler = new FileHandler()



export class WordsController {
    public getAllWordsForCurrentUser = async (req: Request, res: Response) => {
        try {
            // const user = await User.findOne({ _id: req.user }) as UserModel
            // const currentUserLanguage = user.currentLanguage;
            // if (!currentUserLanguage) throw new Error('Language does not exists')

            // const words = await Word.find({
            //     user: user._id,
            //     language: currentUserLanguage._id,

            // });

            const user = await User.findOne({ _id: req.user }) as UserModel
            const currentUserLanguage = user.currentLanguage;

            if (!currentUserLanguage) throw new Error('Language does not exists')

            if (user.wordsForBackup.length === 0) {
                user.wordsForBackup = [...user.words]
            }

            const words = getWordsByLanguage(currentUserLanguage._id, user.words)


            res.status(200).json({ words, user });
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
            const currentUserLanguage = user.currentLanguage

            if (!currentUserLanguage) throw new Error('Language does not exists')

            // if (!updatedUser || !updatedUser.currentLanguage) throw new Error('User or language does not exists')

            const isExistWord = user.words.find(word => word.word === req.body.word && word.translation === req.body.translation);

            if (isExistWord) {
                res.status(403).json({ newWord: isExistWord, message: 'Word already exists' });
                return
            }

            const newWord: WordModel = await new Word({
                word: req.body.word,
                translation: req.body.translation,
                isFavorite: req.body.isFavorite,
                language: currentUserLanguage._id,
                user: user._id,
                assignedGroups: req.body.assignedGroups ? req.body.assignedGroups : []
            });
            console.log('NEW WORD', typeof newWord._id)

            user.wordsForBackup.unshift(newWord)
            user.words.unshift(newWord)


            const updatedUser = await User.findOneAndUpdate({ _id: user.id }, { $set: user }, { new: true })

            if (!updatedUser) throw new Error('User does not exists')

            const words = getWordsByLanguage(currentUserLanguage._id, updatedUser.words)

            res.status(201).json({ words, message: 'Successfully added', user: updatedUser, userOlder: user });
        } catch (error) {
            errorHandler(res, error);
        }
    };

    public addWordsFromCSV = async (req: Request, res: Response) => {
        try {
            const user: UserModel = await User.findOne({ _id: req.user }) as UserModel;
            const currentUserLanguage = user.currentLanguage
            if (!currentUserLanguage) throw new Error('Language does not exists')

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
                    language: currentUserLanguage._id,
                    assignedGroups: assignedGroups ? assignedGroups : []
                });
                user.words.unshift(newWord)
            })

            fileHandler.deleteFile(filePath)

            // const words = await new Word().collection.insertMany(wordsFromCSV);

            // user.words = [...user.words, ...words.ops]

            const updatedUser = await User.findOneAndUpdate({ _id: user.id }, { $set: user }, { new: true })
            const words = getWordsByLanguage(currentUserLanguage._id, updatedUser?.words || [])
            res.status(201).json(words);
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

            const currentUserLanguage = user.currentLanguage
            if (!currentUserLanguage) throw new Error('Language does not exists')

            // // let wordsByLanguage = user.words.filter(word => checkByLanguage(word.language, currentUserLanguage._id));
            let words = [...user.words]
            // console.log(' WORDS TO UPDATE', wordsToUpdate)

            user.words = words.map(word => {
                const foundWord = wordsToUpdate.find(wordToUpdate => {

                    // console.log(wordToUpdate._id, word._id)
                    // console.log(typeof wordToUpdate._id, typeof word._id)
                    // console.log(wordToUpdate.word, word.word)
                    return wordToUpdate._id.toString() === word._id.toString()
                })

                if (foundWord) {

                    return { ...foundWord }
                }

                return word
            }) as WordModel[]
     

            const updatedUser = await User.findOneAndUpdate({ _id: req.user }, { $set: user }, { new: true })

            const wordsByLanguage = getWordsByLanguage(currentUserLanguage._id, updatedUser?.words || [])

            res.status(201).json(wordsByLanguage);
        } catch (error) {
            errorHandler(res, error);
        }
    };


    public editWordByIdForCurrentUser = async (req: Request, res: Response) => {
        try {

            const user = await User.findOne({ _id: req.user }) as UserModel;

            const editedWord = req.body


            user.words = user.words.map(word => {
                return word._id == editedWord._id ? { ...word, ...editedWord } : word
            })

            const updatedUser = await User.findOneAndUpdate({ _id: user.id }, { $set: user }, { new: true })
            // const editedWord = await Word.findOneAndUpdate(
            //     { _id: req.body._id },
            //     { $set: req.body },
            //     { new: true }
            // )

            if (!updatedUser || !updatedUser.currentLanguage) throw new Error('User or language does not exists')

            const words = getWordsByLanguage(updatedUser.currentLanguage._id, updatedUser?.words)


            res.status(200).json({ words })
        } catch (error) {
            errorHandler(res, error);
        }
    };

    public deleteWordByIdForCurrentUser = async (req: Request, res: Response) => {
        try {
            const user = await User.findOne({ _id: req.user }) as UserModel;
            user.words = user.words.filter(word => word._id.toString() !== req.params.wordId)

            const updatedUser = await User.findOneAndUpdate({ _id: user.id }, { $set: user }, { new: true })
            // console.log('USER UPDATED', new Date().getTime())


            if (!updatedUser || !updatedUser.currentLanguage) throw new Error('User or language does not exists')

            const words = getWordsByLanguage(updatedUser.currentLanguage._id, updatedUser?.words)

            res.status(200).json({
                words,
                message: 'Removed'
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
            const user: UserModel = await User.findOne({ _id: req.user }) as UserModel;

            const currentUserLanguage = user.currentLanguage
            if (!currentUserLanguage) throw new Error('Language does not exists')

            const words = await GeneralWord.find({ language: currentUserLanguage._id });
            res.status(200).json(words);
        } catch (error) {
            errorHandler(res, error)
        }
    }

    public addWordsToGeneralList = async (req: Request, res: Response) => {
        try {
            const user: UserModel = await User.findOne({ _id: req.user }) as UserModel;

            const currentUserLanguage = user.currentLanguage
            if (!currentUserLanguage) throw new Error('Language does not exists')

            const words = req.body.words as GeneralWordModel[]

            if (words && words.length > 0) {
                words.forEach(async word => {
                    const newWord = await new GeneralWord({
                        word: word.word,
                        translation: word.translation,
                        language: currentUserLanguage._id,
                        assignedGroups: word.assignedGroups,
                        user: user._id
                    }).save();
                })
            }

            const generalWords = await GeneralWord.find({ language: currentUserLanguage._id })



            res.status(201).json({ addedWord: '', generalWords });
        } catch (error) {
            errorHandler(res, error);
        }
    };


    public deleteWordFromGeneralList = async (req: Request, res: Response) => {
        try {
            console.log('WORD ID', req.query.wordId)
            const deletedWord = await GeneralWord.findOneAndRemove({ _id: req.query.wordId })
            const user: UserModel = await User.findOne({ _id: req.user }) as UserModel;

            const currentUserLanguage = user.currentLanguage
            if (!currentUserLanguage) throw new Error('Language does not exists')

            const words = await GeneralWord.find({ language: currentUserLanguage._id.toString() });

            if (deletedWord) {
                res.status(200).json({
                    words,
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


function checkByLanguage(language: string | object, language2: string | object): boolean {
    return language.toString() === language2.toString()
}
// this.router.get("words/getAllWords", this.wordsController);
// this.router.get("words/getWordById", this.wordsController);
// this.router.post("words/addNewWord", this.wordsController);
// this.router.patch("words/editWordById", this.wordsController);
// this.router.delete("words/deleteWordById", this.wordsController);
