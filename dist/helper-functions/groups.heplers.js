"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const WordGroup_1 = require("../Models/WordGroup");
exports.setQuantityWordsInGroups = (groups, words) => {
    if (!words || words.length === 0)
        return groups;
    const updatedGroups = groups.map(group => {
        if (group._id == '1') {
            const newGroup = Object.assign(Object.assign({}, group), { wordQuantity: words.length });
            return newGroup;
        }
        if (group._id == '2') {
            const newGroup = Object.assign(Object.assign({}, group), { wordQuantity: words.filter(word => word.isFavorite === true).length });
            return newGroup;
        }
        const quantity = words.filter(word => word.assignedGroups.includes(group._id.toString()));
        group.wordQuantity = quantity.length;
        // console.log('COUNTED WORDS GROUPS', words.filter(word => console.log(word.assignedGroups[1], group._id)).length)
        return group;
    });
    return updatedGroups;
};
exports.getAllUserGroups = (userGroups, languageId, userWords) => {
    let allGroups = [...exports.getDefaultGroups(), ...userGroups];
    const words = _1.getWordsByLanguage(languageId, userWords);
    const groups = exports.setQuantityWordsInGroups(allGroups, words);
    return groups;
};
exports.getDefaultGroups = () => {
    return [WordGroup_1.ALL_WORDS_GROUP, WordGroup_1.FAVORITES];
};
//# sourceMappingURL=groups.heplers.js.map