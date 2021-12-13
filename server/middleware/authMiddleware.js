import jwt from "jsonwebtoken";
import redisClient from "../config/init_redis.js";
import CustomError from "../utils/CustomError.js";

/** Verifying Access Token
 * Protects endpoints, only authorising users with valid access token
 * Used to prevent guest/malicious users from performing unauthorised actions
 * e.g. guest users cannot submit requests to CRUD book-list's
 */
export const verifyAccessToken = (req, res, next) => {
    // Get accessToken from Authorization header
    const authHeader = req.header("Authorization");
    const accessToken = authHeader ? authHeader.split(" ")[1] : null;

    // Throw 401 error if no accessToken
    if (!accessToken) return next(CustomError.unauthorized("No access token"));

    // Verify access token using secret
    jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decodedPayload) => {
            if (err) {
                // Invalid token, e.g. due to tampering/expiration
                console.error(err);

                /**
                 * JsonWebTokenError holds important info about the status of the token
                 * Reducing info visible to the client helps to protect against attackers
                 * For JsonWebTokenError, return generic unauthorised message
                 * Otherwise (e.g. NotBeforeError) return error message as thrown
                 */
                const message =
                    err.name === "JsonWebTokenError"
                        ? "Unauthorized"
                        : err.message;
                return next(CustomError.unauthorized(message));
            }

            // Token signature verified
            // Check if token has been revoked (i.e. blacklisted)
            redisClient.get("BL_" + decodedPayload.sub, (err, revokedToken) => {
                if (err) return next(CustomError.internalServer());

                // Token sent with request is blacklisted, deny route access
                if (accessToken === revokedToken)
                    return next(CustomError.unauthorized("Token blacklisted"));

                // NOT Blacklisted, proceed to next middleware in this route
                // Pass next middleware accessToken and it's decoded payload
                console.log("ACCESS TOKEN VERIFIED:", accessToken);
                req.accessToken = accessToken;
                req.decodedToken = decodedPayload; // decoded access token
                next();
            });
        }
    );
};

/** Silent Token Refresh
 * When access token expires, the client will send a request to renew auth tokens
 * The refresh cookie is sent with the request to the /auth/refresh route
 * This function validates the refresh token (stored in the refresh cookie) by:
    1) verifying the token signature
    2) checking if the token is whitelisted in the Redis cache
 * If the refresh token is valid, it is passed to the next middleware in the stack
 * Otherwise, an error is sent to the client
 */
export const verifyRefreshToken = (req, res, next) => {
    const refreshToken = req.cookies.RF_TK;
    if (!refreshToken)
        return next(CustomError.unauthorized("No refresh token"));

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decodedPayload) => {
            // Invalid token, e.g. due to tampering/expiration
            if (err) {
                console.log(err);
                return next(CustomError.unauthorized("Failed to verify token"));
            }

            // Token signature verified
            // Check if refresh token exists in Redis Cache; i.e. is whitelisted
            redisClient.get(
                "RF_" + decodedPayload.sub,
                (err, cachedRefToken) => {
                    if (err) {
                        // NOTE: Client does not need to be aware of issues with Redis
                        console.error(err.message);
                        return next(CustomError.internalServer());
                    }

                    // Refresh tokens (both received and whitelisted) DO NOT match
                    // Only whitelisted tokens can make an /auth/refresh request
                    if (refreshToken !== cachedRefToken)
                        return next(
                            CustomError.unauthorized("Token is not whitelisted")
                        );

                    // Refresh tokens (both received & whitelisted) MATCH
                    // Pass payload of decoded refresh token to next middleware in the stack
                    console.log("\n", "REFRESH TOKEN VERIFIED", refreshToken);
                    req.refTokenPayload = decodedPayload;
                    next();
                }
            );
        }
    );
};

export default {
    verifyAccessToken,
    verifyRefreshToken,
};
