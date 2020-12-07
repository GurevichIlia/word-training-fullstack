import { BackendErrorInterface } from './../../core/models/general.model';
import { createAction, props } from '@ngrx/store';
import { Word } from 'src/app/shared/interfaces';

export enum WordsActionsType {
  FetchWords = '[Words] fetch words',
  FetchWordsSuccess = '[Words] fetch words success',
  FetchWordsError = '[Words] fetch words error',

  AddWordToUserWords = '[Words] Add word to user Words',
  AddWordToUserWordsSuccess = '[Words] Add word to user Words success',
  AddWordToUserWordsError = '[Words] Add word to user Words error',

  SaveEditedWord = '[Words] Save edited word',
  SaveEditedWordSuccess = '[Words] Save edited word success',
  SaveEditedWordError = '[Words] Save edited word error',

  DeleteUserWord = '[Words] Delete user word',
  DeleteUserWordsuccess = '[Words] Delete user word success',
  DeleteUserWordError = '[Words] Delete user word error',

  SetWordAsFavorite = '[Words] Set word as favorite',
  SetWordAsFavoriteSuccess = '[Words] Set word as favorite success',
  SetWordAsFavoriteError = '[Words] Set word as favorite error',

  AddWordsFromCsv = '[Words] Add words from csv',
  AddWordsFromCsvSuccess = '[Words] Add words from csv success',
  AddWordsFromCsvError = '[Words] Add words from csv error',

  ShareWordToGeneralWords = '[Words] Add word to general words',
  ShareWordToGeneralWordsSuccess = '[Words] Add word to general words success',
  ShareWordToGeneralWordsError = '[Words] Add word to general words error',

  CsvHandlerToggle = '[Words] Csv handler toggle',

  OpenAssigningBottomSheet = '[Words] Open Assigning bottom sheet',
  CloseAssigningBottomSheet = '[Words] Close Assigning bottom sheet',
}

export const fetchWordsAction = createAction(WordsActionsType.FetchWords);
export const fetchWordsSuccessAction = createAction(WordsActionsType.FetchWordsSuccess, props<{ words: Word[] }>());
export const fetchWordsErrorAction = createAction(WordsActionsType.FetchWordsError, props<{ error: string }>());

export const addWordToUserWordsAction = createAction(WordsActionsType.AddWordToUserWords, props<{ word: Word }>());
export const addWordToUserWordsSuccessAction = createAction(WordsActionsType.AddWordToUserWordsSuccess, props<{ words: Word[] }>());
export const addWordToUserWordsErrorAction = createAction(WordsActionsType.AddWordToUserWordsError, props<{ error: string }>());

export const saveEditedWordAction = createAction(WordsActionsType.SaveEditedWord, props<{ word: Word }>());
export const saveEditedWordSuccessAction = createAction(WordsActionsType.SaveEditedWordSuccess, props<{ words: Word[] }>());
export const saveEditedWordErrorAction = createAction(WordsActionsType.SaveEditedWordError, props<{ error: string }>());

export const deleteUserWordAction = createAction(WordsActionsType.DeleteUserWord, props<{ word: Word }>());
export const deleteUserWordSuccessAction = createAction(WordsActionsType.DeleteUserWordsuccess, props<{ words: Word[] }>());
export const deleteUserWordErrorAction = createAction(WordsActionsType.DeleteUserWordError, props<{ error: string }>());

export const setWordAsFavoriteAction = createAction(WordsActionsType.SetWordAsFavorite, props<{ word: Word }>());
export const setWordAsFavoriteSuccessAction = createAction(WordsActionsType.SetWordAsFavoriteSuccess);
export const setWordAsFavoriteErrorAction = createAction(WordsActionsType.SetWordAsFavoriteError,
  props<{ word: Word, error: BackendErrorInterface | string }>());

export const addWordsFromCsvAction = createAction(WordsActionsType.AddWordsFromCsv, props<{ file: File, selectedGroupId?: string }>());
export const addWordsFromCsvSuccessAction = createAction(WordsActionsType.AddWordsFromCsvSuccess,
  props<{ words: Word[] }>());
export const addWordsFromCsvErrorAction = createAction(WordsActionsType.AddWordsFromCsvError,
  props<{ error: BackendErrorInterface | string }>());

export const shareWordToGeneralWordsAction = createAction(WordsActionsType.ShareWordToGeneralWords, props<{ words: Word[]}>());
export const shareWordToGeneralWordsSuccessAction = createAction(WordsActionsType.ShareWordToGeneralWordsSuccess,
  props<{ words?: Word[], message?: string }>());
export const shareWordToGeneralWordsErrorAction = createAction(WordsActionsType.ShareWordToGeneralWordsError, props<{ error: string }>());

export const csvHandlerToggleAction = createAction(WordsActionsType.CsvHandlerToggle);

export const openAssigningBottomSheetAction = createAction(WordsActionsType.OpenAssigningBottomSheet);
export const closeAssigningBottomSheetAction = createAction(WordsActionsType.CloseAssigningBottomSheet);

