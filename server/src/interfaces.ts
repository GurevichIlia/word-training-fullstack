import { Document } from "mongoose";


export interface UserModel extends Document {
      readonly _id: string
      nickName?: string;
      email: string;
      password: string;
      currentLanguage: Language | null,
      userLanguages: Language[],
      wordGroups: WordGroupModel[],
      wordsForBackup: WordModel[]
      words: WordModel[]
}

export interface WordModel extends Document {
      readonly _id: string;
      word: string;
      translation: string;
      isFavorite?: boolean;
      levelKnowledge: number;
      assignedGroups: string[];
      language: Object,
      date: string
}

export interface WordModelAsObject {
      [key: string]: WordModel
}

export interface Language extends Document {
      readonly _id: string
      langName: string;
}

export interface WordGroupModel extends Document {
      _id: string,
      name: string,
      wordQuantity: number,
      shareForAll: boolean;
      language: string
}

export interface GeneralWord extends Document {
      readonly _id: number;
      word: string;
      translation: string;
      assignedGroups: string[];
      language: string
}


export interface afterCSV {
      insertedCount: number
      insertedIds: object
      ops: []
      result: object
}

export type IUserWord = Pick<WordModel, '_id' | 'translation' | 'word' | 'isFavorite' | 'levelKnowledge' | 'assignedGroups' | 'language' | 'date'>
export type IUserWordGroup = Pick<WordGroupModel, '_id' | 'name' | 'wordQuantity' | 'shareForAll' | 'language'>

