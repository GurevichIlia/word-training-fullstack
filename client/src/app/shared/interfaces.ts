export interface User {
  email: string;
  password: string;
  nickName?: string;
  currentLanguage?: string;
  readonly _id?: string;
}

export interface Word {
  word: string;
  translation: string;
  isFavorite?: boolean;
  readonly _id?: string;
  knowen?: boolean;
  levelKnowledge?: number;
  assignedGroups?: string[];
}

export interface GeneralWord extends Word {
  user: string;
}

export interface Language {
  name: string;
  _id?: string;
  isSelected?: boolean;
  flag?: string;
}

export interface WordGroup {
  _id: string;
  name: string;
  wordQuantity: number;
  shareForAll: boolean;
}

export interface LanguageResponse {
  currentLanguage: Language;
  message: string;
}

export class MenuItem {
  constructor(
    public title: string,
    public action: string,
    public icon: string
  ) {

  }

}
