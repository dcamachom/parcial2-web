import { Module } from '@nestjs/common';
import { ClubService } from './club.service';
import { ClubEntity } from './club.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubController } from './club.controller';

@Module({
  providers: [ClubService],
  imports: [TypeOrmModule.forFeature([ClubEntity])],
  controllers: [ClubController]
})
export class ClubModule {}
