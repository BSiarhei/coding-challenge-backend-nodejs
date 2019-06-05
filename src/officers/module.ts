import { Module, forwardRef } from '@nestjs/common';
import config from 'config';

import { DbModule } from '../db';
import { QueueModule } from '../queue/module';
import { EventModule } from '../events/module';

import { OfficerPoolRepository, OfficerRepository } from './dataAccess';
import { OfficerService } from './application';
import { OfficerController } from './web';

const eventQueueNameProvider = {
    provide: 'eventQueueName',
    useValue: config.get('EVENT_QUEUE_NAME')
};

@Module({
    imports: [
        DbModule,
        forwardRef(() => EventModule),
        QueueModule
    ],
    exports: [OfficerService],
    controllers: [OfficerController],
    providers: [OfficerService, OfficerPoolRepository, OfficerRepository, eventQueueNameProvider]
})

export class OfficerModule {}
