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
    async findMembersByClubId(clubId: string): Promise <SocioEntity[]>{
        const club: ClubEntity = await this.clubRepository.findOne({where:{id:clubId}, relations:["participants"]})
        if (!club)
            throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND)
        return club.participants;
    }

    //Obtener un socio de un club
    async findMemberByClubIdMemberId(clubId: string, memberId:string): Promise<SocioEntity>{
        const member: SocioEntity = await this.socioRepository.findOne({where:{id:memberId}, relations:["participating"]});
        if (!member)
            throw new BusinessLogicException("The member with the given id was not found", BusinessError.NOT_FOUND);

        const club: ClubEntity= await this.clubRepository.findOne({where:{id:clubId}, relations:["participants"]});
        if (!club)
            throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND);
        const clubMember: SocioEntity= club.participants.find(e=>e.id===member.id);
        if (!clubMember)
            throw new BusinessLogicException("The member with the given id is not associated to the club", BusinessError.PRECONDITION_FAILED);
        return clubMember;
    }

    //Actualizar los socios de un grupo
    async updateMembersFromClub(clubId:string, members: SocioEntity[]): Promise<ClubEntity>{
        const club: ClubEntity = await this.clubRepository.findOne({where:{id:clubId}, relations:["participants"]});
        if (!club)
            throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND) 
        for (let i=0; i<members.length;i++){
            const member: SocioEntity= await this.socioRepository.findOne({where:{id:members[i].id}, relations:["participating"]});
            if(!member)
                throw new BusinessLogicException("The member with the given id was not found", BusinessError.NOT_FOUND)
        }
        
        club.participants=members;
        return await this.clubRepository.save(club);
    }

    //Eliminar un socio de un grupo
    async deleteMemberfromClub(clubId: string, memberId:string){
        const member: SocioEntity = await this.socioRepository.findOne({where:{id:memberId}, relations:["participating"]});
        if (!member)
            throw new BusinessLogicException("The member with the given id was not found", BusinessError.NOT_FOUND)

        const club: ClubEntity = await this.clubRepository.findOne({where:{id:clubId}, relations:["participants"]});
        if (!club)
            throw new BusinessLogicException("The museum with the given id was not found", BusinessError.NOT_FOUND)

        const memberClub: SocioEntity = club.participants.find(e=>e.id ===member.id);
        if (!memberClub)
            throw new BusinessLogicException("The member with the given id is not associated to the club", BusinessError.PRECONDITION_FAILED);
        club.participants=club.participants.filter(e=>e.id!==memberId);
        await this.clubRepository.save(club)
    }

}
