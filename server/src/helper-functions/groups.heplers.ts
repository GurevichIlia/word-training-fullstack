import { getWordsByLanguage } from '.';
import { WordGroupModel, WordModel, IUserWordGroup } from '../interfaces';
import { ALL_WORDS_GROUP, FAVORITES } from '../Models/WordGroup';

export const setQuantityWordsInGroups = (groups: WordGroupModel[], words: WordModel[]): IUserWordGroup[] => {
      if (!words || words.length === 0) return groups

      const updatedGroups = groups.map(group => {
            if (group._id == '1') {
                  const newGroup = { ...group, wordQuantity: words.length };

                  return newGroup
            }

            if (group._id == '2') {
                  const newGroup = {
                        ...group, wordQuantity: words.filter(word => word.isFavorite === true).length
                  };
                  return newGroup
            }

            const quantity = words.filter(word => word.assignedGroups.includes(group._id.toString()));
            group.wordQuantity = quantity.length
            // console.log('COUNTED WORDS GROUPS', words.filter(word => console.log(word.assignedGroups[1], group._id)).length)

            return group;
      });

      return updatedGroups;

}

export const getAllUserGroups = (userGroups: WordGroupModel[], languageId: string, userWords: WordModel[]): IUserWordGroup[] => {
      let allGroups = [...getDefaultGroups(), ...userGroups]
      const words = getWordsByLanguage(languageId, userWords)
      const groups = setQuantityWordsInGroups(allGroups, words);
      return groups
}

export const getDefaultGroups = () => {
      return [ALL_WORDS_GROUP, FAVORITES] as WordGroupModel[]
}