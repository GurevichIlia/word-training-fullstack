import mongoose from "mongoose";
import { WordModel } from "../interfaces";

const Schema = mongoose.Schema;

const wordSchema = new Schema({
    word: {
        type: String,
        required: true
    },
    translation: {
        type: Object,
        required: true
    },
    isFavorite: {
        type: Boolean,
        default: false
    },
    levelKnowledge: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: new Date()
    },
    assignedGroups: {
        type: Array,
        default: ['1']
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

const Word = mongoose.model<WordModel>("words", wordSchema);

export default Word;
