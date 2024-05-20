import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { ClubService } from 'src/club/club.service';
import { SocioClubService } from './socio-club.service';
import { plainToInstance } from 'class-transformer';
import { SocioDto } from '../socio/socio.dto';
import { SocioEntity } from 'src/socio/socio.entity';

@Controller('clubs')
@UseInterceptors(BusinessErrorsInterceptor)
export class SocioClubController {

    constructor(private readonly clubMemberService: SocioClubService) {}

    @Post(':clubId/members/:memberId')
        async addMemberToClub(@Param('clubId') clubId: string, @Param('memberId') memberId: string){
        return await this.clubMemberService.addMemberToClub(clubId, memberId);
    }

    @Get(':clubId/members/:memberId')
        async findMemberByClubIdMemberId(@Param('clubId') clubId: string, @Param('memberId') memberId: string){
       return await this.clubMemberService.findMemberByClubIdMemberId(clubId, memberId);
    }

    @Get(':clubId/members')
        async findMembersByClubId(@Param('clubId') clubId: string){
        return await this.clubMemberService.findMembersByClubId(clubId);
    }

    @Put(':clubId/members')
        async updateMembersFromClub(@Body() membersDto: SocioDto[], @Param('clubId') clubId: string){
        const members = plainToInstance(SocioEntity, membersDto)
        return await this.clubMemberService.updateMembersFromClub(clubId, members);
    }

    @Delete(':clubId/members/:memberId')
    @HttpCode(204)
        async deleteMemberfromClub(@Param('clubId') clubId: string, @Param('memberId') memberId: string){
       return await this.clubMemberService.deleteMemberfromClub(clubId, memberId);
    }

}
