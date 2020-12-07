import { Request, Response } from "express";
import { UserModel, WordGroupModel, WordInObjectInterface, WordModel } from "../interfaces";
import User from "../Models/User";
import WordGroup, { ALL_WORDS_GROUP, FAVORITES } from "../Models/WordGroup";
import errorHandler from "../utils/errorHandler";

export class WordGroupController {

      public getAllWordGroups = async (req: Request, res: Response) => {
            try {
                  // const user = req.user as { _id: string, email: string }

                  const user = await User.findOne({ _id: req.user }) as UserModel;

                  const userGroups = await WordGroup.find({
                        language: req.query.languageId,
                        user: user
                  });

                  let allGroups = [...this.getDefaultGroups(), ...userGroups]
                  // const words = getWordsByLanguage(req.query.languageId, user.words)
                  const words: WordInObjectInterface = user.wordsAsObject[req.query.languageId].words
                  console.log('WORDS', user.wordsAsObject)
                  const groups = this.setQuantityWordsInGroups(allGroups, words);

                  res.status(200).json(groups);
            } catch (error) {
                  errorHandler(res, error);
            }
      };



      public saveGroup = async (req: Request, res: Response) => {
            try {
                  const groupCondidate: { name: string, id: string, languageId: string } = req.body.group

                  if (!groupCondidate) return

                  let group: WordGroupModel;

                  if (groupCondidate.id) {

                        group = await WordGroup.findOneAndUpdate({ _id: groupCondidate.id }, { name: groupCondidate.name }, { new: true }) as WordGroupModel
                  } else {
                        console.log('NO ID')
                        group = await new WordGroup({
                              name: groupCondidate.name,
                              language: groupCondidate.languageId,
                              user: req.user
                        }).save();
                  }


                  res.status(201).json(group);
            } catch (error) {
                  errorHandler(res, error);
            }
      };

      public deleteWordGroup = async (req: Request, res: Response) => {
            try {
                  const removedGroup = await WordGroup.findOneAndRemove({ _id: req.body.groupId })

                  res.status(200).json({
                        removedGroup
                  })
            } catch (error) {
                  errorHandler(res, error);

            }
      }


      public assignGroup = async (req: Request, res: Response) => {
            try {
                  const groupIdForAssign = req.body.groupId as string;
                  const selectedWords = req.body.selectedWords as string[];
                  const user = await User.findOne({ _id: req.user }) as UserModel;


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

                  const updatedUser = await User.findOneAndUpdate({ _id: user._id }, { $set: user }, { new: true });



                  res.status(200).json({
                        wordsAfterAssign: updatedUser?.words,
                        message: 'Group assigned'
                  })

            } catch (error) {
                  errorHandler(res, error);

            }
      }

      getDefaultGroups() {
            return [ALL_WORDS_GROUP, FAVORITES] as WordGroupModel[]
      }

      // private setQuantityWordsInGroups = (groups: WordGroupModel[], words: WordModel[]) => {
      //       if (!words || words.length === 0) return groups

      //       const updatedGroups = groups.map(group => {
      //             if (group._id == '1') {
      //                   const newGroup = { ...group, wordQuantity: words.length };

      //                   return newGroup
      //             }

      //             if (group._id == '2') {
      //                   const newGroup = {
      //                         ...group, wordQuantity: words.filter(word => word.isFavorite === true).length
      //                   };
      //                   return newGroup
      //             }

      //             const quantity = words.filter(word => word.assignedGroups.includes(group._id.toString()));
      //             group.wordQuantity = quantity.length
      //             // console.log('COUNTED WORDS GROUPS', words.filter(word => console.log(word.assignedGroups[1], group._id)).length)

      //             return group;
      //       });
      //       return updatedGroups;

      // }
      private setQuantityWordsInGroups = (groups: WordGroupModel[], words: WordInObjectInterface) => {
            const wordsKeys = Object.keys(words);
            const wordsLength = Object.keys(words).length


            if (!words || words.length === 0) return groups

            const updatedGroups = groups.map(group => {
                  if (group._id == '1') {
                        const newGroup = { ...group, wordQuantity: wordsLength };

                        return newGroup
                  }

                  if (group._id == '2') {
                        const newGroup = {
                              ...group, wordQuantity: wordsKeys.filter(key => words[key].isFavorite === true).length
                        };
                        return newGroup
                  }

                  const quantity = wordsKeys.filter(key => words[key].assignedGroups?.includes(group._id.toString()));
                  group.wordQuantity = quantity.length
                  // console.log('COUNTED WORDS GROUPS', words.filter(word => console.log(word.assignedGroups[1], group._id)).length)

                  return group;
            });
            return updatedGroups;

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
