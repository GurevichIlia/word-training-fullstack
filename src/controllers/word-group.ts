import { Request, Response } from "express";
import errorHandler from "../utils/errorHandler";
import Word from "../Models/Word";
import { WordModel, WordGroupModel, UserModel } from "../interfaces";
import WordGroup from "../Models/WordGroup";
import User from "../Models/User";

export class WordGroupController {

      public getAllWordGroups = async (req: Request, res: Response) => {
            try {
                  const user = req.user as { _id: string, email: string }


                  const groups = await WordGroup.find({
                        language: req.query.languageId,
                        user: user._id
                  });
                  res.status(200).json(groups);
            } catch (error) {
                  errorHandler(res, error);
            }
      };



      public createNewWordGroup = async (req: Request, res: Response) => {
            try {
                  const newWordGroup: WordGroupModel = await new WordGroup({
                        name: req.body.name,
                        language: req.body.languageId,
                        user: req.user
                  }).save();
                  console.log('NEW GROUP', newWordGroup)
                  res.status(201).json(newWordGroup);
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

                  console.log('groupIdForAssign', groupIdForAssign)
                  console.log('selected words', selectedWords)

                  selectedWords.forEach(wordId => {

                        const existingWords = [...user.words]

                        user.words = existingWords.map(word => {

                              if (word._id.toString() == wordId) {
                                    if (!word.assignedGroups.includes(groupIdForAssign)) {
                                          const groups = [...word.assignedGroups]
                                          groups.push(groupIdForAssign)
                                          const newWord = { ...word, assignedGroups: groups }
                                          console.log('NEW WORD', newWord)

                                          return newWord;
                                    } else {
                                          return word
                                    }

                              } else {
                                    return word
                              }


                        }) as WordModel[]

                        console.log('UPDATED USER', user.words)



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
