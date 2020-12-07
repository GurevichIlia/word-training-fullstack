import { BackendErrorInterface } from './../../../../core/models/general.model';
import { LanguageInterface } from 'src/app/modules/languages/types/languages.interfaces';
import { createAction, props } from '@ngrx/store';
// import { Language } from 'src/app/shared/interfaces';
export enum HomeActionsType {
  GET_CURRENT_LEARNING_LANGUAGE = '[Home] Get current learning language',
  GET_CURRENT_LEARNING_LANGUAGE_SUCCESS = '[Home] Get current learning language success',
  GET_CURRENT_LEARNING_LANGUAGE_ERROR = '[Home] Get current learning language error',
  SET_CURRENT_LEARNING_LANGUAGE = '[Home] Set current learning language',
  SET_CURRENT_LEARNING_LANGUAGE_SUCCESS = '[Home] Set current learning language success',
  SET_CURRENT_LEARNING_LANGUAGE_ERROR = '[Home] Set current learning language error',
  // GET_CURRENT_USER_SUCCESS = '[Current user] Get current user success',
  // GET_CURRENT_USER_ERROR = '[Current user] Get current user error',

  // Create = '[AUTH] create Word',
  // Delete = '[AUTH] delete Word',
  // Favorite = '[AUTH] toggle add word to favorite',
  // Edit = '[AUTH] edit Word',
  // Save = '[AUTH] save Word',
  // Success = '[AUTH] Word loading success',
  // Error = '[AUTH] Word loading error'
}

// export const getCurrentLearningLanguageAction = createAction(HomeActionsType.GET_CURRENT_LEARNING_LANGUAGE)
// export const getCurrentLearningLanguageSuccessAction = createAction(HomeActionsType.GET_CURRENT_LEARNING_LANGUAGE_SUCCESS,
//   props<{ currentLanguage: LanguageInterface }>())
// export const getCurrentLearningLanguageErrorAction = createAction(HomeActionsType.GET_CURRENT_LEARNING_LANGUAGE_ERROR,
//   props<{ error: BackendErrorInterface }>());

// export const setCurrentLearningLanguageAction = createAction(HomeActionsType.SET_CURRENT_LEARNING_LANGUAGE,
//   props<{ languageId: string }>())
// export const setCurrentLearningLanguageSuccessAction = createAction(HomeActionsType.SET_CURRENT_LEARNING_LANGUAGE_SUCCESS,
//   props<{ currentLanguage: LanguageInterface }>())
// export const setCurrentLearningLanguageErrorAction = createAction(HomeActionsType.SET_CURRENT_LEARNING_LANGUAGE_ERROR,
//   props<{ error: BackendErrorInterface }>());
