import mongoose from "mongoose";
import { WordGroupModel } from "../interfaces";

const Schema = mongoose.Schema;

const wordGroupSchema = new Schema({
      name: {
            type: String,
            required: true
      },
      wordQuantity: {
            type: Number,
            default: 0
      },
      shareForAll: {
            type: Boolean,
            default: false
      },
      language: {
            ref: "languages",
            type: Schema.Types.ObjectId
      },
      user: {
            ref: "users",
            type: Schema.Types.ObjectId
      }
});

const WordGroup = mongoose.model<WordGroupModel>("wordGroup", wordGroupSchema);

export default WordGroup;