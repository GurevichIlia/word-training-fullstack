import { createFeatureSelector, createSelector } from '@ngrx/store'
import { ConjugationsState } from 'src/app/modules/conjugations/models/conjugations.interface'
import { AppStateInterface } from '../reducers'
import { CONJUGATIONS_REDUCER_NODE } from '../reducers/conjugations.reducer'

const featureSelector = createFeatureSelector<AppStateInterface, ConjugationsState>(CONJUGATIONS_REDUCER_NODE)

export const isLoadingSelector = createSelector(
  featureSelector,
  state => state.isLoading
)

export const verbsWithConjugationsSelector = createSelector(
  featureSelector,
  state => state.verbs
)
