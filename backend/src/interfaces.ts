
import { Document } from "mongoose";

export interface UserModel extends Document {
      readonly _id: string
      nickName?: string;
      email: string;
      password: string;
      currentLanguage?: Language,
      userLanguages: Language[],
      wordGroups: WordGroupModel[],
      words: WordModel[]
}

export interface WordModel extends Document {
      readonly _id: number;
      word: string;
      translation: string;
      isFavorite?: boolean;
      levelKnowledge: number;
      assignedGroups: string[];
      language: string,
      date: string
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
}

export interface GeneralWord extends Document {
      readonly _id: number;
      word: string;
      translation: string;
      assignedGroups: string[];
      language: string
}
