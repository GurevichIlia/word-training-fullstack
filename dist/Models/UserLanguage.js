"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const userLanguageSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    langId: {
        type: String,
        required: true
    },
    userId: {
        ref: "users",
        type: Schema.Types.ObjectId
    }
});
const UserLanguage = mongoose_1.default.model("userLanguages", userLanguageSchema);
exports.default = UserLanguage;
//# sourceMappingURL=UserLanguage.js.map