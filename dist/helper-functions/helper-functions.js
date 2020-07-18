"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWordsByLanguage = (langaugeId, userWords) => {
    if (!langaugeId || !userWords)
        return [];
    const words = userWords.filter(word => word.language == langaugeId);
    return words;
};
//# sourceMappingURL=helper-functions.js.map