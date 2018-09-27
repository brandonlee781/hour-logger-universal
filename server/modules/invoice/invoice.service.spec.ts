import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';
import { InvoiceService } from './invoice.service';
import { UserModule, User, UserService } from '../user';
import { InvoiceResolver } from './invoice.resolver';
import { Invoice } from './invoice.entity';
import { Log } from '../log/log.entity';
import { ProjectModule } from '../project';
import { Faker } from '../shared/Faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LogService } from '../log/log.service';

describe('InvoiceService', () => {
  let module: TestingModule;
  let service: InvoiceService;
  const user: User = Faker.generateUser();

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        InvoiceService,
        {
          provide: getRepositoryToken(Invoice),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Log),
          useValue: {},
        },
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
      ],
    }).compile();
    service = module.get(InvoiceService);
  });

  it('should exist', () => {
    expect(service).toBeDefined();
  });

});
