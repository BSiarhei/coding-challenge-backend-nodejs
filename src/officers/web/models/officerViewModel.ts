import { ApiModelProperty } from '@nestjs/swagger';

import { OfficerModel } from '../../application/models';

export class OfficerViewModel {
    @ApiModelProperty()
    public officerId: number;

    @ApiModelProperty()
    public firstName: string;

    @ApiModelProperty()
    public lastName: string;

    @ApiModelProperty({ type: 'string', format: 'date-time' })
    public createAt: Date;

    @ApiModelProperty({ type: 'string', format: 'date-time' })
    public updatedAt: Date;

    constructor(
        officerId: number,
        firstName: string,
        lastName: string,
        createAt: Date,
        updatedAt: Date,
    ) {
        this.officerId = officerId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.createAt = createAt;
        this.updatedAt = updatedAt;
    }

    public static getViewModel(officerModel: OfficerModel): OfficerViewModel {
        return new this(
            officerModel.officerId,
            officerModel.firstName,
            officerModel.lastName,
            officerModel.createAt,
            officerModel.updatedAt
        );
    }
}
