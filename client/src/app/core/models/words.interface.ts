import { Word } from 'src/app/shared/interfaces';

export interface GetAllUserWordsResponseInterface {
  // [wordId: string]: Word;
  words: Word[]

}

export interface AddUserWordResponseInterface {
  message: string,
  // words: {
  //   [wordId: string]: Word;
  // }
  words: Word[]
}

export interface DeleteUserWordResponseInterface extends AddUserWordResponseInterface {

}

export interface EditUserWordResponseInterface extends AddUserWordResponseInterface {

}
