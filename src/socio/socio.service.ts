import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { SocioEntity } from './socio.entity';

@Injectable()
export class SocioService {

    constructor(
        @InjectRepository(SocioEntity)
        private readonly socioRepository: Repository<SocioEntity>
    ){}

    async findAll(): Promise<SocioEntity[]> {
        return await this.socioRepository.find({ relations: ["participating"] });
    }

    async findOne(id: string): Promise<SocioEntity> {
        const socio: SocioEntity = await this.socioRepository.findOne({where: {id}, relations: ["participating"] } );
        if (!socio)
          throw new BusinessLogicException("The member with the given id was not found", BusinessError.NOT_FOUND);
   
        return socio;
    }

    async create(socio: SocioEntity): Promise<SocioEntity> {
        this.checkEntryValues(socio);
        return await this.socioRepository.save(socio);
    }


    async update(id: string, socio: SocioEntity): Promise<SocioEntity> {
        const persistedSocio: SocioEntity = await this.socioRepository.findOne({where:{id}});
        if (!persistedSocio)
          throw new BusinessLogicException("The member with the given id was not found", BusinessError.NOT_FOUND);
        
        this.checkEntryValues(socio)
        return await this.socioRepository.save({...persistedSocio, ...socio});
    }

    async delete(id: string) {
        const socio: SocioEntity = await this.socioRepository.findOne({where:{id}});
        if (!socio)
          throw new BusinessLogicException("The member with the given id was not found", BusinessError.NOT_FOUND);
     
        await this.socioRepository.remove(socio);
    }

    checkEntryValues(socio:SocioEntity){
        
        if (!socio.correo || socio.correo==="" || socio.correo.includes('@')){
            throw new BusinessLogicException("mail is null or invalid", BusinessError.BAD_REQUEST);
        }
        if (!socio.fechaNacimiento){
            throw new BusinessLogicException("date is null or invalid", BusinessError.BAD_REQUEST);
        }
        if(!socio.usuario|| socio.usuario===""){
            throw new BusinessLogicException("user is null or invalid", BusinessError.BAD_REQUEST);
        }

    }

}
