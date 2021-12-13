// https://www.loggly.com/blog/http-status-code-diagram/
class CustomError {
    constructor(code, message) {
        this.code = code;
        this.message = message;
    }

    /** NOTE:
     * static method - invokable via constructor; without instantiation of class
     * For contrast: instance method - invokable via instance of class
     */
    static badRequest(msg = "Bad request") {
        return new CustomError(400, msg);
    }

    // Request is unauthorized due to lack of valid authentication credentials
    // Either credentials were incorrect or not provided at all
    static unauthorized(msg = "Unauthorized") {
        return new CustomError(401, msg);
    }

    // Server understands the request but refuses to authorize it
    // Reasons for refusing authorisation of this request can be provided (by choice)
    // Authentication does not affect the outcome of this request
    static forbidden(msg = "Forbidden") {
        return new CustomError(403, msg);
    }

    static notFound(msg = "Not found") {
        return new CustomError(404, msg);
    }

    static internalServer(msg = "Internal Server Error") {
        return new CustomError(500, msg);
    }
}

export default CustomError;
