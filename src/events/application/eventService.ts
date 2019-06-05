import { Connection, QueryRunner } from 'typeorm';
import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';

import { OfficerService } from '../../officers/application';
import { QueueManager } from '../../queue/queueManager';
import { BaseService, BaseError } from '../../common';
import { PagedParamsModel } from '../../common/application/models';

import { EventRepository } from '../dataAccess';
import { EventStatusTypesEnum } from '../eventStatusTypesEnum';
import { CreateEventModel, EventModel, EventsFilterModel } from './models';

@Injectable()
export class EventService extends BaseService {
    private readonly eventRepository: EventRepository;
    private readonly queueManager: QueueManager;
    private readonly officerService: OfficerService;
    private readonly eventQueueName: string;

    constructor(
        eventRepository: EventRepository,
        queueManager: QueueManager,
        // tslint:disable-next-line:space-in-parens
        @Inject(forwardRef(/* istanbul ignore next */() => OfficerService)) officerService: OfficerService,
        @InjectConnection('common') connection: Connection,
        @Inject('eventQueueName') eventQueueName: string
    ) {
        super(connection);
        this.eventRepository = eventRepository;
        this.queueManager = queueManager;
        this.officerService = officerService;
        this.eventQueueName = eventQueueName;

        this.queueManager.createQueue(eventQueueName);
        this.queueManager.addProcess(this.assignOfficer.bind(this), eventQueueName);
    }

    assignOfficer(): Promise<void> {
        return this.eventRepository.assignOfficer();
    }

    async create(createEventModel: CreateEventModel): Promise<EventModel> {
        return await this.performWithTransaction(async (queryRunner: QueryRunner) => {
            const eventModel = await this.eventRepository.add(createEventModel, queryRunner);
            await this.queueManager.addMessage(`New event ${eventModel.eventId}`, this.eventQueueName);

            return eventModel;
        });
    }

    async updateStatus(eventId: number, status: EventStatusTypesEnum): Promise<void> {
        return await this.performWithTransaction(async (queryRunner: QueryRunner) => {
            const { officer, status: currentStatus } = await this.eventRepository.findById(eventId, queryRunner);

            // TODO add extended status checker
            if (currentStatus !== EventStatusTypesEnum.IN_PROGRESS) {
                throw new BaseError('Current status is not suitable');
            }

            await this.eventRepository.updateStatus(eventId, status, queryRunner);

            await this.officerService.addOfficerToPool(officer.officerId, queryRunner);
        });
    }

    find(pagedParamsModel: PagedParamsModel, eventsFilterModel: EventsFilterModel): Promise<{
        events: EventModel[],
        count: number
    }> {
        return this.eventRepository.find(pagedParamsModel, eventsFilterModel);
    }

    findById(eventId: number): Promise<EventModel> {
        return this.eventRepository.findById(eventId);
    }

    async deleteOfficer(officerId: number, queryRunner: QueryRunner): Promise<void> {
        await this.eventRepository.deleteOfficer(officerId, queryRunner);
        await this.queueManager.addMessage(`Officer ${officerId} was deleted`, this.eventQueueName);
    }
}
