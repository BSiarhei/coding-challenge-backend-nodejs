import { Connection, QueryRunner } from 'typeorm';
import { Injectable, forwardRef, Inject  } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';

import { BaseService } from '../../common';
import { EventService } from '../../events/application';
import { QueueManager }  from '../../queue/queueManager';

import { CreateOfficerModel, OfficerModel } from './models';
import { OfficerRepository, OfficerPoolRepository } from '../dataAccess';

@Injectable()
export class OfficerService extends BaseService {
    private readonly officerRepository: OfficerRepository;
    private readonly officerPoolRepository: OfficerPoolRepository;
    private readonly eventService: EventService;
    private readonly queueManager: QueueManager;
    private readonly eventQueueName: string;

    constructor(
        officerRepository: OfficerRepository,
        officerPoolRepository: OfficerPoolRepository,
        // tslint:disable-next-line:space-in-parens
        @Inject(forwardRef(/* istanbul ignore next */() => EventService)) eventService: EventService,
        queueManager: QueueManager,
        @InjectConnection('common') connection: Connection,
        @Inject('eventQueueName') eventQueueName: string
    ) {
        super(connection);
        this.officerRepository = officerRepository;
        this.officerPoolRepository = officerPoolRepository;
        this.eventService = eventService;
        this.queueManager = queueManager;
        this.eventQueueName = eventQueueName;
    }

    public async create(createOfficerModel: CreateOfficerModel): Promise<OfficerModel> {
        return await this.performWithTransaction(async (queryRunner: QueryRunner) => {
            const officerModel = await this.officerRepository.add(createOfficerModel, queryRunner);
            await this.officerPoolRepository.add(officerModel.officerId, queryRunner);
            await this.queueManager.addMessage(`New officer ${officerModel.officerId}`, this.eventQueueName);

            return officerModel;
        });
    }

    public async addOfficerToPool(officerId: number, queryRunner: QueryRunner): Promise<void> {
        await this.officerPoolRepository.add(officerId, queryRunner);
        await this.queueManager.addMessage(`New free officer ${officerId}`, this.eventQueueName);
    }

    public async delete(officerId: number): Promise<void> {
        await this.performWithTransaction(async (queryRunner: QueryRunner) => {
            await this.officerRepository.delete(officerId, queryRunner);

            await Promise.all([
                this.officerPoolRepository.delete(officerId, queryRunner),
                this.eventService.deleteOfficer(officerId, queryRunner)
            ]);
        });
    }
}
