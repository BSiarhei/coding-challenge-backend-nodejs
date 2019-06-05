export default class BaseError extends Error {
    statusCode: number;

    constructor(message) {
        super(message);

        this.statusCode = 500;

        (Error as any).captureStackTrace(this, this.constructor);
    }
}
