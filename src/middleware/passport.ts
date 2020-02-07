import keys from "./../config/keys";
import Passport from "passport-jwt";
import User from "../Models/User";
import errorHandler from "../utils/errorHandler";

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
                console.log("PAYLOAD", payload);
                const user = await User.findById(payload.userId).select("email id");
                if (user) {
                  console.log("USER", user);

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
