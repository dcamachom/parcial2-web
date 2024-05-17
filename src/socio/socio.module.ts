import { Module } from '@nestjs/common';
import { SocioService } from './socio.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocioEntity } from './socio.entity';

@Module({
  providers: [SocioService],
  imports: [TypeOrmModule.forFeature([SocioEntity])],
})
export class SocioModule {}
