import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { ClubEntity } from './club.entity';

@Injectable()
export class ClubService {

    constructor(
        @InjectRepository(ClubEntity)
        private readonly clubRepository: Repository<ClubEntity>
    ){}

    async findAll(): Promise<ClubEntity[]> {
        return await this.clubRepository.find({ relations: ["participants"] });
    }

    async findOne(id: string): Promise<ClubEntity> {
        const club: ClubEntity = await this.clubRepository.findOne({where: {id}, relations: ["participants"] } );
        if (!club)
          throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND);
   
        return club;
    }

    async create(club: ClubEntity): Promise<ClubEntity> {
        this.checkEntryValues(club);
        return await this.clubRepository.save(club);
    }

    async update(id: string, club: ClubEntity): Promise<ClubEntity> {
        const persistedClub: ClubEntity = await this.clubRepository.findOne({where:{id}});
        if (!persistedClub)
          throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND);
        
        this.checkEntryValues(club)
        return await this.clubRepository.save({...persistedClub, ...club});
    }

    async delete(id: string) {
        const club: ClubEntity = await this.clubRepository.findOne({where:{id}});
        if (!club)
          throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND);
     
        await this.clubRepository.remove(club);
    }

    checkEntryValues(club:ClubEntity){
        
        if (!club.descripcion|| club.descripcion==="" || club.descripcion.length>100){
            throw new BusinessLogicException("description is null or invalid or too long", BusinessError.BAD_REQUEST);
        }
        if (!club.fechaFundacion){
            throw new BusinessLogicException("date is null or invalid", BusinessError.BAD_REQUEST);
        }
        if(!club.nombre||club.nombre===""){
            throw new BusinessLogicException("name is null or invalid", BusinessError.BAD_REQUEST);
        }
        if(!club.imagen||club.imagen===""){
            throw new BusinessLogicException("image is null or invalid", BusinessError.BAD_REQUEST);
        }

    }

}
