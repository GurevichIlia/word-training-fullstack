import { ReducerNode } from 'src/app/core/enums/store.enum';
import { AppStateInterface } from 'src/app/store/reducers';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HomeStateInterface } from '../../types/home-state.interface';

// export const featureSelector = createFeatureSelector<AppStateInterface, HomeStateInterface>(ReducerNode.HOME);
// export const learningLanguageSelector = createSelector(
//   featureSelector,
//   state => {
//     return state.currentLearningLanguage
//   }
// )
