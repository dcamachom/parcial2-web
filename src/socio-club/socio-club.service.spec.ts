import { Test, TestingModule } from '@nestjs/testing';
import { SocioClubService } from './socio-club.service';
import { SocioEntity } from '../socio/socio.entity';
import { Repository } from 'typeorm';
import { ClubEntity } from '../club/club.entity';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('SocioClubService', () => {
  let service: SocioClubService;
  let memberRepository: Repository<SocioEntity>;
  let clubRepository: Repository<ClubEntity>;
  let memberList: SocioEntity[];
  let clubList : ClubEntity[];


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ...TypeOrmTestingConfig(),
        TypeOrmModule.forFeature([SocioEntity, ClubEntity]), 
      ],
      providers: [SocioClubService],
    }).compile();

    service = module.get<SocioClubService>(SocioClubService);
    memberRepository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));
    clubRepository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    memberRepository.clear();
    clubRepository.clear();

    memberList = [];
    clubList= []
    for(let i = 0; i < 5; i++){
        const member: SocioEntity = await memberRepository.save({
          usuario: `User ${i}`,
          correo: faker.internet.email(),
          fechaNacimiento: faker.date.past()
        })
        memberList.push(member);
    }

    for(let i = 0; i < 5; i++){
      const club: ClubEntity = await clubRepository.save({
          nombre: `Club ${i}`,
          imagen:faker.image.url(),
          descripcion: faker.lorem.sentence(),
          fechaFundacion: faker.date.past().toISOString()
      })
      clubList.push(club);
  }
    
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addMemberToClub should add a member to a club', async ()=>{
    const newMember: SocioEntity = await memberRepository.save({
        usuario: faker.internet.userName(),
        correo: faker.internet.email(),
        fechaNacimiento: faker.date.past()
    })

    const newClub: ClubEntity= await clubRepository.save({
        nombre: faker.company.name(),
        imagen:faker.image.url(),
        descripcion: faker.lorem.sentence(),
        fechaFundacion: faker.date.past().toISOString()
    })

    const result: ClubEntity= await service.addMemberToClub(newMember.id, newClub.id);
    expect(result.participants.length).toBe(1);
    expect(result.participants[0]).not.toBeNull();
    expect(result.participants[0].correo).toBe(newMember.correo)
    expect(result.participants[0].fechaNacimiento).toStrictEqual(newMember.fechaNacimiento)
    expect(result.participants[0].usuario).toBe(newMember.usuario)
  });

  it('addMemberToClub should thrown exception for an invalid member', async () => {
    const newClub: ClubEntity = await clubRepository.save({
      nombre: faker.company.name(),
      imagen:faker.image.url(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.past().toISOString()
    })
    await expect(() => service.addMemberToClub("0",newClub.id)).rejects.toHaveProperty("message","The member with the given id was not found")
  });

  it('addMemberToClub should throw an exception for an invalid club', async () => {
    const newMember: SocioEntity = await memberRepository.save({
      usuario: faker.internet.userName(),
      correo: faker.internet.email(),
      fechaNacimiento: faker.date.past()
    });
    await expect (() => service.addMemberToClub(newMember.id, "0")).rejects.toHaveProperty("message", "The club with the given id was not found");
  });

  it('findMemberByClubIdMemberId should return member by club', async () => {
    const member: SocioEntity = memberList[0];
    const club: ClubEntity =clubList[0]
    club.participants = [member];
    await clubRepository.save(club);
    const storedMember: SocioEntity = await service.findMemberByClubIdMemberId(club.id,member.id);  
    expect(storedMember).not.toBeNull();
    expect(storedMember.correo).toBe(member.correo);
    expect(storedMember.fechaNacimiento).toStrictEqual(member.fechaNacimiento);
    expect(storedMember.usuario).toStrictEqual(member.usuario);
  });

  it('findMemberByClubIdMemberId should throw an exception for an invalid member', async () => {
    await expect(()=> service.findMemberByClubIdMemberId(clubList[0].id,"")).rejects.toHaveProperty("message", "The member with the given id was not found");
  });

  it('findMemberByClubIdMemberId should throw an exception for an invalid club', async () => {
    await expect(()=> service.findMemberByClubIdMemberId("0", memberList[0].id)).rejects.toHaveProperty("message", "The club with the given id was not found");
  });

  it('findArtworkByMuseumIdArtworkId should throw an exception for an artwork not associated to the museum', async () => {
    const member: SocioEntity = memberList[0];
    const club: ClubEntity =clubList[0]
 
    await expect(()=> service.findMemberByClubIdMemberId(club.id,member.id)).rejects.toHaveProperty("message", "The member with the given id is not associated to the club");
  });

  it('findMembersByClubId should return members by club', async () => {
    const club: ClubEntity = clubList[0];
    club.participants = memberList;
    await clubRepository.save(club);

    const members: SocioEntity[] = await service.findMembersByClubId(club.id);

    expect(members.length).toBe(5);
  });

  it('findMembersByClubId should throw an exception for an invalid club', async () => {
    await expect(()=> service.findMembersByClubId("0")).rejects.toHaveProperty("message", "The club with the given id was not found");
  });

  it('updateMembersFromClub should update members list for a club', async () => {
    const club: ClubEntity = clubList[0];
    const newMember: SocioEntity = await memberRepository.save({
      usuario: faker.internet.userName(),
      correo: faker.internet.email(),
      fechaNacimiento: faker.date.past()
    });
 
    const updatedClub: ClubEntity = await service.updateMembersFromClub(club.id, [newMember]);
    expect(updatedClub.participants.length).toBe(1);
 
    expect(updatedClub.participants[0].correo).toBe(newMember.correo);
    expect(updatedClub.participants[0].usuario).toBe(newMember.usuario);
    expect(updatedClub.participants[0].fechaNacimiento).toStrictEqual(newMember.fechaNacimiento);
  });

  it('updateMembersFromClub should throw an exception for an invalid club', async () => {
    const newMember: SocioEntity = await memberRepository.save({
      usuario: faker.internet.userName(),
      correo: faker.internet.email(),
      fechaNacimiento: faker.date.past()
    });
 
    await expect(()=> service.updateMembersFromClub("0", [newMember])).rejects.toHaveProperty("message", "The club with the given id was not found");
  });

  it('updateMembersFromClub should throw an exception for an invalid artwork', async () => {
    const club: ClubEntity = clubList[0];
    const newMember: SocioEntity = memberList[0];
    newMember.id = "0";
 
    await expect(()=> service.updateMembersFromClub(club.id, [newMember])).rejects.toHaveProperty("message", "The member with the given id was not found");
  });

  it('deleteMemberfromClub should remove a member from a club', async () => {
    const member: SocioEntity = memberList[0];
    const club: ClubEntity = clubList[0];
    await service.addMemberToClub(member.id, club.id);
   
    await service.deleteMemberfromClub(club.id,member.id);
 
    const storedClub: ClubEntity = await clubRepository.findOne({where: {id: club.id}, relations: ["participants"]});
    const deletedMember: SocioEntity = storedClub.participants.find(a => a.id === member.id);
 
    expect(deletedMember).toBeUndefined();
 
  });

  it('deleteMemberfromClub should thrown an exception for an invalid member', async () => {
    await expect(()=> service.deleteMemberfromClub(clubList[0].id,"0")).rejects.toHaveProperty("message", "The member with the given id was not found");
  });

  it('deleteMemberfromClub should thrown an exception for an non asocciated member', async () => {
    const newMember: SocioEntity = await memberRepository.save({
      usuario: faker.internet.userName(),
      correo: faker.internet.email(),
      fechaNacimiento: faker.date.past()
    });
    await expect(()=> service.deleteMemberfromClub(clubList[0].id,newMember.id)).rejects.toHaveProperty("message", "The member with the given id is not associated to the club");
  });

});
