import { Request, Response } from "express";
import path from 'path';
import { replaceCharacters } from '../helper-functions/replace-characters';
import { Conjugation, IRequestUserInfo, SaveVerbsRequestData, VerbFromCSV, WordModel } from '../interfaces';
import HebrewConjugationsCacheStore from '../Models/VerbWithConjugation';
import Word from '../Models/Word';
import { CSVtoJson } from '../utils/csv-to-json';
import errorHandler from '../utils/errorHandler';
import { FileHandler } from '../utils/file-handler';
import { replaceNekudot } from '../utils/replace-nekudot';
import { VerbParser } from '../utils/verbParser';
import { VerbsCacheHandler } from '../utils/VerbsCacheHandler';
import { VerbForConjugation, VerbTime, VerbWithConjugations, VerbsInCache } from './../interfaces';
import { getGroups } from './words';

// import  VerbParser  from './../utils/puppeteer'
const VERBS_CACHE_ID = '60a11278bc892726a0adf982'
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

      public getConjugationForVerbs = async (req: Request, res: Response) => {
            try {
                  const allVerbs: string[] = req.body.verbs || []
                  const DEFAULT_TIME: VerbTime[] = ['future', 'past']
                  const requestedVerbTime: VerbTime[] = req.body.times

                  let verbsCache = await HebrewConjugationsCacheStore.findOne({ _id: VERBS_CACHE_ID })


                  if (!verbsCache?.verbsInCache) {
                        verbsCache = await new HebrewConjugationsCacheStore({
                              verbsInCache: new Map()
                        }).save()
                  }

                  const conjugationCache = new VerbsCacheHandler(allVerbs, verbsCache.verbsInCache, requestedVerbTime || DEFAULT_TIME)
                  const verbsNotInCache = conjugationCache.verbsNotInCacheCache
                  const verbsFromCache = conjugationCache.verbsFromCache

                  if (verbsNotInCache.length === 0) {
                        const verbs = verbsFromCache
                        res.status(200).json({ verbs });
                        return
                  }

                  const verbsParser = new VerbParser(verbsNotInCache, requestedVerbTime || DEFAULT_TIME)
                  const verbsWithConjugationsAsPromise = await verbsParser.parseVerbs()

                  await Promise.all(verbsWithConjugationsAsPromise.verbsAsPromise).then(verbsNoFromCache => {
                        verbsWithConjugationsAsPromise.browser.close().then(_ => console.log('Browser close in the end'))

                        const verbs = [...verbsNoFromCache, ...verbsFromCache]
                        res.status(200).json({ verbs });

                        conjugationCache.updateVerbsCache(verbs, verbsCache as VerbsInCache)

                  }).catch(e => console.log('ERROR IN', e))



            } catch (error) {
                  errorHandler(res, error);
            }
      };

      public getConjugationForVerbFromCSV = async (req: Request, res: Response) => {
            try {
                  const DEFAULT_TIME: VerbTime[] = ['future', 'past']
                  const csvFile = req.file;
                  const requestedVerbTime: VerbTime[] = JSON.parse(req.query.times)
                  let verbsCache = await HebrewConjugationsCacheStore.findOne({ _id: VERBS_CACHE_ID })


                  if (!verbsCache?.verbsInCache) {
                        verbsCache = await new HebrewConjugationsCacheStore({
                              verbsInCache: new Map()
                        }).save()
                  }

                  const filePath = process.env.NODE_ENV === 'production' ? `${csvFile.path}` : `${path.resolve()}/${csvFile.path}`

                  const verbsFromCSV: VerbForConjugation[] = await CSVtoJson.createJsonArray(filePath) || []
                  console.log(verbsFromCSV[0].word)


                  if (!verbsFromCSV[0].word) {
                        throw new Error('Invalid file structure. Missed column "word"')
                  }

                  const verbsFromCSVasStr = verbsFromCSV.map(verb => verb.word)
                  const conjugationCache = new VerbsCacheHandler(verbsFromCSVasStr, verbsCache.verbsInCache, requestedVerbTime || DEFAULT_TIME)
                  const verbsNotInCache = conjugationCache.verbsNotInCacheCache
                  const verbsFromCache = conjugationCache.verbsFromCache

                  if (verbsNotInCache.length === 0) {
                        const verbs = verbsFromCache
                        res.status(200).json({ verbs });
                        return
                  }

                  const verbsParser = new VerbParser(verbsFromCSVasStr, requestedVerbTime)
                  const verbsWithConjugationsAsPromise = await verbsParser.parseVerbs()

                  const fileHandler = new FileHandler()

                  fileHandler.deleteFile(filePath)

                  await Promise.all(verbsWithConjugationsAsPromise.verbsAsPromise).then(verbsNoFromCache => {
                        verbsWithConjugationsAsPromise.browser.close().then(_ => console.log('Browser close in the end'))


                        const verbs = [...verbsNoFromCache, ...verbsFromCache]

                        res.status(200).json({ verbs });

                        conjugationCache.updateVerbsCache(verbs, verbsCache as VerbsInCache)

                  }).catch(e => console.log('ERROR IN', e))


            } catch (error) {
                  errorHandler(res, error);
            }
      };

      public saveVerbs = async (req: Request, res: Response) => {
            try {
                  const user = req.user as IRequestUserInfo
                  const { verbs, assignedGroups } = req.body as SaveVerbsRequestData
                  if (!verbs) return

                  for await (let word of verbs) {

                        if (word && word.verb) {
                              const { past, present, future } = word
                              const newWord: WordModel = await new Word({
                                    isFavorite: false,
                                    word: replaceCharacters(word.verb),
                                    translation: replaceCharacters(word.translation || ''),
                                    language: user.currentLanguage?._id,
                                    user: user._id,
                                    isVerb: true,
                                    conjugations: { past, present, future },
                                    assignedGroups: assignedGroups ? assignedGroups : []
                              });

                              const existingWord = await Word.findOne({
                                    user: user._id,
                                    language: newWord.language,
                                    word: newWord.word,
                                    translation: newWord.translation
                              })

                              console.log('IS EXIST', existingWord)
                              if (!existingWord) {
                                    await newWord.save()
                              } else {
                                    await Word.findOneAndUpdate({
                                          user: user._id,
                                          word: newWord.word,
                                          translation: newWord.translation
                                    }, {
                                          assignedGroups: [...existingWord.assignedGroups, ...newWord.assignedGroups]
                                    })
                              }
                              // await newWord.save()
                        }
                  }

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


}

async function getVerbs(user: IRequestUserInfo): Promise<WordModel[]> {

      return (await Word.find({ user: user, language: user.currentLanguage?._id })).reverse() as WordModel[]

}







// let input = "לִרְאוֹת";
// console.log(input)
// console.log(input.replace(/[\u0591-\u05C7]/g, ''));