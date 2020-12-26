// import keys from "../config/keys";
import Passport from "passport-jwt";
import User from "../Models/User";

const keys = require('./../config/keys')
const JwtStrategy = Passport.Strategy;
const ExtractJwt = Passport.ExtractJwt;
// const GoogleStrategy = PassportGoogleOAuth2.Strategy

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: keys.jwt
};

const passportCheck = (passport: {
    use: (arg0: Passport.Strategy) => void;
}) => {
    passport.use(
        new JwtStrategy(options, async (payload, done) => {
            try {
                const user = await User.findById(payload.userId).select("email id currentLanguage");
                if (user) {

                    done(null, user);
                } else {
                    done(null, false);
                }
            } catch (error) {
                throw error;

            }
        })
    );
};

// const googleAuth = (passport: {
//     use: (arg0: PassportGoogleOAuth2.Strategy) => void
// }) => {
//     passport.use(
//         new GoogleStrategy(
//             {
//                 clientID: keys.GOOGLE_CLIENT_ID,
//                 clientSecret: keys.GOOGLE_CLIENT_SECRET,
//                 callbackURL: 'api/auth/google/callback'

//             },
//             async (accessToken, refreshToken, profile, done) => {
//                 console.log('ACCESS TOKEN', accessToken)
//                 try {
//                     if (profile) {
//                         console.log( profile)
//                         done(null, profile);
//                     } else {
//                         done(null, false);
//                     }
//                 } catch (error) {
//                     throw error;

//                 } console.log(profile)
//             }
//         )
//     )
// }
export { passportCheck };
