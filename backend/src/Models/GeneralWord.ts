import mongoose from 'mongoose';
import { GeneralWord } from '../interfaces';

const Schema = mongoose.Schema;
const generalWordSchema = new Schema({
      word: {
            type: String,
            required: true
      },
      translation: {
            type: String,
            required: true
      },
      assignedGroups: {
            type: Array,
            default: []
      },
      user: {
            ref: "users",
            type: Schema.Types.ObjectId
      },
      language: {
            ref: "languages",
            type: Schema.Types.ObjectId
      },


})

const GeneralWord = mongoose.model<GeneralWord>("generalWords", generalWordSchema);

export default GeneralWord;