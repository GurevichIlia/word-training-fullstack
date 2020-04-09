import { Language } from "./../interfaces";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const languageSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    quantityWords: {
        type: Number,
    },
    user: {
        ref: "users",
        type: Schema.Types.ObjectId
    }
});
const Languages = mongoose.model<Language>("languages", languageSchema);
export default Languages;
