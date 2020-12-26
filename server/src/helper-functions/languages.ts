import { ILearningLanguage, IUserLanguage, Language } from '../interfaces';
import User from '../Models/User';
import UserLanguage from '../Models/UserLanguage';
import { IRequestUserInfo } from './../interfaces';

export async function getUserLanguages(user: IRequestUserInfo): Promise<IUserLanguage[]> {
      const userLanguages = await UserLanguage.find({ userId: user._id })
      const transformedUserLanguages = userLanguages.map(lang => ({ name: lang.name, userId: lang.userId, _id: lang.langId.toString() }))

      return transformedUserLanguages
}

export async function getLearningLanguage(user: IRequestUserInfo): Promise<ILearningLanguage | null> {
      const language = await UserLanguage.findOne({ userId: user._id, langId: user.currentLanguage?._id })
      if (language) {
            return { _id: language.langId, name: language.name }
      } else {
            User.findOneAndUpdate({ _id: user._id }, { currentLanguage: null }, { new: true })
            return null
      }

}



