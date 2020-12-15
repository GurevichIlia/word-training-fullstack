import { WordsRoutes } from "./routes/words";
import express from "express";
import mongoose from "mongoose";
import path from "path"
// import keys from "./config/keys";
import bodyParser from "body-parser";
import cors from "cors";
import Morgan from "morgan";
import { AuthRoutes } from "./routes/auth";
import passport from "passport";
import passportCheck from "./middleware/passport";
import { LanguagesRoutes } from "./routes/language";
import { WordGroupRoutes } from "./routes/word-group";
// import { initAuth } from './utils/google-sheets';
// const cors = require('cors');
// const path = require('path')
const keys = require('./config/keys')
const app: express.Application = express();
// const initGoolgeSheetsAuth = initAuth
// initGoolgeSheetsAuth()
mongoose
    .connect(keys.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => console.log("MongoDb connected"))
    .catch(err => console.log(err));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(passport.initialize());
passportCheck(passport);


app.use(Morgan("dev"));
app.use(cors());


app.use("/api/auth", new AuthRoutes().router);
app.use("/api/vocabulary", new WordsRoutes().router);
app.use("/api/languages", new LanguagesRoutes().router);
app.use("/api/word-group", new WordGroupRoutes().router);

// process.env.NODE_ENV = 'production'
console.log('SENDING HTML', path.resolve(
    '', 'client', 'dist', 'word-training', 'index.html'
))
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/dist/word-training'))

    app.get('*', (req, res) => {
        console.log('SENDING PATH', path.resolve(
            'client', 'dist', 'word-training', 'index.html'))

        res.sendFile(
            path.resolve(
               __dirname, 'client', 'dist', 'word-training', 'index.html'
            )
        )


    })
}
module.exports = app;