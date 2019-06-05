import { Injectable } from '@nestjs/common';
import { Connection, QueryRunner } from 'typeorm';
import { InjectConnection } from '@nestjs/typeorm';

import { NofFoundError } from '../../common';

import { OfficerDataModel } from './models';
import { CreateOfficerModel, OfficerModel } from '../application';

@Injectable()
export class OfficerRepository {
    private readonly connection: Connection;

    constructor(
        @InjectConnection('common') connection: Connection
    ) {
        this.connection = connection;
    }

    public async add(createOfficerModel: CreateOfficerModel, queryRunner: QueryRunner): Promise<OfficerModel> {
        const officerDataModel = OfficerDataModel.getDataModel(createOfficerModel);

        await this.connection
            .createQueryBuilder(queryRunner)
            .insert()
            .into(OfficerDataModel)
            .values(officerDataModel)
            .returning('*')
            .execute();

        return officerDataModel.getApplicationModel();
    }

    public async delete(officerId: number, queryRunner: QueryRunner): Promise<void> {
        const selectResult = await this.connection
            .createQueryBuilder(queryRunner)
            .select('officer')
            .from(OfficerDataModel, 'officer')
            .where('officer.officerId = :officerId AND officer.isDeleted IS NOT TRUE', { officerId })
            .getOne();

        if (!selectResult) {
            throw new NofFoundError(`Officer ${officerId} was not found`);
        }

        await this.connection
            .createQueryBuilder(queryRunner)
            .update(OfficerDataModel)
            .set({
                isDeleted: true
            })
            .where('officerId = :officerId', { officerId })
            .execute();
    }
}
