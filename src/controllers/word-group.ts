import { Request, Response } from "express";
import errorHandler from "../utils/errorHandler";
import Word from "../Models/Word";
import { WordModel, WordGroupModel } from "../interfaces";
import WordGroup from "../Models/WordGroup";

export class WordGroupController {

      public getAllWordGroups = async (req: Request, res: Response) => {
            try {
                  const user = req.user as { _id: string, email: string }
                  const groups = await WordGroup.find({
                        language: req.params.languageId,
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


      public assignGroup = async (req: Request, res: Response) => {
            try {
                  const groupIdForAssign = req.body.groupId as string;
                  const selectedWords = req.body.selectedWords as string[];

                  console.log('groupIdForAssign', groupIdForAssign)

                  const promises = selectedWords.map(async wordId => {

                        const word = await Word.findOne({ _id: wordId }) as WordModel
                        console.log('BEFORE PUSH', word)

                        if (!word.assignedGroups.includes(groupIdForAssign)) {
                              word.assignedGroups.push(groupIdForAssign)
                        }
                        console.log('AFTER PUSH', word)
                        const updatedWord = await Word.findOneAndUpdate({ _id: wordId }, { $set: { assignedGroups: word.assignedGroups } });
                        console.log('AFTER  UPDATE', updatedWord)

                        return updatedWord;

                  })

                  const wordsAfterAssignGroup = await Promise.all(promises);

                  console.log('WORDS AFTER ASSIGN', wordsAfterAssignGroup)

                  res.status(200).json({
                        wordsAfterAssign: wordsAfterAssignGroup,
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