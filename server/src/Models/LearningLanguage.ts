import mongoose from "mongoose";
import { LearningLanguageModel } from '../interfaces';

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
const LearningLanguage = mongoose.model<LearningLanguageModel>("learningLanguage", userLanguageSchema);
export default LearningLanguage;