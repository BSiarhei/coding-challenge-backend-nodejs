import { EventStatusTypesEnum } from '../../eventStatusTypesEnum';
import { BikeTypesEnum } from '../../bikeTypesEnum';

export class EventsFilterModel {
    public status: EventStatusTypesEnum;
    public type: BikeTypesEnum;

    constructor(
        status?: EventStatusTypesEnum,
        type?: BikeTypesEnum
    ) {
        this.status = status;
        this.type = type;
    }
}
