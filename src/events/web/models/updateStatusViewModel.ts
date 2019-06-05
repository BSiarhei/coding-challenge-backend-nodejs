import { IsNotEmpty, IsEnum } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

import { EventStatusTypesEnum } from '../../eventStatusTypesEnum';

export class UpdateStatusViewModel {
    @IsNotEmpty()
    @IsEnum({
        DONE: EventStatusTypesEnum.DONE
    })
    @ApiModelProperty({ enum: [EventStatusTypesEnum.DONE], type: EventStatusTypesEnum })
    status: EventStatusTypesEnum;
}
