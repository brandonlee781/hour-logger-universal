import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Log } from './log.entity';
import { LogResolver } from './log.resolver';
import { LogService } from './log.service';
import { UserModule } from '../user/user.module';
import { ProjectModule } from '../project/project.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([Log]),
    UserModule,
    forwardRef(() => ProjectModule),
  ],
  providers: [LogService, LogResolver],
  exports: [LogService],
})
export class LogModule {}
