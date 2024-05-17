import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClubEntity } from '../club/club.entity';
import { SocioEntity } from '../socio/socio.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class SocioClubService {

    constructor(
        @InjectRepository(SocioEntity)
        private readonly socioRepository: Repository<SocioEntity>,
    
        @InjectRepository(ClubEntity)
        private readonly clubRepository: Repository<ClubEntity>
    ) {}

    //Asociar un socio a un grupo
    async addMemberToClub(memberId: string, clubId:string): Promise<ClubEntity>{
        const member: SocioEntity = await this.socioRepository.findOne({where:{id:memberId}, relations:["participating"]});
        if (!member)
            throw new BusinessLogicException("The member with the given id was not found", BusinessError.NOT_FOUND);

        const club: ClubEntity= await this.clubRepository.findOne({where:{id:clubId}, relations:["participants"]});
        if (!club)
            throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND);
        club.participants=[...club.participants,member];
        return await this.clubRepository.save(club)
    }

    //Obtener los socios de un grupo

}
