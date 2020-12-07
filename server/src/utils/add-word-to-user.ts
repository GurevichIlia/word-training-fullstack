import { WordModelAsObject } from './../interfaces';
import { WordModel } from '../interfaces';

export function convertArrToObject(words: WordModel[]): WordModelAsObject {

      let wordsAsObject: WordModelAsObject = {}

      words.forEach(word => {
            const wordId = word._id
            const wordLanguage = word.language

            if (!wordsAsObject[wordLanguage]) {
                  wordsAsObject[wordLanguage] = {
                        name: '',
                        words: {}
                  }
            }

            wordsAsObject[wordLanguage].words[wordId] = word
            }


      )
      return wordsAsObject
}