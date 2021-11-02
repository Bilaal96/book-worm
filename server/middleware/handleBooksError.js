import CustomError from "../utils/CustomError.js";

// As discussed here: https://www.youtube.com/watch?v=DyqVqaf1KnA
export default function handleBooksError(err, req, res, next) {
    // only use console log in dev env, do not use in prod env (because it is NOT async)
    // in prod env, if logged error is large it will block other code from executing
    console.error(err);

    // Log custom error if created via ApiError
    if (err instanceof CustomError) {
        res.status(err.code).json(err);
        return;
    }

    next(err);
}
