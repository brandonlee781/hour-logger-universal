import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';
import { UserModule } from '../user/user.module';
import { ProjectModule } from '../project/project.module';
import { LogService } from './log.service';
import { LogResolver } from './log.resolver';
import { Log } from './log.entity';
import { User } from '../user/user.entity';
import { Faker } from '../shared/Faker';
import { Project, ProjectService } from '../project';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '../user';
import { ClientService } from '../client/client.service';
import { Client } from '../client/client.entity';

describe('LogService', () => {
  let module: TestingModule;
  let service: LogService;
  const user: User = Faker.generateUser();
  const projects: Project[] = Faker.generateProjects(2, user);
  const logs: Log[] = [
    ...Faker.generateLogs(5, user, projects[0]),
    ...Faker.generateLogs(5, user, projects[1]),
  ];

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        LogService,
        {
          provide: getRepositoryToken(Log),
          useValue: {},
        },
        ProjectService,
        {
          provide: getRepositoryToken(Project),
          useValue: {},
        },
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
        ClientService,
        {
          provide: getRepositoryToken(Client),
          useValue: {},
        },
      ],
    }).compile();
    service = module.get(LogService);

  });

  it('should exist', () => {
    expect(service).toBeDefined();
  });

  // describe('findAll', () => {
  //   it('should return an array of all logs', async () => {
  //     jest.spyOn(service, 'findAll').mockImplementation(() => logs);

  //     expect(await service.findAll(user)).toBe(logs);
  //   });
  // });

  // describe('findOne', () => {
  //   it('should return the specified log', async () => {
  //     jest
  //       .spyOn(service, 'findOne')
  //       .mockImplementation(id => logs.find(l => l.id === id));

  //     expect(await service.findOne(logs[0].id, user)).toBe(logs[0]);
  //   });
  // });

  // describe('findAllByProjectName', () => {
  //   it('should return all logs that belong to the passed project name', async () => {
  //     jest
  //       .spyOn(service, 'findAllByProjectName')
  //       .mockImplementation(name => logs.filter(l => l.project.name === name));

  //     expect(
  //       await service.findAllByProjectName(logs[0].project.name, user),
  //     ).toEqual([logs[0]]);
  //   });
  // });

  // describe('findAllByProjectId', () => {
  //   it('should return all logs that belong to passed project id', async () => {
  //     jest
  //       .spyOn(service, 'findAllByProjectId')
  //       .mockImplementation(id => logs.filter(l => l.project.id === id));

  //     expect(
  //       await service.findAllByProjectId(logs[4].project.id, user.id),
  //     ).toEqual([logs[3], logs[4]]);
  //   });
  // });

  // describe('findAllByDates', () => {
  //   it('should return all logs between two passed dates', async () => {
  //     jest.spyOn(service, 'findAllByDates').mockImplementation((start, end) =>
  //       logs.filter(l => {
  //         return (
  //           new Date(l.date) <= new Date(end) &&
  //           new Date(l.date) >= new Date(start)
  //         );
  //       }),
  //     );

  //     expect(
  //       await service.findAllByDates('2018-03-01', '2018-03-04', null, user.id),
  //     ).toEqual([logs[3], logs[4]]);
  //   });

  //   it('should return all logs from 1970 forward if no start date is passed', async () => {
  //     jest.spyOn(service, 'findAllByDates').mockImplementation((start, end) =>
  //       logs.filter(l => {
  //         return (
  //           new Date(l.date) <= new Date(end) &&
  //           new Date(l.date) >= new Date('1970-01-01')
  //         );
  //       }),
  //     );

  //     expect(
  //       await service.findAllByDates(null, '2018-02-28', null, user.id),
  //     ).toEqual([logs[0], logs[1], logs[2], logs[5]]);
  //   });

  //   it('should return all logs from start to 2100 if no end date is passed', async () => {
  //     jest.spyOn(service, 'findAllByDates').mockImplementation((start, end) =>
  //       logs.filter(l => {
  //         return (
  //           new Date(l.date) <= new Date('2100-12-12') &&
  //           new Date(l.date) >= new Date(start)
  //         );
  //       }),
  //     );

  //     expect(
  //       await service.findAllByDates('2018-03-01', null, null, user.id),
  //     ).toEqual([logs[3], logs[4]]);
  //   });
  // });

  // describe('createLog', () => {
  //   it('should create a new log and return it', async () => {
  //     const date = new Date().toISOString();
  //     const inputLog = {
  //       startTime: '08:00:00',
  //       endTime: '15:00:00',
  //       date: '2018-02-28',
  //       duration: 7,
  //       project: '9ed94c22-afda-4912-9689-36530dd481a9',
  //       note: 'Et cupiditate maxime.',
  //     };
  //     const projects = [
  //       {
  //         id: '9ed94c22-afda-4912-9689-36530dd481a9',
  //         name: 'efren.com',
  //         color: '#f44336',
  //         createdAt: 'Mon Mar 05 2018 06:59:44 GMT-0600 (CST)',
  //         updatedAt: 'Mon Mar 05 2018 06:59:44 GMT-0600 (CST)',
  //       },
  //     ];
  //     jest.spyOn(service, 'createLog').mockImplementation((newLog, userId) => {
  //       const log = Object.assign({}, newLog, {
  //         id: '6',
  //         createdAt: date,
  //         updatedAt: date,
  //         user,
  //         project: projects.find(p => p.id === newLog.project),
  //       });
  //       logs.push(log);
  //       return log;
  //     });

  //     expect(await service.createLog(inputLog, user.id)).toEqual(
  //       Object.assign({}, inputLog, {
  //         id: '6',
  //         createdAt: date,
  //         updatedAt: date,
  //         user,
  //         project: projects.find(p => p.id === inputLog.project),
  //       }),
  //     );
  //   });
  // });

  // describe('updateLog', () => {
  //   it('should update the chosen log with the new data', async () => {
  //     const date = new Date().toISOString();
  //     jest
  //       .spyOn(service, 'updateLog')
  //       .mockImplementation((id, patch, userId) => {
  //         const logIndex = logs.findIndex(
  //           l => l.id === id && l.user.id === userId,
  //         );
  //         logs[logIndex] = Object.assign({}, logs[logIndex], patch, {
  //           updatedAt: date,
  //         });
  //         return logs[logIndex];
  //       });

  //     expect(await service.updateLog('4', { note: 'test' }, user.id)).toEqual(
  //       Object.assign({}, logs[1], {
  //         note: 'test',
  //         updatedAt: date,
  //       }),
  //     );
  //   });
  // });

  // describe('deleteLog', () => {
  //   it('should delete the chosen log if it belongs to the user', async () => {
  //     const oldLog = Object.assign({}, logs[1]);
  //     jest.spyOn(service, 'deleteLog').mockImplementation((id, userId) => {
  //       const logIndex = logs.findIndex(
  //         l => l.id === id && l.user.id === userId,
  //       );
  //       const deletedLog = Object.assign({}, logs[logIndex]);
  //       logs.splice(logIndex, 1);
  //       return deletedLog;
  //     });

  //     expect(await service.deleteLog('4', user.id)).toEqual(oldLog);
  //     expect(logs).not.toContain(oldLog);
  //   });
  // });
});
