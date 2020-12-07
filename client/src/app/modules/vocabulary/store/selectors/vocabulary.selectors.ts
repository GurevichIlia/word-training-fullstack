import { ReducerNode } from 'src/app/core/enums/store.enum';
import { VocabularyStateInterface } from './../../types/vocabulary-state.interface';
import { AppStateInterface } from './../../../../store/reducers';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { VOCABULARY_REDUCER_NODE } from '../reducers/vocabulary.reducers';

const featureSelector = createFeatureSelector<AppStateInterface, VocabularyStateInterface>(ReducerNode.VOCABULARY)

// export const allWordsSelector = createSelector(
//   featureSelector,
//   state => state.words
// )

// export const isLoadingSelector = createSelector(
//   featureSelector,
//   state => state.isLoading
// )

// export const vocabularyLoaderSelector = createSelector(
//   featureSelector,
//   state => state.vocabularyLoader
// )

// export const errorSelector = createSelector(
//   featureSelector,
//   state => state.error
// )

export const isCloseWordModalSelector = createSelector(
  featureSelector,
  state => state.isCloseWordModal
)
