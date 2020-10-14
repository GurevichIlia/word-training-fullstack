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
// const csv = require('csvtojson')
const csvtojson_1 = __importDefault(require("csvtojson"));
class CSVtoJson {
    static createJsonArray(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const csvFile = file;
            console.log('CSV FILE', file);
            csvtojson_1.default()
                .fromFile(csvFile);
            // .then((jsonObj: any) => {
            //       console.log(jsonObj);
            //       /**
            //        * [
            //        * 	{a:"1", b:"2", c:"3"},
            //        * 	{a:"4", b:"5". c:"6"}
            //        * ]
            //        */
            // })
            const jsonArray = yield csvtojson_1.default().fromFile(csvFile);
            console.log('JSON ARRA', jsonArray)
            return jsonArray;
        });
    }
}
exports.CSVtoJson = CSVtoJson;
//# sourceMappingURL=csv-to-json.js.map