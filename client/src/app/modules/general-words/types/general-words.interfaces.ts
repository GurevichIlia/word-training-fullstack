import { Word } from 'src/app/shared/interfaces';

export interface GeneralWord extends Word {
  user: string;
}

export interface IDeleteGeneralWordResponse {
  word: GeneralWord,
  message: string,
  words: GeneralWord[]
}
