import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { SocioService } from './socio.service';
import { SocioEntity } from './socio.entity';
import { faker } from '@faker-js/faker';

describe('SocioService', () => {
  let service: SocioService;
  let repository: Repository<SocioEntity>;
  let socioList: SocioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SocioService],
    }).compile();
 
    service = module.get<SocioService>(SocioService);
    repository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    socioList = [];
    await repository.clear();
    for(let i = 0; i < 5; i++){
      const socio: SocioEntity = await repository.save({
        usuario: `User ${i}`,
        correo: faker.internet.email(),
        fechaNacimiento: faker.date.past()
      });
      socioList.push(socio);
    }
  }
   
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all members', async () => {
    const museums: SocioEntity[] = await service.findAll();
    expect(museums).not.toBeNull();
    expect(museums).toHaveLength(socioList.length);
  });

  it('findOne should return a member by id', async () => {
    const storedMember: SocioEntity = socioList[0];
    const member: SocioEntity = await service.findOne(storedMember.id);
    expect(member).not.toBeNull();
    expect(member.correo).toEqual(storedMember.correo)
    expect(member.fechaNacimiento).toEqual(storedMember.fechaNacimiento)
    expect(member.usuario).toEqual(storedMember.usuario)
  });

  it('findOne should throw an exception for an invalid member', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The member with the given id was not found")
  });

  it('create should return a new member', async () => {
    const member: SocioEntity = {
      id: "",
      usuario: faker.internet.userName(),
      correo: faker.internet.email(),
      fechaNacimiento: faker.date.past(),
      participating:[]
    }
 
    const newMember: SocioEntity = await service.create(member);
    expect(newMember).not.toBeNull();
 
    const storedMember: SocioEntity = await repository.findOne({where: {id: newMember.id}})
    expect(storedMember).not.toBeNull();
    expect(storedMember.correo).toEqual(newMember.correo)
    expect(storedMember.fechaNacimiento).toEqual(newMember.fechaNacimiento)
    expect(storedMember.usuario).toEqual(newMember.usuario)
  });

  it('update should modify a member', async () => {
    const socio: SocioEntity = socioList[0];
    socio.usuario = "New user";
     const updatedMember: SocioEntity = await service.update(socio.id, socio);
    expect(updatedMember).not.toBeNull();
     const storedMember: SocioEntity = await repository.findOne({ where: { id: socio.id } })
    expect(storedMember).not.toBeNull();
    expect(storedMember.usuario).toEqual(socio.usuario)
  });

  it('update should throw an exception for an invalid member', async () => {
    let museum: SocioEntity = socioList[0];
    museum = {
      ...museum, usuario: "New name"
    }
    await expect(() => service.update("0", museum)).rejects.toHaveProperty("message", "The member with the given id was not found")
  });

  it('delete should remove a member', async () => {
    const member: SocioEntity = socioList[0];
    await service.delete(member.id);
     const deletedMember: SocioEntity = await repository.findOne({ where: { id: member.id } })
    expect(deletedMember).toBeNull();
  });

  it('delete should throw an exception for an invalid member', async () => {
    const museum: SocioEntity = socioList[0];
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The member with the given id was not found")
  });

});
