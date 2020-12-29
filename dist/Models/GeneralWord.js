"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
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
    originId: {
        ref: "words",
        type: Schema.Types.ObjectId
    }
});
const GeneralWord = mongoose_1.default.model("generalWords", generalWordSchema);
exports.default = GeneralWord;
//# sourceMappingURL=GeneralWord.js.map