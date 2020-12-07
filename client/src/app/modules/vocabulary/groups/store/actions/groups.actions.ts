import { BackendErrorInterface } from 'src/app/core';
import { createAction, props } from '@ngrx/store';
import { WordGroup } from 'src/app/shared/interfaces';

export enum GroupsActionsType {
  // FetchGroups = '[Groups] fetch Groups',
  // FetchGroupsSuccess = '[Groups] fetch Groups success',
  // FetchGroupsError = '[Groups] fetch Groups error',

  SelectGroup = '[Groups] set selected group',
  // UpdateWordsQuantityInGroup = '[Groups] update words quantity in group'
  // Create = '[Groups] create Word',
  // Delete = '[Groups] delete Word',
  // Favorite = '[Groups] toggle add word to favorite',
  // Edit = '[Groups] edit Word',
  // Save = '[Groups] save Word',
  // Success = '[Groups] Word loading success',
  // Error = '[Groups] Word loading error'
}

// export const fetchGroupsAction = createAction(GroupsActionsType.FetchGroups);
// export const fetchGroupsSuccessAction = createAction(GroupsActionsType.FetchGroupsSuccess, props<{ groups: WordGroup[] }>());
// export const fetchGroupsErrorAction = createAction(GroupsActionsType.FetchGroupsError, props<{ error: BackendErrorInterface }>());

export const setSelectedGroupAction = createAction(GroupsActionsType.SelectGroup, props<{ group: WordGroup }>());

// export const updateWordsQuantityInGroupAction = createAction(GroupsActionsType.UpdateWordsQuantityInGroup,
//   props<{ groupId: string, wordsQuantity: number }>());


