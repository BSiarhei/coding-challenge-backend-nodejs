import {
    Post,
    Delete,
    Controller,
    Body,
    Param,
    HttpCode,
    ParseIntPipe,
    NotFoundException
} from '@nestjs/common';
import { ApiResponse, ApiUseTags } from '@nestjs/swagger';

import { NofFoundError } from '../../common';

import { OfficerService } from '../application';
import { CreateOfficerViewModel, OfficerViewModel } from './models';

@ApiUseTags('officers')
@Controller('/officers')
export class OfficerController {
    private readonly officerService: OfficerService;

    constructor(officerService: OfficerService) {
        this.officerService = officerService;
    }

    @Post()
    @HttpCode(201)
    @ApiResponse({ status: 201, description: 'Create an officer.', type: OfficerViewModel })
    @ApiResponse({ status: 400, description: 'Unprocessable Entity' })
    public async create(
        @Body() createOfficerModel: CreateOfficerViewModel
    ): Promise<OfficerViewModel> {
        const officerModel = await this.officerService.create(createOfficerModel.getApplicationModel());
        return OfficerViewModel.getViewModel(officerModel);
    }

    @Delete(':id')
    @HttpCode(204)
    @ApiResponse({ status: 204, description: 'Delete an officer.' })
    @ApiResponse({ status: 404, description: 'Officer was not found' })
    public async delete(@Param('id', new ParseIntPipe()) officerId: number): Promise<void> {
        try {
            await this.officerService.delete(officerId);
        } catch (error) {
            if (error instanceof NofFoundError) {
                throw new NotFoundException(error.message);
            }

            throw error;
        }
    }
}
