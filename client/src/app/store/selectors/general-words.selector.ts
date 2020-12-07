import { createFeatureSelector, createSelector } from '@ngrx/store'
import { AppStateInterface } from '../reducers'
import { GeneralStateInterface, GENERAL_REDUCER_NODE } from '../reducers/general.reducer'

const featureSelector = createFeatureSelector<AppStateInterface, GeneralStateInterface>(GENERAL_REDUCER_NODE)

export const generalWordsSelector = createSelector(
  featureSelector,
  state => state.generalWords
)
