import { Document } from "mongoose";

export type IRequestUserInfo = Pick<UserModel, '_id' | 'currentLanguage' | 'email'>


export interface UserModel extends Document {
      readonly _id: string
      nickName?: string;
      email: string;
      password: string;
      currentLanguage: Language | null,
      // userLanguages: Language[],
      // wordGroups: WordGroupModel[],
      // wordsForBackup: WordModel[]
      // words: WordModel[]
}

export interface WordModel extends Document, VerbModel {
      readonly _id: string;
      word: string;
      translation: string;
      isFavorite?: boolean;
      isShared?: boolean,
      levelKnowledge: number;
      assignedGroups: string[];
      language: Object,
      date: string,
      isVerb: boolean

}

export interface VerbModel {
      conjugations: {
            past?: Conjugation
            present?: PresentConjugation
            future?: Conjugation
      },
}

export interface VerbFromCSV extends Conjugation {
      translation: string
}

export interface VerbForConjugation {
      word: string
}

export interface Conjugation<T = VerbTime> {
      verb: string
      time: T
      i: string | null;
      you_male: string | null;
      you_female: string | null
      he: string | null
      she: string | null
      we: string | null
      you_plural: string | null
      they: string | null

}

export interface PresentConjugation {
      time: 'present'
      singularMan: string
      singularFem: string
      pluralMan: string
      pluralFem: string
}

export type VerbTime = 'past' | 'present' | 'future'

export interface WordModelAsObject {
      [key: string]: WordModel
}

export interface Language extends Document {
      readonly _id: string
      name: string;
}

export interface UserLanguageModel extends Document {
      name: string,
      _id: string,
      userId: string,
      langId: string

}

export interface IUserLanguage {
      name: string,
      _id: string
      userId: string
}

export interface WordGroupModel extends Document {
      _id: string,
      name: string,
      wordQuantity: number,
      shareForAll: boolean;
      language: string;
      isVerbsGroup: boolean
}

export interface GeneralWord extends Document {
      readonly _id: number;
      word: string;
      translation: string;
      assignedGroups: string[];
      language: string,
      originId: object
}


export interface afterCSV {
      insertedCount: number
      insertedIds: object
      ops: []
      result: object
}



export interface ILearningLanguage {
      _id: string,
      name: string,
      userId?: string
}
export interface LearningLanguageModel extends Document {
      langId: string,
      _id: string,
      name: string,
      userId: string
}

export type VerbWithConjugations = Pick<VerbWithConjugationModel, 'verb' | 'past' | 'present' | 'future'>

export type IUserWord = Pick<WordModel, '_id' | 'translation' | 'word' | 'isFavorite' | 'levelKnowledge' | 'assignedGroups' | 'language' | 'date'>
export type IUserWordGroup = Pick<WordGroupModel, '_id' | 'name' | 'wordQuantity' | 'shareForAll' | 'language'>

export interface VerbWithConjugationModel extends Document {
      verb: string;
      past?: Conjugation;
      present?: PresentConjugation;
      future?: Conjugation;
      _id: string
}

export interface VerbsInCache extends Document {
      verbsInCache: Map<string, VerbWithConjugations>
}

export interface RequestedVerbTime {
      future?: boolean;
      present?: boolean;
      past?: boolean
}

export interface SaveVerbsRequestData {
      verbs: VerbWithConjugationsForSave[],
      assignedGroups: string[]
}

export interface VerbWithConjugationsForSave {
      selected: boolean;
      verb: string;
      translation: string;
      past?: Conjugation;
      present?: PresentConjugation;
      future?: Conjugation;
}


