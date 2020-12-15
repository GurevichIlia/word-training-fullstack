"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
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
const Word = mongoose_1.default.model("words", wordSchema);
exports.default = Word;
//# sourceMappingURL=Word.js.map