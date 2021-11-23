import jwt from "jsonwebtoken";
import { validateLoginCredentials } from "../utils/auth-validation.js";

// User Model
import User from "../models/User.js";

// Cookie/JWT Expiration
const daysTillExpired = 3;
const secondsInOneDay = 60 * 60 * 24;
// jwt.sign() - 'expiresIn' option required in seconds
const maxAgeInSeconds = daysTillExpired * secondsInOneDay;
// res.cookie() - 'maxAge' option required in milliseconds
const maxAgeInMilliseconds = maxAgeInSeconds * 1000;

// Create and set expiration of JWT - contains user id for auth
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAgeInSeconds,
    });
};

// These options remain the same for all auth cookies
const authCookieOptions = {
    httpOnly: true,
    sameSite: "None",
    secure: true,
};

// POST /auth/signup
const signup_post = async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;
    console.log("--- signup_post ---");

    try {
        // NOTE: Signup validation is handled by mongoose validation at schema level
        const user = await User.create({
            firstName,
            lastName,
            email,
            password, // hashed in mongoose pre-save hook
        });

        // Create JWT - user is "logged in" in as long as this exists
        const token = createToken(user._id);
        console.log("TOKEN:", token);

        // Create cookie containing JWT and set expiration date/time
        res.cookie("jwt", token, {
            ...authCookieOptions,
            maxAge: maxAgeInMilliseconds,
        });

        // Response: 201 (Created), object with user details
        res.status(201).send({
            message: "User created",
            user: { id: user._id, firstName, lastName, email },
        });
    } catch (err) {
        // Forward err to handleSignupError middleware
        console.log("SIGNUP ERROR", err.message);
        console.log("ERROR NAME", err.name);
        next(err);
    }
};

// POST /auth/login
const login_post = async (req, res, next) => {
    const { email, password } = req.body;
    console.log("--- login_post ---");

    // Check that user credentials entered are in expected format
    const { isValid, errors } = validateLoginCredentials(email, password);

    // Prevent login and throw error if user credentials are NOT valid
    if (!isValid) {
        let err = new Error("invalid login credentials");

        // Pass user-input validation errors to handleLoginError
        err.validationErrors = errors;
        return next(err);
    }

    // Attempt Login if user credential are valid
    try {
        const user = await User.login(email, password);

        // Login Successful
        // Create JWT - user is "logged in" in as long as this exists
        const token = createToken(user._id);
        console.log("LOGIN SUCCESS:", user);
        console.log("TOKEN:", token);

        // Create cookie containing JWT and set expiration date/time
        res.cookie("jwt", token, {
            ...authCookieOptions,
            maxAge: maxAgeInMilliseconds,
        });

        // Send user to client
        res.status(200).json({
            message: "User logged in",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email,
            },
        });
    } catch (err) {
        // Forward err to handleLoginError middleware
        console.log("LOGIN ERROR", err.message);
        next(err);
    }
};

// GET /auth/logout
const logout_get = (req, res, next) => {
    try {
        console.log("--- logout_get ---");
        console.log("COOKIE TO DELETE", req.cookies.jwt);

        // Destroy JWT Cookie - reset & expire
        res.cookie("jwt", "", {
            ...authCookieOptions,
            maxAge: 1,
        });

        // log headers - ensure set-cookie & CORS headers are set
        console.log("HEADERS", res.getHeaders());

        // send null user back to client
        res.status(301).json({ user: null });
    } catch (err) {
        // log error and forward to error handling middleware
        console.log(err);
        next(err);
    }
};

export default {
    signup_post,
    login_post,
    logout_get,
};
