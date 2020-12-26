import mongoose from "mongoose";
import { UserLanguageModel } from '../interfaces';

const Schema = mongoose.Schema;

const userLanguageSchema = new Schema({
      name: {
            type: String,
            required: true
      },
      langId: {
            type: String,
            required: true
      },
      userId: {
            ref: "users",
            type: Schema.Types.ObjectId
      }
});
const UserLanguage = mongoose.model<UserLanguageModel>("userLanguages", userLanguageSchema);
export default UserLanguage;