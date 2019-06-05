import { BikeTypesEnum } from '../../bikeTypesEnum';
import { EventStatusTypesEnum } from '../../eventStatusTypesEnum';
import { OfficerDataModel } from '../../../officers/dataAccess/models';

export class EventDataModel {
    eventId: number;
    status: EventStatusTypesEnum;
    eventDate: Date;
    description: string;
    licenseNumber: string;
    color: string;
    type: BikeTypesEnum;
    ownerFirstName: string;
    ownerLastName: string;
    officerId: number;
    officer: OfficerDataModel;
    createdAt: Date;
    updatedAt: Date;
}
