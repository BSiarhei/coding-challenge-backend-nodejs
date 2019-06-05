import config from 'config';
import Queue from 'bull';

const REDIS_PORT = config.get('CONNECTIONS.REDIS.PORT');
const REDIS_HOST = config.get('CONNECTIONS.REDIS.HOST');
const REDIS_URL = config.get('CONNECTIONS.REDIS.URL');

const url = REDIS_URL || `redis://${REDIS_HOST}:${REDIS_PORT}`;

export class QueueJob {
    queueName: Queue;

    constructor(queueName) {
        this.queueName = new Queue(queueName, url, {
            removeOnComplete: true,
            removeOnFail: false,
            repeat: {
                limit: 2000,
                every: 10000
            }
        });
    }

    addProcess(handler) {
        return this.queueName.process(async (task) => {
            return handler(task.data);
        });
    }

    addMessage(messageData) {
        return this.queueName.add(messageData);
    }
}
