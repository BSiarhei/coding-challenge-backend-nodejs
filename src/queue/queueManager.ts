import { Injectable } from '@nestjs/common';

import { BaseError } from '../common';

import { QueueJob } from './queueJob';

@Injectable()
export class QueueManager {
    queueMap: Map<string, QueueJob>;

    constructor() {
        this.queueMap = new Map<string, QueueJob>();
    }

    createQueue(queueName) {
        const queue = this.queueMap.get(queueName);
        if (!queue) {
            this.queueMap.set(queueName, new QueueJob(queueName));
        }
    }

    addProcess(handler, queueName) {
        const queue = this.queueMap.get(queueName);
        if (!queue) {
            throw new BaseError(`Queue ${queueName} is not exist`);
        }
        queue.addProcess(handler);
    }

    addMessage(message, queueName) {
        const queue = this.queueMap.get(queueName);
        if (!queue) {
            throw new BaseError(`Queue ${queueName} is not exist`);
        }
        queue.addMessage({ data: message });
    }
}
