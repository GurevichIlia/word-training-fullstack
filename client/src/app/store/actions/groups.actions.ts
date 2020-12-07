import { BackendErrorInterface } from 'src/app/core';
import { createAction, props } from '@ngrx/store';
import { Word, WordGroup } from 'src/app/shared/interfaces';

export enum GroupsActionsType {
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

export const fetchGroupsAction = createAction(GroupsActionsType.FetchGroups);
export const fetchGroupsSuccessAction = createAction(GroupsActionsType.FetchGroupsSuccess, props<{ groups: WordGroup[] }>());
export const fetchGroupsErrorAction = createAction(GroupsActionsType.FetchGroupsError, props<{ error: BackendErrorInterface }>());

export const addGroupToUserGroupsAction = createAction(GroupsActionsType.AddGroupToUserGroups, props<{ name: string }>());
export const addGroupToUserGroupsSuccessAction = createAction(GroupsActionsType.AddGroupToUserGroupsSuccess,
  props<{ groups: WordGroup[], group: WordGroup }>());
export const addGroupToUserGroupsErrorAction = createAction(GroupsActionsType.AddGroupToUserGroupsError, props<{ error: string }>());

export const saveEditedGroupAction = createAction(GroupsActionsType.SaveEditedGroup, props<{ name: string }>());
export const saveEditedGroupSuccessAction = createAction(GroupsActionsType.SaveEditedGroupsuccess,
  props<{ groups: WordGroup[], group: WordGroup }>());
export const saveEditedGroupErrorAction = createAction(GroupsActionsType.SaveEditedGroupError, props<{ error: string }>());

export const deleteUserGroupAction = createAction(GroupsActionsType.DeleteUserGroup);
export const deleteUserGroupSuccessAction = createAction(GroupsActionsType.DeleteUserGroupsuccess, props<{ groups: WordGroup[] }>());
export const deleteUserGroupErrorAction = createAction(GroupsActionsType.DeleteUserGroupError, props<{ error: string }>());

export const updateGroupsQuantityInGroupAction = createAction(GroupsActionsType.UpdateGroupsQuantityInGroup,
  props<{ groupId: string, GroupsQuantity: number }>());

export const assignWordsToGroupAction = createAction(GroupsActionsType.AssignWordsToGroup,
  props<{ selectedWordsIds: string[] }>());
export const assignWordsToGroupSuccessAction = createAction(GroupsActionsType.AssignWordsToGroupSuccess,
  props<{ groups: WordGroup[], message: string, words: Word[] }>());
export const assignWordsToGroupErrorAction = createAction(GroupsActionsType.AssignWordsToGroupError, props<{ error: string }>());


