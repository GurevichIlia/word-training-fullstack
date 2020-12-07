import { createAction, props } from '@ngrx/store';
import { BackendErrorInterface } from 'src/app/core';
import { LanguageInterface } from 'src/app/modules/languages/types/languages.interfaces';

export enum LanguageActionTypes {

  SET_CURRENT_LANGUAGE = '[GENERAL] Set current language',
  GET_CURRENT_LEARNING_LANGUAGE = '[GENERAL] Get current learning language',
  GET_CURRENT_LEARNING_LANGUAGE_SUCCESS = '[GENERAL] Get current learning language success',
  GET_CURRENT_LEARNING_LANGUAGE_ERROR = '[GENERAL] Get current learning language error',
}

export const setCurrentLanguageAction = createAction(LanguageActionTypes.SET_CURRENT_LANGUAGE, props<{ language: LanguageInterface }>())


export const getLearningLanguageAction = createAction(LanguageActionTypes.GET_CURRENT_LEARNING_LANGUAGE)
export const getCurrentLearningLanguageSuccessAction = createAction(LanguageActionTypes.GET_CURRENT_LEARNING_LANGUAGE_SUCCESS,
  props<{ currentLanguage: LanguageInterface }>())
export const getCurrentLearningLanguageErrorAction = createAction(LanguageActionTypes.GET_CURRENT_LEARNING_LANGUAGE_ERROR,
  props<{ error: BackendErrorInterface }>());
