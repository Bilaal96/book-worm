import jwt from "jsonwebtoken";
import redisClient from "../config/init_redis.js";
import CustomError from "./CustomError.js";

// Calculate Token Time-To-Live (TTL); i.e. Lifetime (in seconds)
export const TTL_ACC_TOKEN = 15 * 60; // 15 minutes in seconds

// NOTE: TTL of Refresh Cookie (in milliseconds) = TTL_REF_TOKEN * 1000
const SECONDS_PER_DAY = 60 * 60 * 24;
const REF_DAYS_TO_EXPIRY = 30;
export const TTL_REF_TOKEN = REF_DAYS_TO_EXPIRY * SECONDS_PER_DAY;
// export const TTL_REF_TOKEN = 10; //! TESTING-ONLY (10 seconds)

/** Notes on Token Signing
 * Token Claims Reference: https://iana.org/assignments/jwt/jwt.xhtml
 * NOTE: when signing any token, the "sub" (or subject) claim should have value of user.id (string), rather than user._id (object) because:
    1) we don't have to stringify user.id 
    2) Redis entries should be compact to conserve memory,
       and user.id is shorter than user._id
 */

// Access Token
export const signAccessToken = (user) => {
    return new Promise((resolve, reject) => {
        // Token Claims Reference: https://iana.org/assignments/jwt/jwt.xhtml
        const payload = {
            sub: user.id,
            email: user.email,
            given_name: user.firstName,
            family_name: user.lastName,
        };
        const secret = process.env.ACCESS_TOKEN_SECRET;
        const options = { expiresIn: TTL_ACC_TOKEN };
        // const options = { expiresIn: 10 }; //! TESTING-ONLY (10 seconds)

        // Sign access token with secret
        jwt.sign(payload, secret, options, (err, accessToken) => {
            if (err) {
                console.error(err.message);
                return reject(err);
            }
            console.log("ACCESS TOKEN SIGNED:", accessToken);
            resolve(accessToken);
        });
    });
};

// Refresh Token
export const signRefreshToken = (user) => {
    return new Promise((resolve, reject) => {
        // Token Claims Reference: https://iana.org/assignments/jwt/jwt.xhtml
        const payload = {
            sub: user.id,
            email: user.email,
            given_name: user.firstName,
            family_name: user.lastName,
        };
        const secret = process.env.REFRESH_TOKEN_SECRET;
        const options = { expiresIn: TTL_REF_TOKEN };

        // Sign refresh token with secret
        jwt.sign(payload, secret, options, (err, refreshToken) => {
            if (err) {
                console.error(err.message);
                return reject(err);
            }

            // Whitelist refresh token, using Redis as cache
            // Tokens can only be renewed if refresh token is whitelisted
            redisClient.setex(
                "RF_" + user.id,
                TTL_REF_TOKEN,
                refreshToken,
                (err, reply) => {
                    if (err) {
                        console.error(err.message);
                        return reject(CustomError.internalServer());
                    }

                    // Successfully stored in Redis cache, return Token
                    console.table({
                        cacheReply: reply,
                        userId: user.id,
                    });
                    console.log("REFRESH TOKEN SIGNED:", refreshToken);
                    resolve(refreshToken);
                }
            );
        });
    });
};
