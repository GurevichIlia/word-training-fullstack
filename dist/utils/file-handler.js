"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
class FileHandler {
    deleteFile(filePath) {
        fs_1.default.unlink(filePath, function (err) {
            if (err) {
                throw err;
            }
            else {
                console.log("Successfully deleted the file.");
            }
        });
    }
    pathToSave() {
        return process.env.NODE_ENV === 'production' ? '/tmp' : './tmp/';
    }
}
exports.FileHandler = FileHandler;
//# sourceMappingURL=file-handler.js.map