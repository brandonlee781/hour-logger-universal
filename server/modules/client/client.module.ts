import { Module, forwardRef } from '@nestjs/common';
import { ClientService } from './client.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './client.entity';
import { UserModule } from '../user/user.module';
import { ClientResolver } from './client.resolver';
import { ProjectModule } from '../project';

@Module({
  imports: [TypeOrmModule.forFeature([Client]), UserModule, forwardRef(() => ProjectModule)],
  providers: [ClientService, ClientResolver],
  exports: [ClientService],
})
export class ClientModule {}
