import { WordModel, WordGroupModel, WordModelAsObject } from './../interfaces';
import { UserModel, Language } from '../interfaces';
import mongoose from 'mongoose'
import { ALL_WORDS_GROUP, FAVORITES } from './WordGroup';

const Schema = mongoose.Schema


const userSchema = new Schema({
      email: {
            type: String,
            unique: true,
            required: true
      },
      password: {
            type: String,
            required: true
      },
      nickName: {
            type: String,
            required: true
      },
      currentLanguage: {
            type: Object,
            default: ''
      },
      wordGroups: {
            type: Array,
            default: <WordGroupModel[]>[]
      },
      words: {
            type: Array,
            default: <WordModel[]>[]
      },
      wordsForBackup:
      {
            type: Array,
            default: <WordModel[]>[]
      },
      wordsAsObject: {
            type: Object,
            default: <WordModelAsObject>{}
      },
      userLanguages: {
            type: Array,
            default: <Language[]>[]
      }

})
const User = mongoose.model<UserModel>('users', userSchema)
export default User

