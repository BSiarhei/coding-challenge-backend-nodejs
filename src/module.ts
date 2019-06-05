import { Module } from '@nestjs/common';
import { OfficerModule } from './officers/module';
import { EventModule } from './events/module';
import { DbModule } from './db/module';
import { QueueModule } from './queue/module';

@Module({
    imports: [OfficerModule, EventModule, DbModule, QueueModule],
})
export class ApplicationModule {}
