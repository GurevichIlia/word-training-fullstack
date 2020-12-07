import { setSelectedGroupAction } from './../actions/groups.actions';

import { Action, createReducer, on } from '@ngrx/store';
import { DefaultGroupId } from 'src/app/core/enums/group.enum';
import { ReducerNode } from 'src/app/core/enums/store.enum';
import { WordGroup } from 'src/app/shared/interfaces';
import { GroupsStateInterface } from '../../types/groups-state.interface';

export const GROUPS_REDUCER_NODE: ReducerNode = ReducerNode.GROUPS

enum DefaultGroups {
  AllWords = 0,
  Favorites = 1
}

export const defaultGroups: WordGroup[] = [{
  _id: DefaultGroupId.ALL_WORDS,
  name: 'All',
  wordQuantity: 0,
  shareForAll: false
},
{
  _id: DefaultGroupId.FAVORITES,
  name: 'Favorites',
  wordQuantity: 0,
  shareForAll: false
}
];


const initialState: GroupsStateInterface = {
  selectedGroup: defaultGroups[DefaultGroups.AllWords],
}

const reducers = createReducer(
  initialState,
  // on(
  //   fetchGroupsAction,
  //   (state): GroupsStateInterface => ({
  //     ...state,
  //     isLoading: true
  //   })
  // ),
  // on(
  //   fetchGroupsSuccessAction,
  //   (state, action): GroupsStateInterface => ({
  //     ...state,
  //     isLoading: false,
  //     groups: action.groups
  //   })
  // ),
  // on(
  //   fetchGroupsErrorAction,
  //   (state, action): GroupsStateInterface => ({
  //     ...state,
  //     isLoading: false,
  //     error: action.error
  //   })
  // ),
  on(
    setSelectedGroupAction,
    (state, action): GroupsStateInterface => ({
      ...state,
      selectedGroup: action.group
    })
  ),
  // on(
  //   updateWordsQuantityInGroupAction,
  //   (state, action): GroupsStateInterface => ({
  //     ...state,
  //     groups: state.groups.map(group =>
  //       group._id === action.groupId ?
  //         { ...group, wordQuantity: action.wordsQuantity } :
  //         group
  //     )
  //   })
  // ),
)

export function groupsReducer(state: GroupsStateInterface, action: Action) {
  return reducers(state, action)
}

