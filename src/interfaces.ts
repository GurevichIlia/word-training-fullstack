import { Document } from "mongoose";

export interface UserModel extends Document {
      _id: string
      nickName?: string;
      email: string;
      password: string;
}

export interface WordModel extends Document {
      _id: number;
      word: string;
      translate: string;
      isFavorite?: boolean;
}

export interface Language extends Document {
      langName: string;
}



