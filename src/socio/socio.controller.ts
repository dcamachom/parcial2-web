import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { SocioService } from './socio.service';
import { SocioDto } from './socio.dto';
import { SocioEntity } from './socio.entity';
import { plainToInstance } from 'class-transformer';

@Controller('members')
@UseInterceptors(BusinessErrorsInterceptor)
export class SocioController {

    constructor(private readonly memberService: SocioService) {}

    @Get()
    async findAll() {
        return await this.memberService.findAll();
    }

    @Get(':memberId')
        async findOne(@Param('memberId') memberId: string) {
        return await this.memberService.findOne(memberId);
    }

    @Post()
        async create(@Body() socioDto: SocioDto) {
        const socio: SocioEntity = plainToInstance(SocioEntity, socioDto);
        return await this.memberService.create(socio);
    }

    @Put(':memberId')
        async update(@Param('memberId') memberId: string, @Body() socioDto: SocioDto) {
        const museum: SocioEntity = plainToInstance(SocioEntity, socioDto);
        return await this.memberService.update(memberId, museum);
    }

    @Delete(':memberId')
    @HttpCode(204)
        async delete(@Param('memberId') memberId: string) {
        return await this.memberService.delete(memberId);
    }

}
