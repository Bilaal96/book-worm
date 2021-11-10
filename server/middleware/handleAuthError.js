// Generates appropriate error object for Signup errors - to be sent to client
export function handleSignupError(err, req, res, next) {
    const errors = {};

    // Duplicate Key Error (Email already in-use)
    if (err.name === "MongoServerError" && err.code === 11000) {
        console.log("ERROR: Duplicate Key");
        errors.email = "That email is already in use";
        return res.status(400).json({ errors });
    }

    // Handle ValidationError thrown by Mongoose
    if (err.name === "ValidationError") {
        /**
         * The "err" caught has an "errors" property
         * err.errors is an object of nested objects
         * With each key of the nested objects corresponding to a:
            - User Schema property / Signup input field value
            - e.g. err.errors.firstName / err.errors.password
        
         * Object.values(err.errors) creates an array with nested error objects
         * We iterate over these nested objects and set the errors to be sent to the client
         */
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });

        return res.status(400).json({ errors });
    }

    // Error is not handled here, forward to next error handler
    next(err);
}
// Generates appropriate error object for Login errors - to be sent to client
export function handleLoginError(err, req, res, next) {
    const errors = {};

    // CASE: format of login credentials is invalid
    if (err.message === "invalid login credentials") {
        console.log("INVALID LOGIN CREDENTIALS");
        return res.status(400).json({ errors: err.validationErrors });
    }

    // CASE: email / password don't match what's stored in DB
    if (
        err.message === "incorrect email" ||
        err.message === "incorrect password"
    ) {
        // Construct and send errors to client
        errors.email = ""; // key must exist to show error styles in UI
        errors.password = "Incorrect email or password, please try again";
        return res.status(400).json({ errors });
    }

    // Error is not handled here, forward to next error handler
    next(err);
}
