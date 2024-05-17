import { ClubEntity } from 'src/club/club.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SocioEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    usuario: string;

    @Column()
    correo:string;

    @Column()
    fechaNacimiento: Date;

    @ManyToMany(() => ClubEntity, club => club.participants)
    participating: ClubEntity[];
}
