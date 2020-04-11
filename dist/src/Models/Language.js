"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
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
const Languages = mongoose_1.default.model("languages", languageSchema);
exports.default = Languages;
//# sourceMappingURL=Language.js.map