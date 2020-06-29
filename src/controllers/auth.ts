import { UserModel } from "../interfaces";
import { Response, Request } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../Models/User";
import errorHandler from "../utils/errorHandler";
import { userInfo } from "os";
// import keys from "../config/keys";
const keys = require('./../config/keys')
export class AuthController {

    public login = async (req: Request, res: Response) => {
        const candidate = await User.findOne({ email: req.body.email });
        console.log('GETTING DATA FOR LOGIN', req.body)
        if (candidate) {
            const passwordResult = bcrypt.compareSync(
                req.body.password,
                candidate.password
            );

            if (passwordResult) {
                const token = jwt.sign(
                    {
                        email: candidate.email,
                        userId: candidate._id
                    },
                    keys.jwt,
                    // { expiresIn: 390 * 90 }
                );

                res.status(200).json({
                    token: `Bearer ${token}`,
                    message: "Successfully",
                    userId: candidate._id,
                    currentLanguage: candidate.currentLanguage
                });
            } else {
                res.status(401).json({
                    message: "Password is not correct"
                });
            }
        } else {
            res.status(404).json({
                message: "Email is not found"
            });
        }

    };

    public registration = async (req: Request, res: Response) => {
        const body: UserModel = req.body;
        const candidate = await User.findOne({ email: body.email });

        if (candidate) {
            res.status(409).json({
                message: "This email is already exist"
            });
        } else {
            const salt = bcrypt.genSaltSync(10);
            const password = body.password;
            const user = new User({
                email: body.email,
                password: bcrypt.hashSync(password, salt),
                nickName: body.nickName
            });

            try {
                await user.save();
                res.status(201).json(user);
            } catch (error) {
                errorHandler(res, error);
            }
        }
    };

    public getUserId = async (req: Request, res: Response) => {
        try {
            const user = await User.findOne({ _id: req.user })

            if (user) {
                res.status(200).json({ userId: user._id })
            }
        } catch (error) {
            errorHandler(res, error);

        }
    }
}


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
