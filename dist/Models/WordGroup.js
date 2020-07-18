"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
exports.ALL_WORDS_GROUP = {
    _id: '1',
    name: 'All',
    wordQuantity: 0,
    shareForAll: false
};
exports.FAVORITES = {
    _id: '2',
    name: 'Favorites',
    wordQuantity: 0,
    shareForAll: false,
};
const Schema = mongoose_1.default.Schema;
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
const WordGroup = mongoose_1.default.model("wordGroup", wordGroupSchema);
exports.default = WordGroup;
//# sourceMappingURL=WordGroup.js.map