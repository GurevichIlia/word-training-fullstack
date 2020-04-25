"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    nickName: {
        type: String,
        required: true
    },
    currentLanguage: {
        type: Object,
        default: ''
    },
    userLanguages: {
        type: Array,
        default: []
    }
});
const User = mongoose_1.default.model('users', userSchema);
exports.default = User;
//# sourceMappingURL=User.js.map