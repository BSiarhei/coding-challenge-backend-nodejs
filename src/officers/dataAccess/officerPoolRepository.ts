import { Injectable } from '@nestjs/common';
import { Connection, QueryRunner } from 'typeorm';
import { InjectConnection } from '@nestjs/typeorm';

import { OfficerPoolDataModel } from './models';

@Injectable()
export class OfficerPoolRepository {
    private readonly connection: Connection;

    constructor(
        @InjectConnection('common') connection: Connection
    ) {
        this.connection = connection;
    }

    public async add(officerId: number, queryRunner?: QueryRunner): Promise<void> {
        await this.connection
            .createQueryBuilder(queryRunner)
            .insert()
            .into(OfficerPoolDataModel)
            .values({ officerId })
            .execute();
    }

    public async delete(officerId: number, queryRunner?: QueryRunner): Promise<void> {
        await this.connection
            .createQueryBuilder(queryRunner)
            .delete()
            .from(OfficerPoolDataModel)
            .where('officerId = :officerId', { officerId })
            .execute();
    }
}
