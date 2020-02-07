import { WordsRoutes } from "./routes/words";
import express from "express";
import mongoose from "mongoose";
import keys from "./config/keys";
import bodyParser from "body-parser";
import path from "path";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cors from "cors";
import Morgan from "morgan";
import { AuthRoutes } from "./routes/auth";
import passport from "passport";
import passportCheck from "./middleware/passport";
import { LanguagesRoutes } from "./routes/language";
// const cors = require('cors');
// const path = require('path')

const app: express.Application = express();

mongoose
    .connect(keys.mongoUri, {
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

export default app;
