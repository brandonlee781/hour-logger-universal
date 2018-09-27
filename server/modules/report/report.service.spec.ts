import { TestingModule, Test, TestingModuleBuilder } from '@nestjs/testing';
import { User, UserModule } from '../user';
import { Report } from './report.entity';
import { ReportService, ReportInput } from './report.service';
import { LogModule, Log } from '../log';
import { ProjectModule } from '../project';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Faker } from '../shared/Faker';
import * as faker from 'faker';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

describe('ReportService', () => {
  let module: TestingModule;
  let service: ReportService;
  const user: User = Faker.generateUser();
  const logs = Faker.generateLogs(4);
  const reports: Report[] = Faker.generateReports(3, user);

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        ReportService,
        {
          provide: getRepositoryToken(Report),
          useValue: {
            find({ where: { user: userData, type } }) {
              if (type) {
                return reports.filter(r => r.user.id === userData.id && r.type === type);
              }
              return reports.filter(r => r.user.id === userData.id);
            },
            findOneOrFail({ where: { id, user: userData } }) {
              return reports.find(r => r.id === id && r.user.id === userData.id) ||
                new EntityNotFoundError(Report, { id, user: userData });
            },
            count() {
              return reports.length;
            },
            save(newReport) {
              if (newReport.id) {
                return newReport;
              }
              return Faker.generateReport(1, user, newReport);
            },
            remove(report: Report) {
              const index = reports.findIndex(r => r.id === report.id);

              if (index >= 0) {
                const copy = Object.assign({}, reports[index]);
                reports.splice(index, 1);
                delete copy.id;
                return copy;
              }
              return report;
            },
          },
        },
        {
          provide: getRepositoryToken(Log),
          useValue: {
            findByIds() {
              return logs;
            },
          },
        },
      ],
    }).compile();

    service = module.get(ReportService);
  });

  it('should exist', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of reports', async () => {
      jest.spyOn(service, 'findAll');

      expect(await service.findAll(user)).toEqual(reports);
    });
  });

  describe('findOne', () => {
    it('should return an single report', async () => {
      jest.spyOn(service, 'findOne');

      expect(await service.findOne(reports[0].id, user))
        .toEqual(reports[0]);
    });
  });

  describe('findByType', () => {
    it('should return all reports of a given type', async () => {
      const invoices: Report[] = reports.filter(r => r.type === 'invoice');
      jest.spyOn(service, 'findByType');

      expect(await service.findByType('invoice', user))
        .toEqual(invoices);
    });
  });

  describe('create', () => {
    it('should create a new report', async () => {
      const createReport: ReportInput = {
        date: faker.date.recent().toDateString(),
        type: 'invoice' as 'invoice',
        logs: logs.map(l => l.id),
        data: {
          rate: 25,
          itemView: 'note' as 'note',
        },
      };
      jest.spyOn(service, 'create');

      const report = await service.create(createReport, user);

      expect(report).toBeTruthy();
      expect(report.logs).toBeInstanceOf(Array);
      expect(report.user).toEqual(user);
      expect(report.type).toEqual(createReport.type);
      expect(report.data.rate).toEqual(createReport.data.rate);
      expect(report.data.itemView).toEqual(createReport.data.itemView);
      expect(report.data.hours)
        .toEqual(logs.map(l => +l.duration).reduce((a, b) => a + b, 0));
    });
  }); // end create

  describe('delete', () => {
    it('should delete the specified report', async () => {
      const reportId = reports[0].id;
      const spy = jest.spyOn(service, 'delete');
      const response = await service.delete(reportId, user);

      expect(spy).toBeCalled();
      expect(response.id).toBeUndefined();
      expect(reports.find(r => r.id === reportId))
        .toBeUndefined();
    });

    it('should return a not found error for invalid ID', async () => {
      const invalidId = '123456';
      const error = new EntityNotFoundError(Report, {
        id: invalidId,
        user,
      });

      jest.spyOn(service, 'delete');

      expect(await service.delete(invalidId, user))
        .toEqual(error);
    });
  }); // end delete
});