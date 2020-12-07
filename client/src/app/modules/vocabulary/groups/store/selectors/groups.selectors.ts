import { ReducerNode } from 'src/app/core/enums/store.enum';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GroupsStateInterface } from '../../types/groups-state.interface';
import { AppStateInterface } from 'src/app/store/reducers';

const featureSelector = createFeatureSelector<AppStateInterface, GroupsStateInterface>(ReducerNode.GROUPS)

export const selectedGroupSelector = createSelector(
  featureSelector,
  state => state.selectedGroup
)
