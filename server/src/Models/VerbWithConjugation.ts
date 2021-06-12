import mongoose from "mongoose";
import { VerbsInCache } from "../interfaces";

const Schema = mongoose.Schema;

const hebrewConjugationsCacheStoreSchema = new Schema({
      verbsInCache: {
            type: Map,
            unique: true,
            required: true
      },
});

const HebrewConjugationsCacheStore = mongoose.model<VerbsInCache>("hebrewConjugationsCacheStore", hebrewConjugationsCacheStoreSchema);

export default HebrewConjugationsCacheStore;