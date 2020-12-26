import { Request, Response } from "express";
import { getAllUserGroups } from '../helper-functions/groups.heplers';
import { IRequestUserInfo, IUserWordGroup, UserModel, WordGroupModel, WordModel } from "../interfaces";
import User from "../Models/User";
import Word from '../Models/Word';
import WordGroup, { ALL_WORDS_GROUP, FAVORITES } from "../Models/WordGroup";
import errorHandler from "../utils/errorHandler";
import { getWordsByLanguage } from './../helper-functions/index';

export class WordGroupController {

      public getAllWordGroups = async (req: Request, res: Response) => {
            try {
                  // const user = req.user as { _id: string, email: string }

                  const user = req.user as IRequestUserInfo
                  if (!user.currentLanguage) throw new Error('Language is not exists')

                  const words = await Word.find({ user: user, language: user.currentLanguage._id })

                  const userGroups = await WordGroup.find({
                        language: user.currentLanguage._id,
                        user: user
                  });

                  // let allGroups = [...this.getDefaultGroups(), ...userGroups]
                  // const words = getWordsByLanguage(req.query.languageId, user.words)
                  // this.setQuantityWordsInGroups(allGroups, words);

                  const groups = getAllUserGroups(userGroups, user.currentLanguage._id.toString(), words)

                  res.status(200).json(groups);
            } catch (error) {
                  errorHandler(res, error);
            }
      };



      public saveGroup = async (req: Request, res: Response) => {
            try {
                  const user = req.user as IRequestUserInfo

                  const groupCondidate: { name: string, id: string, languageId: string } = req.body.group

                  if (!groupCondidate) return

                  let group: WordGroupModel;

                  if (groupCondidate.id) {

                        group = await WordGroup.findOneAndUpdate({ _id: groupCondidate.id }, { name: groupCondidate.name }, { new: true }) as WordGroupModel

                  } else {

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

                  const words = await Word.find({ user: user, language: user.currentLanguage._id })

                  const groups = getAllUserGroups(userGroups, user.currentLanguage?._id, words)

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
                  const user = req.user as IRequestUserInfo

                  if (!user.currentLanguage) throw new Error('Language is not exists')

                  const removedGroup = await WordGroup.findOneAndRemove({ _id: req.body.groupId })
                  const words = await Word.find({ user: user, language: user.currentLanguage._id })

                  const userGroups = await WordGroup.find({
                        language: user.currentLanguage._id,
                        user: user
                  });

                  const groups = getAllUserGroups(userGroups, user.currentLanguage?._id, words)

                  res.status(200).json({ groups })
            } catch (error) {
                  errorHandler(res, error);

            }
      }


      public assignGroup = async (req: Request, res: Response) => {
            try {
                  const groupIdForAssign = req.body.groupId as string;
                  const selectedWords = req.body.selectedWords as string[];
                  const user = req.user as IRequestUserInfo

                  const language = user.currentLanguage

                  if (!language) throw new Error('Language does not exists')

                  selectedWords.forEach(async wordId => {

                        await Word.findOneAndUpdate({ _id: wordId }, { $push: { assignedGroups: groupIdForAssign } })

                  })
                  const userGroups = await WordGroup.find({
                        language: language._id,
                        user: user
                  });
                  // const updatedUser = await User.findOneAndUpdate({ _id: user._id }, { $set: user }, { new: true });
                  const words = await Word.find({ user: user, language: language._id })

                  const groups = getAllUserGroups(userGroups, language._id.toString(), words)


                  res.status(200).json({
                        groups: groups,
                        wordsAfterAssign: words,
                        message: 'Words added'
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
