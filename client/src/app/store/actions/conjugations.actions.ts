import { createAction, props } from '@ngrx/store';
import { VerbWithConjugations } from 'src/app/modules/conjugations/models/conjugations.interface';

export enum ConjugationsActionsType {
  FetchConjugations = '[Conjugations] Fetch conjugations',
  FetchConjugationsSuccess = '[Conjugations] Fetch conjugations success',
  FetchConjugationsError = '[Conjugations] Fetch gconjugations error',

  FetchConjugationsFromCSV = '[Conjugations] Fetch conjugations',
  FetchConjugationsromCSVSuccess = '[Conjugations] Fetch conjugations success',
  FetchConjugationsromCSVError = '[Conjugations] Fetch gconjugations error',
}


export const fetchConjugationsAction = createAction(ConjugationsActionsType.FetchConjugations, props<{ verbs: string }>());
export const fetchConjugationsSuccessAction = createAction(ConjugationsActionsType.FetchConjugationsSuccess,
  props<{ verbs: VerbWithConjugations[] }>());
export const fetchConjugationsErrorAction = createAction(ConjugationsActionsType.FetchConjugationsError, props<{ error: string }>());

export const fetchConjugationsFromCSVAction = createAction(ConjugationsActionsType.FetchConjugations, props<{ file: File }>());
export const fetchConjugationsFromCSVSuccessAction = createAction(ConjugationsActionsType.FetchConjugationsSuccess,
  props<{ verbs: VerbWithConjugations[] }>());
export const fetchConjugationsFromCSVErrorAction = createAction(ConjugationsActionsType.FetchConjugationsError, props<{ error: string }>());
