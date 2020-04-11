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
const passport_2 = __importDefault(require("./middleware/passport"));
const language_1 = require("./routes/language");
// const cors = require('cors');
// const path = require('path')
const keys = require('./config/keys');
console.log('KEYS', keys);
const app = express_1.default();
mongoose_1.default
    .connect(keys.mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(() => console.log("MongoDb connected"))
    .catch(err => console.log(err));
app.use(passport_1.default.initialize());
passport_2.default(passport_1.default);
app.use(morgan_1.default("dev"));
app.use(cors_1.default());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use("/api/auth", new auth_1.AuthRoutes().router);
app.use("/api/vocabulary", new words_1.WordsRoutes().router);
app.use("/api/languages", new language_1.LanguagesRoutes().router);
if (process.env.NODE_ENV === 'production') {
    app.use(express_1.default.static('client/dist/word-training'));
    app.get('*', (req, res) => {
        res.sendFile(path_1.default.resolve(__dirname, 'client', 'dist', 'word-training', 'index.html'));
    });
}
exports.default = app;
//# sourceMappingURL=app.js.map