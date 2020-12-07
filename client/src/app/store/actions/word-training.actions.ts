import { createAction, props } from '@ngrx/store';
import { Word, WordGroup } from 'src/app/shared/interfaces';

export enum WordTrainingActionsType {
  StartTrain = '[Word training] Start training',
  SelectGroup = '[Word training] Select group',
  NextWord = '[Word training] Next word',
  PreviousWord = '[Word training] Previous word',
  StopTraining = '[Word training] Stop training',
}
export const selectGroupAction = createAction(WordTrainingActionsType.SelectGroup, props<{ group: WordGroup }>());
export const startTrainAction = createAction(WordTrainingActionsType.StartTrain, props<{ words: Word[] }>());
export const nextWordAction = createAction(WordTrainingActionsType.NextWord, props<{ word: Word, levelKnowledge: number }>());
export const previousWordAction = createAction(WordTrainingActionsType.PreviousWord);
export const stopTrainingAction = createAction(WordTrainingActionsType.StopTraining);
