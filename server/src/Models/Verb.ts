import mongoose from "mongoose";
import { VerbModel, Conjugation } from "../interfaces";

const Schema = mongoose.Schema;

const verbSchema = new Schema({
      word: {
            type: String,
            unique: true,
            required: true
      },
      translation: {
            type: Object,
      },
      isFavorite: {
            type: Boolean,
            default: false
      },
      levelKnowledge: {
            type: Number,
            default: 0
      },
      isShared: {
            type: Boolean,
            default: false
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
      },
      conjugations: {
            type: Object,
      
      }
});

// const Verb = mongoose.model<VerbModel>("verbs", verbSchema);

// export default Verb;