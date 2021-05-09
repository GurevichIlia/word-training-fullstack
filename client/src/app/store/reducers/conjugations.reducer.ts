import { Action, createReducer, on } from '@ngrx/store';
import { ReducerNode } from 'src/app/core/enums/store.enum';
import { ConjugationsState } from 'src/app/modules/conjugations/models/conjugations.interface';
import { fetchConjugationsAction, fetchConjugationsErrorAction, fetchConjugationsSuccessAction } from './../actions/conjugations.actions';

export const CONJUGATIONS_REDUCER_NODE: ReducerNode.CONJUGATIONS = ReducerNode.CONJUGATIONS


const initialState: ConjugationsState = {
  error: null,
  verbs: null,
  isLoading: false
}

export const reducer = createReducer(
  initialState,
  on(
    fetchConjugationsAction,
    (state, action): ConjugationsState => ({
      ...state,
      isLoading: true,
      verbs: [],

    })
  ),
  on(
    fetchConjugationsSuccessAction,
    (state, action): ConjugationsState => ({
      ...state,
      isLoading: false,
      verbs: action.verbs,
    })
  ),
  on(
    fetchConjugationsErrorAction,
    (state, action): ConjugationsState => ({
      ...state,
      isLoading: false,

    })
  ),

)

export const conjugationsReducer = (state: ConjugationsState, action: Action) => {
  return reducer(state, action)
}
