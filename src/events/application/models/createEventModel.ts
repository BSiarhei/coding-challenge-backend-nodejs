import { BikeTypesEnum } from '../../bikeTypesEnum';

export class CreateEventModel {
    eventDate: Date;
    description: string;
    licenseNumber: string;
    color: string;
    type: BikeTypesEnum;
    ownerFirstName: string;
    ownerLastName: string;

    constructor(
        eventDate: Date,
        description: string,
        licenseNumber: string,
        color: string,
        type: BikeTypesEnum,
        ownerFirstName: string,
        ownerLastName: string
    ) {
        this.eventDate = eventDate;
        this.description = description;
        this.licenseNumber = licenseNumber;
        this.color = color;
        this.type = type;
        this.ownerFirstName = ownerFirstName;
        this.ownerLastName = ownerLastName;
    }
}
