"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWordsByLanguage = (langaugeId, userWords) => {
    if (!langaugeId || !userWords)
        return [];
    const words = userWords.filter(word => word.language.toString() === langaugeId.toString());
    return words;
};
//# sourceMappingURL=get-words-by-language.js.map