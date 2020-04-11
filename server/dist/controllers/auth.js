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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../Models/User"));
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
// import keys from "../config/keys";
const keys = require('./../config/keys');
class AuthController {
    constructor() {
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const candidate = yield User_1.default.findOne({ email: req.body.email });
            if (candidate) {
                const passwordResult = bcryptjs_1.default.compareSync(req.body.password, candidate.password);
                if (passwordResult) {
                    const token = jsonwebtoken_1.default.sign({
                        email: candidate.email,
                        userId: candidate._id
                    }, keys.jwt, { expiresIn: 90 * 90 });
                    res.status(200).json({
                        token: `Bearer ${token}`,
                        message: "Successfully",
                        currentLanguage: candidate.currentLanguage
                    });
                }
                else {
                    res.status(401).json({
                        message: "Password is not correct"
                    });
                }
            }
            else {
                res.status(404).json({
                    message: "Email is not found"
                });
            }
        });
        this.registration = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const candidate = yield User_1.default.findOne({ email: body.email });
            if (candidate) {
                res.status(409).json({
                    message: "This email is already exist"
                });
            }
            else {
                const salt = bcryptjs_1.default.genSaltSync(10);
                const password = body.password;
                const user = new User_1.default({
                    email: body.email,
                    password: bcryptjs_1.default.hashSync(password, salt),
                    nickName: body.nickName
                });
                try {
                    yield user.save();
                    res.status(201).json(user);
                }
                catch (error) {
                    errorHandler_1.default(res, error);
                }
            }
        });
    }
}
exports.AuthController = AuthController;
// export const login = async (req: Request, res: Response) => {
//       await console.log('REQUEST', req.body)
// }
// export const registration = async (req: Request, res: Response) => {
//       const body: User = req.body
//       const candidate = await UserModel.findOne({ email: body.email })
//       if (candidate) {
//             res.status(409).json({
//                   message: 'This email is already exist'
//             })
//       } else {
//             // Create user
//       }
//       try {
//       } catch (error) {
//       }
// }
//# sourceMappingURL=auth.js.map