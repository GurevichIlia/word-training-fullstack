import { Document } from "mongoose";

export interface UserModel extends Document {
      readonly _id: string
      nickName?: string;
      email: string;
      password: string;
      currentLanguage?: Language
}

export interface WordModel extends Document {
      readonly _id: number;
      word: string;
      translate: string;
      isFavorite?: boolean;
}

export interface Language extends Document {
      readonly _id: string
      langName: string;
}



