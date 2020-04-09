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
      isFavorite: boolean;
      readonly _id?: string;
      knowen?: boolean;
}

export interface Language {
      name: string;
      _id?: string;
}