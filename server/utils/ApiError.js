class ApiError {
    constructor(code, message) {
        this.code = code;
        this.message = message;
    }

    // NOTE:
    // static method - invokable via constructor; without instantiation of class
    // For contrast: instance method - invokable via instance of class
    static badRequest(msg) {
        return new ApiError(400, msg);
    }

    static notFound(msg) {
        return new ApiError(404, msg);
    }

    static internal(msg) {
        return new ApiError(500, msg);
    }
}

export default ApiError;
