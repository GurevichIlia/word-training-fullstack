import { UserModel, Language } from '../interfaces';
import mongoose from 'mongoose'

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
            default: []
      },
      words: {
            type: Array,
            default: []
      },
      userLanguages: {
            type: Array,
            default: []
      }

})
const User = mongoose.model<UserModel>('users', userSchema)
export default User

