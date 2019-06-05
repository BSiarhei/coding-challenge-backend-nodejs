import { Module } from '@nestjs/common';

import { QueueManager } from './queueManager';

@Module({
    imports: [],
    exports: [QueueManager],
    controllers: [],
    providers: [QueueManager]
})

export class QueueModule {}
