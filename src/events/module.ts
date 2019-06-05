import { Module, forwardRef } from '@nestjs/common';
import config from 'config';

import { DbModule } from '../db';
import { QueueModule } from '../queue/module';
import { OfficerModule } from '../officers/module';

import { EventRepository } from './dataAccess';
import { EventService } from './application';
import { EventController } from './web';

const eventQueueNameProvider = {
    provide: 'eventQueueName',
    useValue: config.get('EVENT_QUEUE_NAME')
};

@Module({
    imports: [
        DbModule,
        QueueModule,
        forwardRef(() => OfficerModule)
    ],
    exports: [EventService],
    controllers: [EventController],
    providers: [EventService, EventRepository, eventQueueNameProvider]
})

export class EventModule {}
