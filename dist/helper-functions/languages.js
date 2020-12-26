"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../Models/User"));
const UserLanguage_1 = __importDefault(require("../Models/UserLanguage"));
function getUserLanguages(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const userLanguages = yield UserLanguage_1.default.find({ userId: user._id });
        const transformedUserLanguages = userLanguages.map(lang => ({ name: lang.name, userId: lang.userId, _id: lang.langId.toString() }));
        return transformedUserLanguages;
    });
}
exports.getUserLanguages = getUserLanguages;
function getLearningLanguage(user) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const language = yield UserLanguage_1.default.findOne({ userId: user._id, langId: (_a = user.currentLanguage) === null || _a === void 0 ? void 0 : _a._id });
        if (language) {
            return { _id: language.langId, name: language.name };
        }
        else {
            User_1.default.findOneAndUpdate({ _id: user._id }, { currentLanguage: null }, { new: true });
            return null;
        }
    });
}
exports.getLearningLanguage = getLearningLanguage;
//# sourceMappingURL=languages.js.map