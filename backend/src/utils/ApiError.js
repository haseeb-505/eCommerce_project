class ApiError extends Error {
    constructor(
        statusCode,
        message='something went wrong',
        errors=[],
        stack=''
    ){ // overwrite the constructor
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.success = false;
        this.data = null;
        this.errors = errors;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };