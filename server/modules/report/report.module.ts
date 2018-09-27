import { Module } from '@nestjs/common';
import { LogModule, Log } from '../log';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { UserModule } from '../user';
import { ProjectModule } from '../project';
import { ReportService } from './report.service';
import { ReportResolver } from './report.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Report, Log]),
  ],
  providers: [
    ReportService,
    ReportResolver,
  ],
})
export class ReportModule {}