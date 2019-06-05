import { Connection, QueryRunner } from 'typeorm';
import faker from 'faker';

import { CreateOfficerModel, OfficerModel } from './models';
import { OfficerRepository, OfficerPoolRepository } from '../dataAccess';
import { OfficerService } from './officerService';

import { QueueManager }  from '../../queue/queueManager';
jest.mock('../../queue/queueManager');
jest.mock('../../events/application/eventService');
jest.mock('../dataAccess');
import { EventService } from '../../events/application/eventService';

describe('OfficerService', () => {
    let officerService: OfficerService;
    let officerRepository: OfficerRepository;
    let officerPoolRepository: OfficerPoolRepository;
    let queueManager: QueueManager;
    let eventService: jest.Mocked<EventService>;
    const queryRunner = {
        startTransaction() {},
        commitTransaction() {},
        rollbackTransaction() {},
        release() {}
    } as QueryRunner;
    const connection = {
        createQueryRunner() {
            return queryRunner;
        }
    } as Connection;
    const QUEUE_NAME = 'event';

    beforeEach(() => {
        eventService = jest.fn(() => ({
            deleteOfficer: jest.fn()
        }))() as any;
        queueManager = new QueueManager();

        officerPoolRepository = new OfficerPoolRepository(connection);
        officerRepository = new OfficerRepository(connection);
        officerService = new OfficerService(officerRepository, officerPoolRepository, eventService, queueManager, connection, QUEUE_NAME);
    });

    describe('add', () => {
        test('should return a new officer', async () => {
            const firstName = faker.name.firstName();
            const lastName = faker.name.lastName();
            const createOfficerModel = new CreateOfficerModel(firstName, lastName);
            const officerId = faker.random.number({ min: 1 });
            const officerModel = new OfficerModel(officerId, firstName, lastName, new Date(), new Date());

            jest.spyOn(officerRepository, 'add').mockImplementation(() => Promise.resolve(officerModel));
            expect(await officerService.create(createOfficerModel)).toBe(officerModel);
        });

        test('should call officerRepository add method', async () => {
            const firstName = faker.name.firstName();
            const lastName = faker.name.lastName();
            const createOfficerModel = new CreateOfficerModel(firstName, lastName);
            const officerModel = new OfficerModel(1, firstName, lastName, new Date(), new Date());

            jest.spyOn(officerRepository, 'add').mockImplementation((createOfficerModel, queryRunner) => Promise.resolve(officerModel));

            await officerService.create(createOfficerModel);
            expect(officerRepository.add).toBeCalledWith(createOfficerModel, queryRunner);
        });
    });

    describe('addOfficerToPool', () => {
        test('should add to officer pool the officer', async () => {
            jest.spyOn(officerPoolRepository, 'add').mockImplementation((officerId, queryRunner) => Promise.resolve());
            jest.spyOn(queueManager, 'addMessage').mockImplementation((message, queueName) => Promise.resolve());
            const officerId = faker.random.number({ min: 1 });

            expect(await officerService.addOfficerToPool(officerId, queryRunner)).toBeUndefined();
            expect(officerPoolRepository.add).toBeCalledWith(officerId, queryRunner);
            expect(queueManager.addMessage).toBeCalledWith(expect.any(String), QUEUE_NAME);
        });
    });

    describe('delete', () => {
        test('should delete the officer', async () => {
            jest.spyOn(officerRepository, 'delete').mockImplementation((officerId, queryRunner) => Promise.resolve());
            jest.spyOn(officerPoolRepository, 'delete').mockImplementation((officerId, queryRunner) => Promise.resolve());
            jest.spyOn(eventService, 'deleteOfficer').mockImplementation((officerId, queryRunner) => Promise.resolve());
            const officerId = faker.random.number({ min: 1 });

            expect(await officerService.delete(officerId)).toBeUndefined();

            expect(officerRepository.delete).toBeCalledWith(officerId, queryRunner);
            expect(officerPoolRepository.delete).toBeCalledWith(officerId, queryRunner);
            expect(eventService.deleteOfficer).toBeCalledWith(officerId, queryRunner);
        });
    });
});
