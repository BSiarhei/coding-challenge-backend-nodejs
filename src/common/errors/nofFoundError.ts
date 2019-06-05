import BaseError from './baseError';

export default class NofFoundError extends BaseError {
    statusCode: number;

    constructor(message) {
        super(message);

        this.statusCode = 404;
    }
}
