import { LanguageInterface } from '../modules/languages/types/languages.interfaces';

export interface CurrentUserInterface {
  email: string;
  password: string;
  nickName?: string;
  currentLanguage?: LanguageInCurrentUser | null;
  readonly _id?: string;
  userLanguages: LanguageInterface[]
  wordGroups: WordGroup[]
  words: Word[]
}

export interface LanguageInCurrentUser {
  name: string;
  _id?: string;
}

export interface Word {
  word: string;
  translation: string;
  isFavorite?: boolean | null;
  readonly _id?: string;
  knowen?: boolean;
  levelKnowledge?: number;
  assignedGroups?: string[];
  date?: string;
}


export class WordGroup {
  _id: string;
  name: string;
  wordQuantity: number;
  shareForAll: boolean;
  constructor({ _id, name, wordQuantity, shareForAll }) {
    this._id = _id,
      this.name = name,
      this.wordQuantity = wordQuantity,
      this.shareForAll = shareForAll;
  }

}




