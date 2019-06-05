import { IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

import { CreateOfficerModel } from '../../application/models';

export class CreateOfficerViewModel {
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    @ApiModelProperty({ minLength: 2, maxLength: 64 })
    public firstName: string;

    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    @ApiModelProperty({ minLength: 2, maxLength: 64 })
    public lastName: string;

    public getApplicationModel(): CreateOfficerModel {
        return new CreateOfficerModel(this.firstName, this.lastName);
    }
}
