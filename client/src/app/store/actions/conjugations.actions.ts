import { createAction, props } from '@ngrx/store';
import { GeneralWord } from 'src/app/modules/general-words/types/general-words.interfaces';

export enum ConjugationsActionsType {
  FetchGeneralConjugations = '[Conjugations] Fetch conjugations',
  FetchGeneralConjugationsSuccess = '[Conjugations] Fetch conjugations success',
  FetchGeneralConjugationsError = '[Conjugations] Fetch gconjugations error',

  FetchGeneralConjugationsFromCSV = '[Conjugations] Fetch conjugations',
  FetchGeneralConjugationsromCSVSuccess = '[Conjugations] Fetch conjugations success',
  FetchGeneralConjugationsromCSVError = '[Conjugations] Fetch gconjugations error',
}


export const fetchConjugationsAction = createAction(ConjugationsActionsType.FetchGeneralConjugations, props<{ verbs: string }>());
export const fetchConjugationsSuccessAction = createAction(ConjugationsActionsType.FetchGeneralConjugationsSuccess,
  props<{ conjugations: GeneralWord[] }>());
export const fetchConjugationsErrorAction = createAction(ConjugationsActionsType.FetchGeneralConjugationsError, props<{ error: string }>());

export const fetchConjugationsFromCSVAction = createAction(ConjugationsActionsType.FetchGeneralConjugations, props<{ file: File }>());
export const fetchConjugationsFromCSVSuccessAction = createAction(ConjugationsActionsType.FetchGeneralConjugationsSuccess,
  props<{ conjugations: GeneralWord[] }>());
export const fetchConjugationsFromCSVErrorAction = createAction(ConjugationsActionsType.FetchGeneralConjugationsError, props<{ error: string }>());
