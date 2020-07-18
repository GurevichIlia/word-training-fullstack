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
// const cors = require('cors');
// const path = require('path')
const keys = require('./config/keys')

const app: express.Application = express();

mongoose
    .connect(keys.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => console.log("MongoDb connected"))
    .catch(err => console.log(err));

app.use(passport.initialize());
passportCheck(passport);


app.use(Morgan("dev"));
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/auth", new AuthRoutes().router);
app.use("/api/vocabulary", new WordsRoutes().router);
app.use("/api/languages", new LanguagesRoutes().router);
app.use("/api/word-group", new WordGroupRoutes().router);

process.env.NODE_ENV = 'production'
console.log('SENDING HTML', path.resolve(
    __dirname, 'client', 'dist', 'word-training', 'index.html'
))
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/dist/word-training'))

    app.get('*', (req, res) => {
        res.sendFile(

            path.resolve(
                __dirname, 'client', 'dist', 'word-training', 'index.html'
            )
        )


    })
}
module.exports = app;