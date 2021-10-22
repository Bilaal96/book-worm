import ApiError from "../utils/ApiError.js";

// As discussed here: https://www.youtube.com/watch?v=DyqVqaf1KnA
export default function apiErrorHandler(err, req, res, next) {
    // only use console log in dev env, do not use in prod env (because it is NOT async)
    // in prod env, if logged error is large it will block other code from executing
    console.error(err);

    // Log custom error if created via ApiError
    if (err instanceof ApiError) {
        res.status(err.code).json(err);
        return;
    }

    // Catch-all error statement
    // Will execute for Network Errors
    // i.e. when there is no communication between server and Books API
    res.status(500).send("Internal Server Error: Something went wrong");
}
