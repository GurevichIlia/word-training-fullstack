import { BackendErrorInterface } from 'src/app/core';

export interface GetConjugationsResponse {
  verbs: VerbWithConjugations[]
}

export type VerbTime = 'past' | 'present' | 'future'

export interface Conjugation {
  verb: string
  time: VerbTime
  i: string | null;
  you_male: string | null;
  you_female: string | null
  he: string | null
  she: string | null
  we: string | null
  you_plural: string | null
  they: string | null

}

export interface VerbWithConjugations {
  verb: string,
  conjugations: Conjugation[]
}

export interface ConjugationsState {
  error: BackendErrorInterface | string | null,
  verbs: VerbWithConjugations[]
  isLoading: boolean
}
