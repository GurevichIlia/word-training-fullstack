import { Request, Response } from "express";
import { IUserWordGroup, UserModel, WordGroupModel, WordModel } from "../interfaces";
import User from "../Models/User";
import WordGroup, { ALL_WORDS_GROUP, FAVORITES } from "../Models/WordGroup";
import errorHandler from "../utils/errorHandler";
import { getWordsByLanguage } from './../helper-functions/index';

export class WordGroupController {

      public getAllWordGroups = async (req: Request, res: Response) => {
            try {
                  // const user = req.user as { _id: string, email: string }

                  const user = await User.findOne({ _id: req.user }) as UserModel;

                  const userGroups = await WordGroup.find({
                        language: req.query.languageId,
                        user: user
                  });

                  // let allGroups = [...this.getDefaultGroups(), ...userGroups]
                  // const words = getWordsByLanguage(req.query.languageId, user.words)
                  // this.setQuantityWordsInGroups(allGroups, words);
                  if (!user.currentLanguage) throw new Error('Language is not exists')

                  const groups = this.getAllUserGroups(userGroups, user.currentLanguage._id.toString(), user.words)

                  res.status(200).json(groups);
            } catch (error) {
                  errorHandler(res, error);
            }
      };



      public saveGroup = async (req: Request, res: Response) => {
            try {
                  const user = await User.findOne({ _id: req.user }) as UserModel;

                  const groupCondidate: { name: string, id: string, languageId: string } = req.body.group

                  if (!groupCondidate) return

                  let group: WordGroupModel;

                  if (groupCondidate.id) {

                        group = await WordGroup.findOneAndUpdate({ _id: groupCondidate.id }, { name: groupCondidate.name }, { new: true }) as WordGroupModel
                  } else {
                        console.log('NO ID')
                        console.log('LANGAUGE', groupCondidate.languageId, user.currentLanguage?._id)
                        group = await new WordGroup({
                              name: groupCondidate.name,
                              language: groupCondidate.languageId || user.currentLanguage?._id,
                              user: req.user
                        }).save();
                  }

                  const userGroups = await WordGroup.find({
                        language: groupCondidate.languageId || user.currentLanguage?._id,
                        user: user
                  });

                  if (!user.currentLanguage) throw new Error('Language is not exists')

                  const groups = this.getAllUserGroups(userGroups, user.currentLanguage?._id, user.words)

                  console.log('NEW GROUP', group)

                  res.status(201).json({
                        groups,
                        group: group
                  });
            } catch (error) {
                  errorHandler(res, error);
            }
      };

      public deleteWordGroup = async (req: Request, res: Response) => {
            try {
                  const user = await User.findOne({ _id: req.user }) as UserModel;

                  const removedGroup = await WordGroup.findOneAndRemove({ _id: req.body.groupId })

                  const userGroups = await WordGroup.find({
                        language: user.currentLanguage?._id,
                        user: user
                  });

                  if (!user.currentLanguage) throw new Error('Language is not exists')

                  const groups = this.getAllUserGroups(userGroups, user.currentLanguage?._id, user.words)

                  res.status(200).json({ groups })
            } catch (error) {
                  errorHandler(res, error);

            }
      }


      public assignGroup = async (req: Request, res: Response) => {
            try {
                  const groupIdForAssign = req.body.groupId as string;
                  const selectedWords = req.body.selectedWords as string[];
                  const user = await User.findOne({ _id: req.user }) as UserModel;
                
                  const language = user.currentLanguage

                  if (!language) throw new Error('Language does not exists')

                  selectedWords.forEach(wordId => {

                        const existingWords = [...user.words]

                        user.words = existingWords.map(word => {

                              if (word._id.toString() == wordId) {
                                    if (!word.assignedGroups.includes(groupIdForAssign)) {
                                          const groups = [...word.assignedGroups]
                                          groups.push(groupIdForAssign)
                                          const newWord = { ...word, assignedGroups: groups }

                                          return newWord;
                                    } else {
                                          return word
                                    }

                              } else {
                                    return word
                              }


                        }) as WordModel[]




                  })
                  const userGroups = await WordGroup.find({
                        language: language._id,
                        user: user
                  });
                  const updatedUser = await User.findOneAndUpdate({ _id: user._id }, { $set: user }, { new: true });

                  const words = getWordsByLanguage(language._id, updatedUser?.words || [])
                  const groups = this.getAllUserGroups(userGroups, language._id.toString(), user.words)


                  res.status(200).json({
                        groups: groups,
                        wordsAfterAssign: words,
                        message: 'Group assigned'
                  })

            } catch (error) {
                  errorHandler(res, error);

            }
      }

      getDefaultGroups() {
            return [ALL_WORDS_GROUP, FAVORITES] as WordGroupModel[]
      }

      private setQuantityWordsInGroups = (groups: WordGroupModel[], words: WordModel[]): IUserWordGroup[] => {
            if (!words || words.length === 0) return groups

            const updatedGroups = groups.map(group => {
                  if (group._id == '1') {
                        const newGroup = { ...group, wordQuantity: words.length };

                        return newGroup
                  }

                  if (group._id == '2') {
                        const newGroup = {
                              ...group, wordQuantity: words.filter(word => word.isFavorite === true).length
                        };
                        return newGroup
                  }

                  const quantity = words.filter(word => word.assignedGroups.includes(group._id.toString()));
                  group.wordQuantity = quantity.length
                  // console.log('COUNTED WORDS GROUPS', words.filter(word => console.log(word.assignedGroups[1], group._id)).length)

                  return group;
            });

            return updatedGroups;

      }

      getAllUserGroups(userGroups: WordGroupModel[], languageId: string, userWords: WordModel[]): IUserWordGroup[] {
            let allGroups = [...this.getDefaultGroups(), ...userGroups]
            const words = getWordsByLanguage(languageId, userWords)
            const groups = this.setQuantityWordsInGroups(allGroups, words);
            return groups
      }
      // public editWordGroupById = async (req: Request, res: Response) => {
      //       try {
      //             const editedWord = await Word.findOneAndUpdate(
      //                   { _id: req.body._id },
      //                   { $set: req.body },
      //                   { new: true }
      //             )
      //             res.status(200).json(editedWord)
      //       } catch (error) {
      //             errorHandler(res, error);
      //       }
      // };

      // public deleteWordGroupById = async (req: Request, res: Response) => {
      //       try {
      //             const deletedWord = await Word.findOneAndRemove({ _id: req.params.wordId })
      //             res.status(200).json({
      //                   word: deletedWord,
      //                   message: 'Removed'
      //             })
      //       } catch (error) {
      //             errorHandler(res, error);
      //       }
      // };
}
