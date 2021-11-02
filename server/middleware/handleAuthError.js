// Generates appropriate error object for Signup errors - to be sent to client
export function handleSignupError(err, req, res, next) {
    // let errors = {}; //? can i use this? it only includes relevant errors as properties
    let errors = { firstName: "", lastName: "", email: "", password: "" };

    // Duplicate Key / User Error
    if (err.name === "MongoServerError" && err.code === 11000) {
        console.log("Duplicate Key error");
        errors.email = "That email is already in use";
        res.status(400).json(errors);
        return;
    }

    // Input Validation Error
    if (err.name === "ValidationError") {
        /**
         * The "err" caught contains an "errors" object
         * Each property of "errors" is a nested object, corresponding to a:
            - User Schema property 
            - Signup input field value
         * A combination of Object.values() and forEach() is used to iterate over 
         * these nested objects and (if present) set error messages 
         */
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });

        res.status(400).json(err);
        return;
    }

    // Error is not handled here, forward to next error handler
    next(err);
}

// TODO
// Generates appropriate error object for Login errors - to be sent to client
export function handleLoginError(err, req, res, next) {
    if (
        err.message === "incorrect email" ||
        err.message === "incorrect password"
    ) {
        console.log(
            "LOGIN ERROR:",
            "Incorrect email or password, please try again"
        );
        // res.status(400).json(err);
        return;
    }

    // Error is not handled here, forward to next error handler
    next(err);
}
