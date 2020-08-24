import { WordModel } from './../interfaces';



export const getWordsByLanguage = (langaugeId: string, userWords: WordModel[]) => {

      if (!langaugeId || !userWords) return [];

      const words = userWords.filter(word => word.language == langaugeId);

      return words
}