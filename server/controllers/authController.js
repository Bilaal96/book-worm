// User Model
import User from "../models/User.js";

// Utils
import { validateLoginCredentials } from "../utils/auth-validation.js";
import {
    TTL_REF_TOKEN,
    signAccessToken,
    signRefreshToken,
} from "../utils/sign-auth-tokens.js";

// Redis Client instance
import redisClient from "../config/init_redis.js";

// Calculate Refresh Cookie TTL (Time-To-Live in milliseconds)
const TTL_REF_COOKIE = TTL_REF_TOKEN * 1000;
// Define Refresh Cookie options
const secureCookieOptions = {
    httpOnly: true,
    sameSite: "None",
    secure: true,
};
const refreshCookieOptions = {
    maxAge: TTL_REF_COOKIE,
    path: "/auth/refresh",
    ...secureCookieOptions,
};

// POST /auth/signup
const signup_post = async (req, res, next) => {
    console.log("\n", "--- signup_post ---");
    const { firstName, lastName, email, password } = req.body;

    try {
        /** User.create() - attempt to create user
         * Form data validation is handled by mongoose (at schema level)
         * Errors are thrown if user credentials are invalid, or user already exists
         * Errors are handled by middleware (see handleAuthError.js)
         */
        const user = await User.create({
            firstName,
            lastName,
            email,
            password, // hashed in mongoose pre-save hook
        });

        // Create access & refresh token pair
        const accessToken = await signAccessToken(user);
        const refreshToken = await signRefreshToken(user);

        // Create HTTP-only cookie that encapsulates refreshToken
        res.cookie("RF_TK", refreshToken, refreshCookieOptions);

        // Response: 201 (Created)
        // Send accessToken & user details to client
        res.status(201).send({
            message: "User created",
            accessToken,
        });
    } catch (err) {
        // Forward err to handleSignupError middleware
        next(err);
    }
};

// POST /auth/login
const login_post = async (req, res, next) => {
    console.log("\n", "--- login_post ---");
    // Get user credentials from req.body
    const { email, password } = req.body;

    // Check that user credentials entered are in expected format
    const { isValid, errors } = validateLoginCredentials(email, password);

    // User credentials are NOT valid, prevent login and throw error
    if (!isValid) {
        let err = new Error("invalid login credentials");

        // Pass user-input validation errors to handleLoginError
        err.validationErrors = errors;
        return next(err);
    }

    // User credentials are VALID, attempt Login
    try {
        const user = await User.login(email, password);
        console.log("VALID USER:", user);

        // Create access & refresh token pair
        const accessToken = await signAccessToken(user);
        const refreshToken = await signRefreshToken(user);

        // Create HTTP-only cookie that encapsulates refreshToken
        res.cookie("RF_TK", refreshToken, refreshCookieOptions);

        // Response: 200 (OK)
        // Send accessToken & user details to client
        res.status(200).json({
            message: "User logged in",
            accessToken,
        });
    } catch (err) {
        // Forward err to handleLoginError middleware
        console.log("LOGIN ERROR", err.message);
        next(err);
    }
};

// GET /auth/refresh
const refresh_get = async (req, res, next) => {
    console.log("\n", "--- refresh_get ---");
    try {
        // Once refresh token is approved, it's decoded payload is forwarded to this middleware; accessible under "req.refTokenPayload"
        // Below, the payload is used to reconstruct the user object with properties expected by the token signing functions
        const payload = req.refTokenPayload;
        const user = {
            id: payload.sub,
            email: payload.email,
            firstName: payload.given_name,
            lastName: payload.family_name,
        };

        // Renew auth tokens
        const newAccessToken = await signAccessToken(user);
        const newRefreshToken = await signRefreshToken(user);

        // Create HTTP-only cookie that encapsulates newRefreshToken
        res.cookie("RF_TK", newRefreshToken, refreshCookieOptions);

        // Send new auth tokens to client
        res.status(200).json({
            message: "Tokens refreshed",
            accessToken: newAccessToken,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// GET /auth/logout
const logout_get = (req, res, next) => {
    console.log("\n", "--- logout_get ---");
    try {
        // Passed by middleware: verifyAccessToken
        const { accessToken, decodedToken } = req;

        /** Calculate time remaining (in seconds) till expiration of accessToken
         * Access Token (AT) is still technically valid after logout as it has not expired
         * We must revoke the AT, by storing it in a blacklist in the Redis cache, until it expires
         * To ensure that the Redis cache deletes the revoked AT on expiration, we must calculate the ATs remaining Time-to-Live (TTL)
         * NOTE: all values calculated are in seconds (as expected by redisClient)
         */
        // Get total TTL of access token (in seconds)
        const ttlAccessToken = decodedToken.exp - decodedToken.iat;
        // Calculate seconds passed since token was issued
        const secondsSinceIssued =
            Math.floor(Date.now() / 1000) - decodedToken.iat;
        // Calculate remaining TTL of accessToken (in seconds)
        const ttlRevokedAccessToken = ttlAccessToken - secondsSinceIssued;

        // Revoke / blacklist accessToken
        redisClient.setex(
            "BL_" + decodedToken.sub,
            ttlRevokedAccessToken,
            accessToken
        );

        // Clear refresh token from redis cache
        redisClient.del("RF_" + decodedToken.sub);

        // Destroy Refresh Cookie - reset & expire cookie in client
        res.cookie("RF_TK", "", {
            maxAge: 1,
            path: "/auth/refresh",
            ...secureCookieOptions,
        });

        // Log headers - ensure set-cookie & CORS headers are set
        console.log("HEADERS", res.getHeaders());

        // Send redirect response on logout + message
        res.status(301).json({ message: "User logged out" });
    } catch (err) {
        // log error and forward to appropriate error handling middleware
        console.log(err);
        next(err);
    }
};

export default {
    signup_post,
    login_post,
    refresh_get,
    logout_get,
};
