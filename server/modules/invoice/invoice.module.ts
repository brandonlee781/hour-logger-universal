import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { UserModule } from '../user';
import { InvoiceResolver } from './invoice.resolver';
import { LogModule } from '../log/log.module';
import { ProjectModule } from '../project';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './invoice.entity';
import { Log } from '../log';

@Module({
  imports: [UserModule, LogModule, ProjectModule, TypeOrmModule.forFeature([Invoice, Log])],
  providers: [
    InvoiceService,
    InvoiceResolver,
  ],
})
export class InvoiceModule {}
