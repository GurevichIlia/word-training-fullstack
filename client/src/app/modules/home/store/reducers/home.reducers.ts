// import { Action, createReducer, on } from '@ngrx/store';
// import { ReducerNode } from 'src/app/core/enums/store.enum';
// import { HomeStateInterface } from '../../types/home-state.interface';
// import {
//   getCurrentLearningLanguageAction,
//   getCurrentLearningLanguageSuccessAction,
//   getCurrentLearningLanguageErrorAction
// } from '../actions/home.actions';

// export const HOME_REDUCER_NODE: ReducerNode = ReducerNode.HOME;



// const initialState: HomeStateInterface = {
//   currentLearningLanguage: null,
//   error: null
// }

// const reducer = createReducer(
//   initialState,
//   on(
//     getCurrentLearningLanguageAction,
//     (state): HomeStateInterface => ({
//       ...state,
//     })),
//   on(
//     getCurrentLearningLanguageSuccessAction,
//     (state, action): HomeStateInterface => ({
//       ...state,
//       currentLearningLanguage: action.currentLanguage
//     })),
//   on(
//     getCurrentLearningLanguageErrorAction,
//     (state, action): HomeStateInterface => ({
//       ...state,
//       error: action.error
//     })),
// )

// export function homeReducer(state: HomeStateInterface, action: Action) {
//   return reducer(state, action);
// }
