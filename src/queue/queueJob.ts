import config from 'config';
import Queue from 'bull';

const REDIS_PORT = config.get('CONNECTIONS.REDIS.PORT');
const REDIS_HOST = config.get('CONNECTIONS.REDIS.HOST');

export class QueueJob {
    queueName: Queue;

    constructor(queueName) {
        this.queueName = new Queue(queueName, `redis://${REDIS_HOST}:${REDIS_PORT}`, {
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
