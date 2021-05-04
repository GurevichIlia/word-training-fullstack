import { VerbForConjugation } from './../interfaces';
import { Request, Response } from "express";
import path from 'path';
import { replaceCharacters } from '../helper-functions/replace-characters';
import { Conjugation, IRequestUserInfo, VerbFromCSV, VerbModel, WordModel } from '../interfaces';
import { CSVtoJson } from '../utils/csv-to-json';
import errorHandler from '../utils/errorHandler';
import { FileHandler } from '../utils/file-handler';
import { getGroups } from './words';
import { VerbParser } from '../utils/verbParser';
import Word from '../Models/Word';

// import  VerbParser  from './../utils/puppeteer'

export class VerbsController {

      public getVerbs = async (req: Request, res: Response) => {
            try {
                  const user = req.user as IRequestUserInfo
                  console.log('PARAMS', user)
                  const verbs = await getVerbs(user)

                  res.status(200).json({ verbs, user, });
            } catch (error) {
                  errorHandler(res, error);
            }
      };

      public addVerbsFromCSV = async (req: Request, res: Response) => {
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
                  const verbsFromCSV: VerbFromCSV[] = await CSVtoJson.createJsonArray(filePath)

                  const assignedGroups = JSON.parse(req?.query?.assignedGroups)

                  for await (let verb of verbsFromCSV) {

                        if (verb && verb.verb) {
                              const { i, you_female, you_plural, you_male, we, she, he, they, time } = verb

                              const conjugation: Conjugation = { i, you_female, you_plural, you_male, we, she, he, they, time, verb: verb.verb }

                              const newVerb: WordModel = await new Word({
                                    isFavorite: false,
                                    word: replaceCharacters(verb.verb),
                                    translation: replaceCharacters(verb.translation || verb.verb),
                                    language: user.currentLanguage?._id,
                                    user: user._id,
                                    assignedGroups: assignedGroups ? assignedGroups : [],
                                    conjugations: {
                                          [time]: conjugation
                                    }
                              });

                              const isExist = await Word.exists({
                                    user: user._id,
                                    language: newVerb.language,
                                    word: newVerb.word,
                              })
                              if (!isExist) {
                                    await newVerb.save()
                              } else {
                                    await Word.findOneAndUpdate({ user: user._id, word: newVerb.word, translation: newVerb.translation }, { assignedGroups: newVerb.assignedGroups, conjugations: { [time]: conjugation } })
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

                  const words = await getVerbs(user)
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

      public getConjugationForVerb = async (req: Request, res: Response) => {
            try {
                  const user = req.query as any
                  console.log('PARAMS', user)
                  const verbs = await getVerbs(user)

                  res.status(200).json({ verbs, user, });
            } catch (error) {
                  errorHandler(res, error);
            }
      };

      public getConjugationForVerbFromCSV = async (req: Request, res: Response) => {
            try {
                  const csvFile = req.file;

                  const filePath = process.env.NODE_ENV === 'production' ? `${csvFile.path}` : `${path.resolve()}/${csvFile.path}`
                  console.log('PATH', csvFile.path)

                  const verbsFromCSV: VerbForConjugation[] = await CSVtoJson.createJsonArray(filePath)
                  console.log(verbsFromCSV[0].word)


                  if (!verbsFromCSV[0].word) {
                        throw new Error('Invalid file structure. Missed column "word"')
                  }

                  const verbsFromCSVasStr = verbsFromCSV.map(verb => verb.word)
                  const verbsParser = new VerbParser(verbsFromCSVasStr)
                  const verbsAsPromise = await verbsParser.parseVerbs()

                  const fileHandler = new FileHandler()

                  fileHandler.deleteFile(filePath)

                  await Promise.all(verbsAsPromise).then(verbs => {
                        // console.log('VERBs', verbs)

                        res.status(200).json({ verbs, });
                  }).catch(e => console.log('ERROR IN', e))

            } catch (error) {
                  errorHandler(res, error);
            }
      };

      public saveVerb = async (req: Request, res: Response) => {
            try {
                  const user = req.query as any
                  console.log('PARAMS', user)
                  const verbs = await getVerbs(user)

                  res.status(200).json({ verbs, user, });
            } catch (error) {
                  errorHandler(res, error);
            }
      };


}

async function getVerbs(user: IRequestUserInfo): Promise<WordModel[]> {

      return (await Word.find({ user: user, language: user.currentLanguage?._id })).reverse() as WordModel[]

}