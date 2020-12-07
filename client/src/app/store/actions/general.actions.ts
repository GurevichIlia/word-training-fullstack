import { LanguageInterface } from './../../modules/languages/types/languages.interfaces';
import { createAction, props } from '@ngrx/store';

export enum GeneralActionsType {
  SET_CURRENT_LANGUAGE = '[GENERAL] Set current language'
}


export const setCurrentLanguage = createAction(GeneralActionsType.SET_CURRENT_LANGUAGE, props<{ language: LanguageInterface }>())
