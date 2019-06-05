import { Connection, QueryRunner } from 'typeorm';
import faker from 'faker';

import { CreateEventModel, EventModel, EventsFilterModel } from './models';
import { EventService } from './eventService';
import { EventRepository } from '../dataAccess/eventRepository';
import { BikeTypesEnum } from '../bikeTypesEnum';
import { EventStatusTypesEnum } from '../eventStatusTypesEnum';

import { BaseError, PagedParamsModel } from '../../common';
import { OfficerModel } from '../../officers/application/models';

import { QueueManager } from '../../queue/queueManager';
import { OfficerService } from '../../officers/application/officerService';

jest.mock('../../queue/queueManager');
jest.mock('../../officers/application/officerService');
jest.mock('../dataAccess/eventRepository');

const makeEventModel = (options: any = {}): EventModel => {
    const colors = ['blue', 'red', 'black', 'green'];
    const eventId = options.eventId || faker.random.number({ min: 1 });
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const description = faker.random.words(6);
    const licenseNumber = faker.random.word();
    const color = faker.random.arrayElement(colors);
    const type = faker.random.arrayElement(Object.values(BikeTypesEnum));
    const status = options.status || EventStatusTypesEnum.NEW;
    const officer = options.officer || null;

    return new EventModel(
        eventId,
        status,
        new Date(),
        description,
        licenseNumber,
        color,
        type,
        firstName,
        lastName,
        officer,
        new Date(),
        new Date()
    );
};

const makeCreateEventModel = (options: any = {}): CreateEventModel => {
    const colors = ['blue', 'red', 'black', 'green'];
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const description = faker.random.words(6);
    const licenseNumber = faker.random.word();
    const color = faker.random.arrayElement(colors);
    const type = faker.random.arrayElement(Object.values(BikeTypesEnum));

    return new CreateEventModel(
        new Date(),
        description,
        licenseNumber,
        color,
        type,
        firstName,
        lastName
    );
};

describe('EventService', () => {
    let eventService: EventService;
    let eventRepository: EventRepository;
    let queueManager: QueueManager;
    let officerService: jest.Mocked<OfficerService>;
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
        officerService = jest.fn(() => ({
            addOfficerToPool: jest.fn()
        }))() as any;
        queueManager = new QueueManager();

        eventRepository = new EventRepository(connection);
        eventService = new EventService(eventRepository, queueManager, officerService, connection, QUEUE_NAME);
    });

    describe('assignOfficer', () => {
        test('should assign an officer to an event', async () => {
            jest.spyOn(eventRepository, 'assignOfficer').mockImplementation(() => Promise.resolve());

            expect(await eventService.assignOfficer()).toBeUndefined();
            expect(eventRepository.assignOfficer).toHaveBeenCalled();
        });
    });

    describe('add', () => {
        test('should return a new event', async () => {
            const createEventModel = makeCreateEventModel();
            const eventModel = makeEventModel();

            jest.spyOn(eventRepository, 'add').mockImplementation((createEventModel, queryRunner) => Promise.resolve(eventModel));
            jest.spyOn(queueManager, 'addMessage').mockImplementation((message, queryName) => Promise.resolve());

            expect(await eventService.create(createEventModel)).toBe(eventModel);
            expect(eventRepository.add).toBeCalledWith(createEventModel, queryRunner);
            expect(queueManager.addMessage).toBeCalledWith(expect.any(String), QUEUE_NAME);
        });
    });

    describe('updateStatus', () => {
        test('should throw error if current status is not in progress', async () => {
            const eventId = faker.random.number({ min: 1 });

            const eventModel = makeEventModel({
                eventId,
                status: EventStatusTypesEnum.NEW
            });

            jest.spyOn(eventRepository, 'findById').mockImplementation((eventId, queryRunner) => Promise.resolve(eventModel));

            await expect(eventService.updateStatus(eventId, EventStatusTypesEnum.DONE)).rejects.toBeInstanceOf(BaseError);
        });

        test('should update status of the event', async () => {
            const officerId = faker.random.number({ min: 1 });
            const eventId = faker.random.number({ min: 1 });

            const officerModel = new OfficerModel(
                officerId,
                faker.name.firstName(),
                faker.name.lastName(),
                new Date(),
                new Date()
            );

            const eventModel = makeEventModel({
                eventId,
                officer: officerModel,
                status: EventStatusTypesEnum.IN_PROGRESS
            });

            jest.spyOn(eventRepository, 'findById').mockImplementation((eventId, queryRunner) => Promise.resolve(eventModel));
            jest.spyOn(eventRepository, 'updateStatus')
                .mockImplementation((eventId, status, queryRunner) => Promise.resolve());
            jest.spyOn(officerService, 'addOfficerToPool')
                .mockImplementation((officerId, queryRunner) => Promise.resolve());

            expect(await eventService.updateStatus(eventId, EventStatusTypesEnum.DONE)).toBeUndefined();
            expect(eventRepository.findById).toBeCalledWith(eventId, queryRunner);
            expect(eventRepository.updateStatus).toBeCalledWith(eventId, EventStatusTypesEnum.DONE, queryRunner);
            expect(officerService.addOfficerToPool).toBeCalledWith(officerId, queryRunner);
        });
    });

    describe('find', () => {
        test('should find events', async () => {
            const repositoryResponse = {
                count: 2,
                events: [makeEventModel(), makeEventModel()]
            };

            const pagedParamsModel = new PagedParamsModel(1, 10);
            const eventsFilterModel = new EventsFilterModel();

            jest.spyOn(eventRepository, 'find')
                .mockImplementation((pagedParamsModel, eventsFilterModel) => Promise.resolve(repositoryResponse));

            expect(await eventService.find(pagedParamsModel, eventsFilterModel)).toBe(repositoryResponse);
            expect(eventRepository.find).toBeCalledWith(pagedParamsModel, eventsFilterModel);
        });
    });

    describe('findById', () => {
        test('should find an event by Id', async () => {
            const eventId = faker.random.number({ min: 1 });
            const eventModel = makeEventModel({ eventId });

            jest.spyOn(eventRepository, 'findById').mockImplementation(eventId => Promise.resolve(eventModel));

            expect(await eventService.findById(eventId)).toBe(eventModel);
            expect(eventRepository.findById).toBeCalledWith(eventId);
        });
    });

    describe('deleteOfficer', () => {
        test('should delete the officer', async () => {
            const eventId = faker.random.number({ min: 1 });

            jest.spyOn(eventRepository, 'deleteOfficer').mockImplementation((eventId, queryRunner) => Promise.resolve());
            jest.spyOn(queueManager, 'addMessage').mockImplementation((message, queryName) => Promise.resolve());

            expect(await eventService.deleteOfficer(eventId, queryRunner)).toBeUndefined();
            expect(eventRepository.deleteOfficer).toBeCalledWith(eventId, queryRunner);
            expect(queueManager.addMessage).toBeCalledWith(expect.any(String), QUEUE_NAME);
        });
    });
});
