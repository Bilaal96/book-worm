/**
 * ----- JWT Auth - Implementation Overview -----
 * To authorize user requests we use an Access Token and Refresh Token
 * NOTE: If a JWT is left exposed on the client it can easily be intercepted and decoded by a malicious user 
 * We have taken the following steps to ensure that the JWTs are less accessible from the client:
    - the Access Token is stored in-memory (i.e. client state/variable) allowing us to identify a user in our app
    - the Refresh Token is stored in an HTTP-only Cookie -> inaccessible to the client
 
 * ----- Access Token -----
 * The Access Token is used to identify a user (via its payload) and authorize their requests
 * When sent back to the server, the Access Token is verified
 * It will be denied if it expires or has been tampered with 
    
 * An Access Token is short-lived (15 mins lifespan) to minimise the risk of a malicious user intercepting the token and posing as the user
 * As a result of this, if we ONLY used an Access Token, a user would have to re-authenticate (or login) every time it expires (i.e. every 15 mins) 
 * Having to login back in so often isn't a great user experience

 * ----- Persisting User via Token Rotation -----
 * This is where the Refresh JWT-Cookie comes into play
 * On expiration of an Access Token, we use a Refresh JWT-Cookie to refresh our tokens - i.e. retrieve a fresh Access Token & Refresh JWT-Cookie pair
 * This "rotation" of tokens prevents a user from having to log back in every time the Access Token expires (i.e. every 15 minutes)
 * When we refresh/rotate tokens seamlessly in the background it is known as "Silent Authentication"
 
 * The refresh JWT-Cookie has a longer lifespan than the Access Token
 * We have set it to 30 days, but this can easily be changed to a year 
 * On user logout, both JWT-Cookies are destroyed 
 
 * So as long as a user does not logout, every time the Access Token expires, a Refresh JWT-Cookie will be sent to this server to retrieve a new JWT pair; thus allowing a user to remain logged in

 * The request for Silent Authentication (SA) is issued by the client
 * A user can only be SA'd if a Refresh Token exists, however remember that for security purposes our Refresh Token is stored in a HTTP-only Cookie 
 * As a result of this, the client cannot directly determine if a Refresh Token exists or not
 
 * --- How can we check if a HTTP-only Cookie exists? ---
 * To work around this, we created a 3rd "PERSIST_SESSION" (PS) Cookie  
 * PS Cookie contains no sensitive data, is accessible from the client and only exists if a Refresh JWT-Cookie exists (i.e. it is a "shadow" of the Refresh JWT-Cookie)
 * So the client can indirectly check for a Refresh JWT-Cookie through a valid PS Cookie 
 
 * If a Refresh JWT-Cookie expires then a user can't be silently authenticated, so they are logged out and can't get a new JWT pair until they re-authenticate (i.e. log back in)

 * --- Tracking Validity of JWTs --- 
 * Redis is used to cache & track valid Access & Refresh Tokens
 * Terminology:
    - blacklisted -> added to Redis DB to indicate token is invalid
    - whitelisted -> added to Redis DB to indicate token is valid

 * If an Access Token (AT) is:
    - valid -> it is sent to and stored in-memory by the client  
    - invalid -> it is blacklisted
 * We compare incoming ATs against the blacklist
 * If it is blacklisted, the sender is unauthorized to make requests

 * If a Refresh Token (RT) is:
    - valid -> it is whitelisted 
    - invalid -> removed from whitelist
 * Incoming RTs are compared against the whitelist
 * Tokens can only be refreshed/renewed if the RT exists in the whitelist
 
 NOTE: 
 * Redis will automatically clear expired tokens (white/blacklisted)  
 * Token expiration is defined in seconds
 * Cookie expiration is defined in milliseconds
 */

// User Model
import User from "../models/User.js";

// Utils
import { validateLoginCredentials } from "../utils/form-validators.js";
import {
    TTL_REF_TOKEN,
    signAccessToken,
    signRefreshToken,
} from "../utils/sign-auth-tokens.js";
import CustomError from "../utils/CustomError.js";

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
    ...secureCookieOptions,
    maxAge: TTL_REF_COOKIE,
    path: "/api/auth/refresh",
};

// NOTE: only exists if Refresh Cookie exists (hence "Shadow Cookie"); and is accessible to frontend app
const shadowCookieOptions = {
    ...refreshCookieOptions,
    // Overwrite the following Refresh Cookie options
    path: "/",
    httpOnly: false,
};

// POST /api/auth/signup
const signup_post = async (req, res, next) => {
    console.log("\n", "--- signup_post ---");
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    try {
        if (password !== confirmPassword)
            throw CustomError.forbidden("Passwords do not match");

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
        // Existence of this non-HTTP-only cookie indirectly tells client whether a refresh cookie exists
        // Frontend uses this to prevent token refresh requests when the refresh cookie DOES NOT exist
        res.cookie("PERSIST_SESSION", "true", shadowCookieOptions);

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

// POST /api/auth/login
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
        // Existence of this non-HTTP-only cookie indirectly tells client whether a refresh cookie exists
        // Frontend uses this to prevent token refresh requests when the refresh cookie DOES NOT exist
        res.cookie("PERSIST_SESSION", "true", shadowCookieOptions);

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

// GET /api/auth/refresh
const refresh_get = async (req, res, next) => {
    console.log("\n", "--- refresh_get ---");
    try {
        // Once refresh token is approved, its decoded payload is forwarded to this middleware; accessible under "req.refTokenPayload"
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
        // Existence of this non-HTTP-only cookie indirectly tells client whether a refresh cookie exists
        // Frontend uses this to prevent token refresh requests when the refresh cookie DOES NOT exist
        res.cookie("PERSIST_SESSION", "true", shadowCookieOptions);

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

// GET /api/auth/logout
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

        // Destroy Refresh Cookie & its "shadow" counterpart - reset & expire cookies in client
        res.cookie("RF_TK", "", {
            ...secureCookieOptions,
            ...refreshCookieOptions,
            maxAge: 1, // overwrite maxAge to expire in 1ms
        });
        res.cookie("PERSIST_SESSION", "", {
            ...shadowCookieOptions,
            maxAge: 1, // overwrite maxAge to expire in 1ms
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
