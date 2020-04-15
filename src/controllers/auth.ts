import { UserModel } from "../interfaces";
import { Response, Request } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../Models/User";
import errorHandler from "../utils/errorHandler";
// import keys from "../config/keys";
import { keys } from './../config/keys';
export class AuthController {

    public login = async (req: Request, res: Response) => {
        const candidate = await User.findOne({ email: req.body.email });

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
                    { expiresIn: 90 * 90 }
                );

                res.status(200).json({
                    token: `Bearer ${token}`,
                    message: "Successfully",
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
