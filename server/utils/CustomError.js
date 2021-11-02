class CustomError {
    constructor(code, message) {
        this.code = code;
        this.message = message;
    }

    // NOTE:
    // static method - invokable via constructor; without instantiation of class
    // For contrast: instance method - invokable via instance of class
    static badRequest(msg) {
        return new CustomError(400, msg);
    }

    static notFound(msg) {
        return new CustomError(404, msg);
    }

    static internal(msg) {
        return new CustomError(500, msg);
    }
}

export default CustomError;
