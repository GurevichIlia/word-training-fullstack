import { BackendErrorInterface } from './../../core/models/general.model';
import { createAction, props } from '@ngrx/store';
import { Word, WordGroup } from 'src/app/shared/interfaces';
import { WordTrainingActionsType } from './word-training.actions';

export enum VocabularyActionsType {
  // WORDS ACTIONS
  FetchWords = '[Vocabulary] fetch words',
  FetchWordsSuccess = '[Vocabulary] fetch words success',
  FetchWordsError = '[Vocabulary] fetch words error',

  AddWordToUserWords = '[Vocabulary] Add word to user Words',
  AddWordToUserWordsSuccess = '[Vocabulary] Add word to user Words success',
  AddWordToUserWordsError = '[Vocabulary] Add word to user Words error',

  SaveEditedWord = '[Vocabulary] Save edited word',
  SaveEditedWordSuccess = '[Vocabulary] Save edited word success',
  SaveEditedWordError = '[Vocabulary] Save edited word error',

  DeleteUserWord = '[Vocabulary] Delete user word',
  DeleteUserWordsuccess = '[Vocabulary] Delete user word success',
  DeleteUserWordError = '[Vocabulary] Delete user word error',

  SetWordAsFavorite = '[Vocabulary] Set word as favorite',
  SetWordAsFavoriteSuccess = '[Vocabulary] Set word as favorite success',
  SetWordAsFavoriteError = '[Vocabulary] Set word as favorite error',

  AddWordsFromCsv = '[Vocabulary] Add words from csv',
  AddWordsFromCsvSuccess = '[Vocabulary] Add words from csv success',
  AddWordsFromCsvError = '[Vocabulary] Add words from csv error',

  ShareWordToGeneralWords = '[Vocabulary] Add word to general words',
  ShareWordToGeneralWordsSuccess = '[Vocabulary] Add word to general words success',
  ShareWordToGeneralWordsError = '[Vocabulary] Add word to general words error',

  CsvHandlerToggle = '[Vocabulary] Csv handler toggle',

  OpenAssigningBottomSheet = '[Vocabulary] Open Assigning bottom sheet',
  CloseAssigningBottomSheet = '[Vocabulary] Close Assigning bottom sheet',

  SetWords = '[Vocabulary] Set words',

  SelectVocabularyGroup = '[Vocabulary] Select vocabulary group',


  // GROUPS ACTIONS
  FetchGroups = '[Groups] fetch Groups',
  FetchGroupsSuccess = '[Groups] fetch Groups success',
  FetchGroupsError = '[Groups] fetch Groups error',

  AddGroupToUserGroups = '[Groups] Add Group to user Groups',
  AddGroupToUserGroupsSuccess = '[Groups] Add Group to user Groups success',
  AddGroupToUserGroupsError = '[Groups] Add Group to user Groups error',

  SaveEditedGroup = '[Groups] Save edited Group',
  SaveEditedGroupsuccess = '[Groups] Save edited Group success',
  SaveEditedGroupError = '[Groups] Save edited Group error',

  DeleteUserGroup = '[Groups] Delete user Group',
  DeleteUserGroupsuccess = '[Groups] Delete user Group success',
  DeleteUserGroupError = '[Groups] Delete user Group error',

  AssignWordsToGroup = '[Groups] Assign words to group',
  AssignWordsToGroupSuccess = '[Groups] Assign words to group success',
  AssignWordsToGroupError = '[Groups] Assign words to group error',

  UpdateGroupsQuantityInGroup = '[Groups] update Groups quantity in group'

}
// WORDS ACTIONS
export const fetchWordsAction = createAction(VocabularyActionsType.FetchWords);
export const fetchWordsSuccessAction = createAction(VocabularyActionsType.FetchWordsSuccess, props<{ words: Word[] }>());
export const fetchWordsErrorAction = createAction(VocabularyActionsType.FetchWordsError, props<{ error: string }>());

export const addWordToUserWordsAction = createAction(VocabularyActionsType.AddWordToUserWords, props<{ word: Word }>());
export const addWordToUserWordsSuccessAction = createAction(VocabularyActionsType.AddWordToUserWordsSuccess, props<{ words: Word[] }>());
export const addWordToUserWordsErrorAction = createAction(VocabularyActionsType.AddWordToUserWordsError, props<{ error: string }>());

export const saveEditedWordAction = createAction(VocabularyActionsType.SaveEditedWord, props<{ word: Word }>());
export const saveEditedWordSuccessAction = createAction(VocabularyActionsType.SaveEditedWordSuccess, props<{ words: Word[] }>());
export const saveEditedWordErrorAction = createAction(VocabularyActionsType.SaveEditedWordError, props<{ error: string }>());

export const deleteUserWordAction = createAction(VocabularyActionsType.DeleteUserWord, props<{ word: Word }>());
export const deleteUserWordSuccessAction = createAction(VocabularyActionsType.DeleteUserWordsuccess, props<{ words: Word[] }>());
export const deleteUserWordErrorAction = createAction(VocabularyActionsType.DeleteUserWordError, props<{ error: string }>());

export const setWordAsFavoriteAction = createAction(VocabularyActionsType.SetWordAsFavorite, props<{ word: Word }>());
export const setWordAsFavoriteSuccessAction = createAction(VocabularyActionsType.SetWordAsFavoriteSuccess);
export const setWordAsFavoriteErrorAction = createAction(VocabularyActionsType.SetWordAsFavoriteError,
  props<{ word: Word, error: BackendErrorInterface | string }>());

export const addWordsFromCsvAction = createAction(VocabularyActionsType.AddWordsFromCsv, props<{ file: File, selectedGroupId?: string }>());
export const addWordsFromCsvSuccessAction = createAction(VocabularyActionsType.AddWordsFromCsvSuccess,
  props<{ words: Word[] }>());
export const addWordsFromCsvErrorAction = createAction(VocabularyActionsType.AddWordsFromCsvError,
  props<{ error: BackendErrorInterface | string }>());

export const shareWordToGeneralWordsAction = createAction(VocabularyActionsType.ShareWordToGeneralWords, props<{ words: Word[] }>());
export const shareWordToGeneralWordsSuccessAction = createAction(VocabularyActionsType.ShareWordToGeneralWordsSuccess,
  props<{ words?: Word[], message?: string }>());
export const shareWordToGeneralWordsErrorAction = createAction(VocabularyActionsType.ShareWordToGeneralWordsError,
  props<{ error: string }>());

export const csvHandlerToggleAction = createAction(VocabularyActionsType.CsvHandlerToggle);

export const openAssigningBottomSheetAction = createAction(VocabularyActionsType.OpenAssigningBottomSheet);
export const closeAssigningBottomSheetAction = createAction(VocabularyActionsType.CloseAssigningBottomSheet);

export const setWordsAction = createAction(VocabularyActionsType.SetWords, props<{ words: Word[] }>());

export const selectVocabularyGroupAction = createAction(VocabularyActionsType.SelectVocabularyGroup, props<{ group: WordGroup }>());

// GROUPS ACTIONS
export const fetchGroupsAction = createAction(VocabularyActionsType.FetchGroups);
export const fetchGroupsSuccessAction = createAction(VocabularyActionsType.FetchGroupsSuccess, props<{ groups: WordGroup[] }>());
export const fetchGroupsErrorAction = createAction(VocabularyActionsType.FetchGroupsError, props<{ error: BackendErrorInterface }>());

export const addGroupToUserGroupsAction = createAction(VocabularyActionsType.AddGroupToUserGroups, props<{ name: string }>());
export const addGroupToUserGroupsSuccessAction = createAction(VocabularyActionsType.AddGroupToUserGroupsSuccess,
  props<{ groups: WordGroup[], group: WordGroup }>());
export const addGroupToUserGroupsErrorAction = createAction(VocabularyActionsType.AddGroupToUserGroupsError, props<{ error: string }>());

export const saveEditedGroupAction = createAction(VocabularyActionsType.SaveEditedGroup, props<{ name: string }>());
export const saveEditedGroupSuccessAction = createAction(VocabularyActionsType.SaveEditedGroupsuccess,
  props<{ groups: WordGroup[], group: WordGroup }>());
export const saveEditedGroupErrorAction = createAction(VocabularyActionsType.SaveEditedGroupError, props<{ error: string }>());

export const deleteUserGroupAction = createAction(VocabularyActionsType.DeleteUserGroup);
export const deleteUserGroupSuccessAction = createAction(VocabularyActionsType.DeleteUserGroupsuccess, props<{ groups: WordGroup[] }>());
export const deleteUserGroupErrorAction = createAction(VocabularyActionsType.DeleteUserGroupError, props<{ error: string }>());

export const updateGroupsQuantityInGroupAction = createAction(VocabularyActionsType.UpdateGroupsQuantityInGroup,
  props<{ groupId: string, GroupsQuantity: number }>());

export const assignWordsToGroupAction = createAction(VocabularyActionsType.AssignWordsToGroup,
  props<{ selectedWordsIds: string[] }>());
export const assignWordsToGroupSuccessAction = createAction(VocabularyActionsType.AssignWordsToGroupSuccess,
  props<{ groups: WordGroup[], message: string, words: Word[] }>());
export const assignWordsToGroupErrorAction = createAction(VocabularyActionsType.AssignWordsToGroupError, props<{ error: string }>());
