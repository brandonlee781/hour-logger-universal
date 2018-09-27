import { Module } from '@nestjs/common';
import { DontBeAService } from './dontbea.service';
import { DontBeAResolver } from './dontbea.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DontBeA } from './dontbea.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DontBeA])],
  providers: [DontBeAService, DontBeAResolver],
})
export class DontbeaModule {}
