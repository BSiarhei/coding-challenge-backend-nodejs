import { Injectable } from '@nestjs/common';
import { Connection, QueryRunner } from 'typeorm';
import { InjectConnection } from '@nestjs/typeorm';

import { NofFoundError, PagedParamsModel } from '../../common';

import { EventStatusTypesEnum } from '../eventStatusTypesEnum';
import { EventDataModel, EventsFilterDataModel } from './models';
import { DbErrorMessagesEnum } from './dbErrorMessagesEnum';
import { EventModel, EventsFilterModel, CreateEventModel } from '../application/models';

@Injectable()
export class EventRepository {
    private readonly connection: Connection;

    constructor(
        @InjectConnection('common') connection: Connection
    ) {
        this.connection = connection;
    }

    async add(createEventModel: CreateEventModel, queryRunner: QueryRunner): Promise<EventModel> {
        const eventDataModel = EventDataModel.getDataModel(createEventModel);

        await await this.connection
            .createQueryBuilder(queryRunner)
            .insert()
            .into(EventDataModel)
            .values(eventDataModel)
            .returning('*')
            .execute();

        return eventDataModel.getApplicationModel();
    }

    async updateStatus(eventId: number, status: EventStatusTypesEnum, queryRunner: QueryRunner): Promise<void> {
        await this.connection
            .createQueryBuilder(queryRunner)
            .update(EventDataModel)
            .set({
                status,
                officerId: status === EventStatusTypesEnum.DONE ? null : undefined
            })
            .where('eventId = :eventId', { eventId })
            .execute();
    }

    async findById(eventId: number, queryRunner?: QueryRunner): Promise<EventModel> {
        const eventDataModel = await this.connection
            .getRepository(EventDataModel)
            .createQueryBuilder('event', queryRunner)
            .leftJoinAndSelect('event.officer', 'officer')
            .where('event.eventId = :eventId', { eventId })
            .getOne();

        if (!eventDataModel) {
            throw new NofFoundError(`Event ${eventId} was not found`);
        }

        return eventDataModel.getApplicationModel();
    }

    async find(pagedParamsModel: PagedParamsModel, eventsFilterModel: EventsFilterModel): Promise<{
        count: number,
        events: EventModel[]
    }> {
        const eventsFilterDataModel = EventsFilterDataModel.getDataModel(eventsFilterModel);

        let request =  this.connection
            .getRepository(EventDataModel)
            .createQueryBuilder('event')
            .leftJoinAndSelect('event.officer', 'officer')
            .take(pagedParamsModel.pageSize)
            .skip((pagedParamsModel.pageNumber - 1) * pagedParamsModel.pageSize)
            .orderBy('event.createdAt');

        if (eventsFilterDataModel.status || eventsFilterDataModel.type) {
            request = request
                .where(
                    `${eventsFilterDataModel.status ? 'event.status = :status' : ''}
                    ${eventsFilterDataModel.status && eventsFilterDataModel.type ? ' AND ' : ''}
                    ${eventsFilterDataModel.type ? ' event.type = :type' : ''}`,
                    eventsFilterDataModel
                );
        }

        const [eventDataModels, count]: [EventDataModel[], number] = await request
            .getManyAndCount();

        return {
            count,
            events: eventDataModels.map(eventDataModel => eventDataModel.getApplicationModel())
        };
    }

    async deleteOfficer(officerId: number, queryRunner: QueryRunner): Promise<void> {
        await this.connection
            .createQueryBuilder(queryRunner)
            .update(EventDataModel)
            .set({
                officerId: null,
                status: EventStatusTypesEnum.NEW
            })
            .where("status = 'inProgress' AND officerId = :officerId", { officerId })
            .execute();
    }

    async assignOfficer(): Promise<void> {
        try {
            await this.connection
                .query('CALL "public"."assignOfficerToEvent"();');
        } catch (error) {
            if (error.message !== DbErrorMessagesEnum.NO_FREE_OFFICER && error.message !== DbErrorMessagesEnum.NO_NEW_EVENT) {
                throw error;
            }
        }
    }
}
