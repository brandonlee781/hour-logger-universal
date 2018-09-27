import { Injectable, Inject, HttpStatus, HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Invoice } from './invoice.entity';
import { INVOICE_REPO_TOKEN, LOG_REPO_TOKEN } from '../../constants';
import { Log } from '../log/log.entity';
import { UserService } from '../user';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice) private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(Log) private readonly logRepository: Repository<Log>,
    private readonly userService: UserService,
  ) {}

  async findAll(user): Promise<Invoice[]> {
    return await this.invoiceRepository.find({
      where: { user },
      order: { number: 'DESC' },
    });
  }

  async findOne(input, user): Promise<Invoice> {
    let where = {};

    if (input.id) {
      where = { user, id: input.id };
    } else if (input.number) {
      where = { user, number: input.number };
    }
    return await this.invoiceRepository.findOne(where);
  }

  async create(invoice, userId): Promise<Invoice> {
    const num = await this.invoiceRepository.count();
    const logs = await this.logRepository.findByIds(invoice.logs);
    const user = await this.userService.findOne(userId);
    const newInvoice = new Invoice();
    newInvoice.date = invoice.date;
    newInvoice.hours = invoice.hours;
    newInvoice.rate = invoice.rate;
    newInvoice.logs = logs;
    newInvoice.number = num + 1;
    newInvoice.user = user;

    return await this.invoiceRepository.save(newInvoice);
  }

  async delete(id, user): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id, user },
    });

    if (invoice) {
      return await this.invoiceRepository.remove(invoice);
    }

    throw new HttpException('Invoice Not Found', HttpStatus.NOT_FOUND);
  }
}
