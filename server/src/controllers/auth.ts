import { IRequestUserInfo, UserModel } from "../interfaces";
import { Response, Request } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../Models/User";
import errorHandler from "../utils/errorHandler";
const sendgrid = require('nodemailer-sendgrid-transport')
const keys = require('./../config/keys')
const baseConf = require('../config/base')
// const transporter = nodemailer.createTransport(sendgrid({
//     auth: { api_key: baseConf.SENDGRID_API_KEY }
// }))
// import keys from "../config/keys";
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
                    // { expiresIn: 390 * 90 }
                );

                res.status(200).json({
                    token: `Bearer ${token}`,
                    message: "Successfully",
                    currentUser: candidate,
                    currentLanguage: candidate.currentLanguage
                });

                // await transporter.sendMail(Emails.forgotPassword('solfire@yandex.ru'))

            } else {
                res.status(401).json({
                    message: "Password or email is  incorrect"
                });
            }
        } else {
            res.status(404).json({
                message: "Email is not found"
            });
        }

    };


    public googleLogin = async (res: Response, req: Request) => {
        console.log('REQUEST DATA', req.user)
        // let user = {
        //     displayName: req.user.displayName,
        //     name: req.user.name.givenName,
        //     email: req.user._json.email,
        //     provider: req.user.provider
        // }
        // console.log(user)

        // // FindOrCreate(user)
        // let token = jwt.sign({
        //     data: user
        // }, 'secret', { expiresIn: 60 }); // expiry in seconds
        // res.cookie('jwt', token)
        // res.redirect('/')
    }

    public registration = async (req: Request, res: Response) => {
        const body: UserModel = req.body;
        const candidate = await User.findOne({ email: body.email });
        // console.log('CANDIDATE', candidate)

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

    public getCurrentUser = async (req: Request, res: Response) => {
        try {
            const user = req.user as IRequestUserInfo

            // const user = await User.findOne({ _id: req.user })

            if (user) {
                // const userClone = { ...user, password: '' }
                res.status(200).json(user)
            }
        } catch (error) {
            errorHandler(res, error);

        }
    }

}

