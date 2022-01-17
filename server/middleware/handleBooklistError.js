export default function handleBooklistError(err, req, res, next) {
    const errors = {};

    // Handle ValidationError thrown by Mongoose
    if (err.name === "ValidationError") {
        console.error(`${err.name} - ${err.message}`);
        // console.log(err);

        /**
         * The "err" caught has an "errors" property
         * err.errors is an object of nested objects
         * With each key of the nested objects corresponding to a:
            - Booklist Schema property
            - e.g. err.errors.userId / err.errors.title
        
         * Object.values(err.errors) creates an array with nested error objects
         * We iterate over these nested objects and set the errors to be sent to the client
         */
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });

        console.log(errors);

        // Failed to create: 409 (Conflict)
        return res.status(409).json({ errors });
    }

    // Error is not handled here, forward to next error handler
    next(err);
}
