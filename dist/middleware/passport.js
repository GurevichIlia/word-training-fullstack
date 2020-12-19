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
// import keys from "../config/keys";
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const User_1 = __importDefault(require("../Models/User"));
const keys = require('./../config/keys');
const JwtStrategy = passport_jwt_1.default.Strategy;
const ExtractJwt = passport_jwt_1.default.ExtractJwt;
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: keys.jwt
};
const passportCheck = (passport) => {
    passport.use(new JwtStrategy(options, (payload, done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield User_1.default.findById(payload.userId).select("email id currentLanguage");
            if (user) {
                done(null, user);
            }
            else {
                done(null, false);
            }
        }
        catch (error) {
            throw error;
        }
    })));
};
exports.default = passportCheck;
//# sourceMappingURL=passport.js.map