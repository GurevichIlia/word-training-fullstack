import { GeneralStateInterface, GENERAL_REDUCER_NODE } from './../reducers/general.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppStateInterface } from 'src/app/store/reducers';


export const languagesFeatureSelector = createFeatureSelector<AppStateInterface, GeneralStateInterface>(GENERAL_REDUCER_NODE);

export const currentLanguageSelector = createSelector(
  languagesFeatureSelector,
  state => state.currentLanguage
);
