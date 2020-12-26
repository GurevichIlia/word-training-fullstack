"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const words_1 = require("./routes/words");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
// import keys from "./config/keys";
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const auth_1 = require("./routes/auth");
const passport_1 = __importDefault(require("passport"));
const passport_2 = require("./middleware/passport");
const language_1 = require("./routes/language");
const word_group_1 = require("./routes/word-group");
// import { initAuth } from './utils/google-sheets';
// const cors = require('cors');
// const path = require('path')
const keys = require('./config/keys');
const app = express_1.default();
// const initGoolgeSheetsAuth = initAuth
// initGoolgeSheetsAuth()
mongoose_1.default
    .connect(keys.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(() => console.log("MongoDb connected"))
    .catch(err => console.log(err));
app.use(body_parser_1.default.json({ limit: '50mb' }));
app.use(body_parser_1.default.urlencoded({ limit: '50mb', extended: true }));
app.use(passport_1.default.initialize());
passport_2.passportCheck(passport_1.default);
// googleAuth(passport)
app.use(morgan_1.default("dev"));
app.use(cors_1.default());
app.use("/api/auth", new auth_1.AuthRoutes().router);
app.use("/api/vocabulary", new words_1.WordsRoutes().router);
app.use("/api/languages", new language_1.LanguagesRoutes().router);
app.use("/api/word-group", new word_group_1.WordGroupRoutes().router);
// console.log('SENDING HTML', path.resolve(
//     '', 'client', 'dist', 'word-training', 'index.html'
// ))
if (process.env.NODE_ENV === 'production') {
    app.use(express_1.default.static('client/dist/word-training'));
    app.get('*', (req, res) => {
        // console.log('SENDING PATH', path.resolve(
        //     'client', 'dist', 'word-training', 'index.html'))
        res.sendFile(path_1.default.resolve(__dirname, 'client', 'dist', 'word-training', 'index.html'));
    });
}
module.exports = app;
//# sourceMappingURL=app.js.map