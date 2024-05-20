import { Module } from '@nestjs/common';
import { SocioClubController } from './socio-club.controller';

@Module({
  controllers: [SocioClubController]
})
export class SocioClubModule {}
