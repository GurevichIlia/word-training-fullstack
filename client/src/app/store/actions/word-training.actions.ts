import { BackendErrorInterface } from './../../core/models/general.model';
import { createAction, props } from '@ngrx/store';
import { Word, WordGroup } from 'src/app/shared/interfaces';

export enum WordTrainingActionsType {
  StartTrain = '[Word training] Start training',
  SelectGroup = '[Word training] Select group',
  NextWord = '[Word training] Next word',
  PreviousWord = '[Word training] Previous word',
  StopTraining = '[Word training] Stop training',
  RepeatTraining = '[Word training] Repeat training',

  SaveTrainingProgress = '[Word training] Save training progress',
  SaveTrainingProgressSuccess = '[Word training] Save training progress success',
  SaveTrainingProgressError = '[Word training] Save training progress error',

  ResetWordTrainingState = '[Word training] Reset word training state',
}
export const selectGroupAction = createAction(WordTrainingActionsType.SelectGroup, props<{ group: WordGroup }>());
export const startTrainAction = createAction(WordTrainingActionsType.StartTrain, props<{ words: Word[] }>());
export const nextWordAction = createAction(WordTrainingActionsType.NextWord, props<{ word: Word, levelKnowledge: number }>());
export const previousWordAction = createAction(WordTrainingActionsType.PreviousWord);
export const stopTrainingAction = createAction(WordTrainingActionsType.StopTraining);

export const saveTrainingProgressAction = createAction(WordTrainingActionsType.SaveTrainingProgress);
export const saveTrainingProgressSuccessAction = createAction(WordTrainingActionsType.SaveTrainingProgressSuccess,
  props<{ words: Word[] }>());
export const saveTrainingProgressErrorAction = createAction(WordTrainingActionsType.SaveTrainingProgressError,
  props<{ error: BackendErrorInterface }>());

export const resetWordTrainingStateAction = createAction(WordTrainingActionsType.ResetWordTrainingState);

export const repeatTrainingAction = createAction(WordTrainingActionsType.RepeatTraining);

