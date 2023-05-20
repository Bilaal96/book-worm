import CustomError from "../utils/CustomError.js";

// As discussed here: https://www.youtube.com/watch?v=DyqVqaf1KnA
export default function handleCustomError(err, req, res, next) {
    // If not CustomError, forward to next error handler
    if (!err instanceof CustomError) return next(err);

    // Development-only log
    // Do not use in prod env (because it is NOT async)
    // In prod env, large errors will block other code from executing
    console.error(err);

    // Send error object
    res.status(err.code).json(err);
}
