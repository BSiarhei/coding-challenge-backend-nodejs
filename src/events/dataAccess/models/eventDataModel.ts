import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Length } from 'class-validator';

import { BikeTypesEnum } from '../../bikeTypesEnum';
import { EventStatusTypesEnum } from '../../eventStatusTypesEnum';
import { OfficerDataModel } from '../../../officers/dataAccess/models';
import { EventModel, CreateEventModel } from '../../application/models';

@Entity('event')
export class EventDataModel {
    @PrimaryColumn()
    public eventId: number;

    @Column({ type: 'enum', enum: EventStatusTypesEnum, nullable: false , default: EventStatusTypesEnum.NEW })
    public status: EventStatusTypesEnum;

    @Column({ type: 'timestamptz', nullable: false })
    public eventDate: Date;

    @Column({ type: 'varchar', nullable: true })
    @Length(0, 512)
    public description: string;

    @Column({ type: 'varchar', nullable: false })
    @Length(5, 12)
    public licenseNumber: string;

    @Column({ type: 'varchar', nullable: true })
    @Length(5, 12)
    public color: string;

    @Column({ type: 'enum', enum: BikeTypesEnum, nullable: false })
    public type: BikeTypesEnum;

    @Column({ type: 'varchar', nullable: false })
    @Length(2, 64)
    public ownerFirstName: string;

    @Column({ type: 'varchar', nullable: false })
    @Length(2, 64)
    public ownerLastName: string;

    @Column({ type: 'integer', nullable: true, select: false })
    public officerId: number;

    @ManyToOne(type => OfficerDataModel, officer => officer.events)
    @JoinColumn({ name: 'officerId' })
    public officer: OfficerDataModel;

    @CreateDateColumn({ type: 'timestamptz' })
    public createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    public updatedAt: Date;

    constructor(
        eventId?: number,
        status?: EventStatusTypesEnum,
        eventDate?: Date,
        description?: string,
        licenseNumber?: string,
        color?: string,
        type?: BikeTypesEnum,
        ownerFirstName?: string,
        ownerLastName?: string,
        officerId?: number,
        createdAt?: Date,
        updatedAt?: Date,
    ) {
        this.eventId = eventId;
        this.status = status;
        this.eventDate = eventDate;
        this.description = description;
        this.licenseNumber = licenseNumber;
        this.color = color;
        this.type = type;
        this.ownerFirstName = ownerFirstName;
        this.ownerLastName = ownerLastName;
        this.officerId = officerId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public getApplicationModel(): EventModel  {
        const officer = this.officer && this.officer.getApplicationModel() || null;

        return new EventModel(
            this.eventId,
            this.status,
            this.eventDate,
            this.description,
            this.licenseNumber,
            this.color,
            this.type,
            this.ownerFirstName,
            this.ownerLastName,
            officer,
            this.createdAt,
            this.updatedAt,
        );
    }

    public static getDataModel(createEventModel: CreateEventModel): EventDataModel {
        return new this(
            undefined,
            undefined,
            createEventModel.eventDate,
            createEventModel.description,
            createEventModel.licenseNumber,
            createEventModel.color,
            createEventModel.type,
            createEventModel.ownerFirstName,
            createEventModel.ownerLastName
        );
    }
}
