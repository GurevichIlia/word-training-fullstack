import { Request, Response } from "express";
import path from "path";
import { getAllUserGroups } from '../helper-functions/groups.heplers';
import { GeneralWord as GeneralWordModel, IRequestUserInfo, IUserWordGroup, UserModel, WordModel } from "../interfaces";
import GeneralWord from "../Models/GeneralWord";
import User from "../Models/User";
import Word from "../Models/Word";
import WordGroup from '../Models/WordGroup';
import errorHandler from "../utils/errorHandler";
import { FileHandler } from '../utils/file-handler';
import { CSVtoJson } from './../utils/csv-to-json';


export class WordsController {
    public getAllWordsForCurrentUser = async (req: Request, res: Response) => {
        try {
            const user = req.user as IRequestUserInfo

            const words = await getWords(user)

            res.status(200).json({ words, user, });
        } catch (error) {
            errorHandler(res, error);
        }
    };

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


    public createNewWordForUser = async (req: Request, res: Response) => {
        try {

            const user = req.user as IRequestUserInfo

            const newWord: WordModel = await new Word({
                word: req.body.word,
                translation: req.body.translation,
                isFavorite: req.body.isFavorite,
                language: user.currentLanguage?._id,
                user: user._id,
                assignedGroups: req.body.assignedGroups ? req.body.assignedGroups : []
            })

            const isExist = await Word.exists({ user: user._id, word: newWord.word, translation: newWord.translation })
            if (!isExist) {
                await newWord.save()
            } else {
                const words = await getWords(user)
                res.status(403).json({ words, message: 'Word already exists' });
                return
            };

            console.log('new word', newWord)

            const words = await getWords(user)
            const groups = await getGroups(user, words)

            res.status(201).json({ words, groups, message: 'Successfully added' });
        } catch (error) {
            errorHandler(res, error);
        }
    };

    public addWordsFromCSV = async (req: Request, res: Response) => {
        try {
            // const user: UserModel = await User.findOne({ _id: req.user }) as UserModel;
            // const currentUserLanguage = user.currentLanguage
            // if (!currentUserLanguage) throw new Error('Language does not exists')

            // multer({ dest: "./uploads/" }).single("csvFile"), (file) => {
            //     return file
            // },


            const user = req.user as IRequestUserInfo

            const csvFile = req.file;

            const filePath = process.env.NODE_ENV === 'production' ? `${csvFile.path}` : `${path.resolve()}/${csvFile.path}`
            console.log('PATH', csvFile.path)
            const wordsFromCSV = await CSVtoJson.createJsonArray(filePath)

            const assignedGroups = JSON.parse(req.query.assignedGroups)


            for await (let word of wordsFromCSV) {

                if (word && word.Translation && word.Word) {
                    const newWord: WordModel = await new Word({
                        isFavorite: false,
                        word: word.Word,
                        translation: word.Translation,
                        language: user.currentLanguage?._id,
                        user: user._id,
                        assignedGroups: assignedGroups ? assignedGroups : []
                    });

                    const isExist = await Word.exists({
                        user: user._id,
                        language: newWord.language,
                        word: newWord.word,
                        translation: newWord.translation
                    })

                    console.log('IS EXIST', isExist)
                    if (!isExist) {
                        await newWord.save()
                    } else {
                        await Word.findOneAndUpdate({ user: user._id, word: newWord.word, translation: newWord.translation }, { assignedGroups: newWord.assignedGroups })
                    }
                    // await newWord.save()
                }
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
            const fileHandler = new FileHandler()

            fileHandler.deleteFile(filePath)

            const words = await getWords(user)
            const groups = await getGroups(user, words)

            // const words = await new Word().collection.insertMany(wordsFromCSV);

            // user.words = [...user.words, ...words.ops]

            // const updatedUser = await User.findOneAndUpdate({ _id: user.id }, { $set: user }, { new: true })
            // const words = getWordsByLanguage(currentUserLanguage._id, updatedUser?.words || [])
            res.status(201).json({ words, groups });
        } catch (error) {
            errorHandler(res, error);
        }
    }

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

    public updateUserWords = async (req: Request, res: Response) => {
        try {

            const wordsToUpdate = req.body.words as WordModel[];

            const user = req.user as IRequestUserInfo

            const currentUserLanguage = user.currentLanguage
            if (!currentUserLanguage) throw new Error('Language does not exists')

            for (let word of wordsToUpdate) {
                await Word.findOneAndUpdate({ _id: word._id }, { $set: word })
            }

            const words = await getWords(user)
            const groups = await getGroups(user, words)
            res.status(201).json({ words, groups });
        } catch (error) {
            errorHandler(res, error);
        }
    };


    public editWordByIdForCurrentUser = async (req: Request, res: Response) => {
        try {
            const user = req.user as IRequestUserInfo

            const editedWord = req.body as Pick<WordModel, '_id' | 'translation' | 'word' | 'isFavorite'>

            const updatedWord = await Word.findOneAndUpdate({ _id: editedWord._id }, { $set: editedWord }, { new: true })

            const words = await getWords(user)

            const groups = await getGroups(user, words)
            // Send groups back to client to update state if quantity of words changed
            // Because we use this method to delete word from a group


            res.status(200).json({ words, groups })
        } catch (error) {
            errorHandler(res, error);
        }
    };

    public deleteWordByIdForCurrentUser = async (req: Request, res: Response) => {
        try {
            const user = req.user as IRequestUserInfo

            const wordIdToDelete = req.params.wordId

            await Word.findByIdAndRemove({ _id: wordIdToDelete })

            const words = await getWords(user)
            const groups = await getGroups(user, words)
            res.status(200).json({
                words,
                groups,
                message: 'Removed'
            })
        } catch (error) {
            errorHandler(res, error);
        }
    };

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

    public getGeneralWords = async (req: Request, res: Response) => {
        try {
            const user = req.user as IRequestUserInfo

            const currentUserLanguage = user.currentLanguage
            if (!currentUserLanguage) throw new Error('Language does not exists')

            const words = await (await GeneralWord.find({ language: currentUserLanguage._id })).reverse();
            res.status(200).json(words);
        } catch (error) {
            errorHandler(res, error)
        }
    }

    public addWordsToGeneralList = async (req: Request, res: Response) => {
        try {
            const user = req.user as IRequestUserInfo

            const words = req.body.words as GeneralWordModel[]

            if (words && words.length > 0) {

                if (words.length === 1) {
                    const word = words[0]
                    const updatedWord = await Word.findByIdAndUpdate(word._id, { isShared: true }, { new: true })
                    const newWord = new GeneralWord({
                        word: word.word,
                        translation: word.translation,
                        language: user.currentLanguage?._id,
                        assignedGroups: word.assignedGroups,
                        user: user._id,
                        originId: word._id
                    }).save();

                } else if (words.length > 1) {
                    for (let word of words) {
                        const updatedWord = await Word.findByIdAndUpdate(word._id, { isShared: true }, { new: true })
                        const newWord = new GeneralWord({
                            word: word.word,
                            translation: word.translation,
                            language: user.currentLanguage?._id,
                            assignedGroups: word.assignedGroups,
                            user: user._id,
                            originId: word._id
                        }).save();

                    }
                }


                // words.forEach(async word => {
                //     const newWord = await new GeneralWord({
                //         word: word.word,
                //         translation: word.translation,
                //         language: user.currentLanguage?._id,
                //         assignedGroups: word.assignedGroups,
                //         user: user._id
                //     }).save();
                // })
            }

            const generalWords = await GeneralWord.find({ language: user.currentLanguage?._id })
            const userWords = await getWords(user)


            res.status(201).json({ addedWord: '', generalWords, userWords });
        } catch (error) {
            errorHandler(res, error);
        }
    };

    public deleteWordFromGeneralList = async (req: Request, res: Response) => {
        try {
            const user = req.user as IRequestUserInfo

            const deletedWord = await GeneralWord.findOneAndRemove({ _id: req.query.wordId })
            const updatedWord = await Word.findOneAndUpdate({
                user: user._id,
                _id: deletedWord?.originId
            }, { isShared: false }, { new: true })

            const currentUserLanguage = user.currentLanguage
            if (!currentUserLanguage) throw new Error('Language does not exists')

            const generalWords = await (await GeneralWord.find({ language: currentUserLanguage._id.toString() })).reverse();
            const userWords = await getWords(user)
            console.log('Updated word', updatedWord)

            if (deletedWord) {
                res.status(200).json({
                    generalWords,
                    userWords,
                    word: deletedWord,
                    message: 'Removed'
                })
            } else {
                throw new Error('Word not found')
            }

        } catch (error) {
            errorHandler(res, error);
        }
    };
}


async function getWords(user: IRequestUserInfo): Promise<WordModel[]> {

    return (await Word.find({ user: user, language: user.currentLanguage?._id })).reverse() as WordModel[]

}

async function getGroups(user: IRequestUserInfo, words: WordModel[]): Promise<IUserWordGroup[]> {
    const currentUserLanguage = user.currentLanguage
    if (!currentUserLanguage) throw new Error('Language does not exists')

    const userGroups = await WordGroup.find({
        language: currentUserLanguage._id,
        user: user
    });
    const groups = getAllUserGroups(userGroups, currentUserLanguage._id, words)

    return groups
}

