import mongoose from "mongoose";
import { WordGroupModel } from "../interfaces";

export const ALL_WORDS_GROUP: Partial<WordGroupModel> =
{
      _id: '1',
      name: 'All',
      wordQuantity: 0,
      shareForAll: false
};
export const FAVORITES: Partial<WordGroupModel> =
{
      _id: '2',
      name: 'Favorites',
      wordQuantity: 0,
      shareForAll: false,
};

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
      },
      isVerbsGroup: {
            type: Boolean,
            default: false
      }
});

const WordGroup = mongoose.model<WordGroupModel>("wordGroup", wordGroupSchema);

export default WordGroup;