import { OfficerModel } from '../../../officers/application/models';
import { BikeTypesEnum } from '../../bikeTypesEnum';
import { EventStatusTypesEnum } from '../../eventStatusTypesEnum';

export class EventModel {
    public eventId: number;
    public status: EventStatusTypesEnum;
    public eventDate: Date;
    public description: string | null;
    public licenseNumber: string;
    public color: string | null;
    public type: BikeTypesEnum;
    public ownerFirstName: string;
    public ownerLastName: string;
    public officer?: OfficerModel;
    public createdAt: Date;
    public updatedAt: Date;

    constructor(
        eventId: number,
        status: EventStatusTypesEnum,
        eventDate: Date,
        description: string | null,
        licenseNumber: string,
        color: string | null,
        type: BikeTypesEnum,
        ownerFirstName: string,
        ownerLastName: string,
        officer: OfficerModel,
        createdAt: Date,
        updatedAt: Date,
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
        this.officer = officer;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
