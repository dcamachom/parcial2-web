import { Module } from '@nestjs/common';
import { ClubService } from './club.service';
import { ClubEntity } from './club.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [ClubService],
  imports: [TypeOrmModule.forFeature([ClubEntity])]
})
export class ClubModule {}
