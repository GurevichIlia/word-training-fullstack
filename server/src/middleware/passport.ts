// import keys from "../config/keys";
import Passport from "passport-jwt";
import User from "../Models/User";

const keys = require('./../config/keys')
const JwtStrategy = Passport.Strategy;
const ExtractJwt = Passport.ExtractJwt;

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

export default passportCheck;
