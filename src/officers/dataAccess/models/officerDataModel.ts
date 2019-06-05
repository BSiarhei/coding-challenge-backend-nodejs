import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Length } from 'class-validator';

import { EventDataModel } from '../../../events/dataAccess/models';
import { CreateOfficerModel, OfficerModel } from '../../application/models';

@Entity('officer')
export class OfficerDataModel {
    @PrimaryColumn()
    public officerId: number;

    @Column({ type: 'varchar', nullable: false })
    @Length(2, 64)
    public firstName: string;

    @Column({ type: 'varchar', nullable: false })
    @Length(2, 64)
    public lastName: string;

    @Column({ type: 'boolean', default: false })
    public isDeleted: boolean;

    @OneToMany(type => EventDataModel, event => event.officer)
    public events: EventDataModel[];

    @CreateDateColumn({ type: 'timestamptz' })
    public createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    public updatedAt: Date;

    constructor(
        officerId?: number,
        firstName?: string,
        lastName?: string,
        isDeleted?: boolean,
        createdAt?: Date,
        updatedAt?: Date,
    ) {
        this.officerId = officerId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.isDeleted = isDeleted;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public getApplicationModel(): OfficerModel  {
        return new OfficerModel(
            this.officerId,
            this.firstName,
            this.lastName,
            this.createdAt,
            this.updatedAt
        );
    }

    public static getDataModel(createOfficerModel: CreateOfficerModel): OfficerDataModel {
        return new this(undefined, createOfficerModel.firstName, createOfficerModel.lastName);
    }
}
