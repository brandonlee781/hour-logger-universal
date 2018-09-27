import * as faker from 'faker';
import { v4 as uuid } from 'uuid';
import { parse, startOfHour, addHours, format } from 'date-fns';
import { Project } from '../project/project.entity';
import { User } from '../user/user.entity';
import { Log } from '../log/log.entity';
import { Report } from '../report/report.entity';
import { Client } from '../client/client.entity';

export class Faker {
  static generateClient(userDefault?: User, clientDefault: Partial<Client> = {}): Client {
    return {
      id: clientDefault.id || uuid(),
      name: clientDefault.name || faker.company.companyName(),
      address: clientDefault.address || faker.address.streetAddress(),
      city: clientDefault.city || faker.address.city(),
      state: clientDefault.state || faker.address.stateAbbr(),
      zip: clientDefault.zip || faker.address.zipCode(),
      user: userDefault || Faker.generateUser(),
      createdAt: format(new Date(), 'ddd MMM DD YYYY HH:mm:ss ZZ'),
      updatedAt: format(new Date(), 'ddd MMM DD YYYY HH:mm:ss ZZ'),
    };
  }

  static generateClients(count: number, userDefault?: User): Client[] {
    let n = 1;
    const logs = [];

    while (n <= count) {
      logs.push(Faker.generateLog(userDefault));
      n++;
    }

    return logs;
  }

  static generateLog(userDefault?: User, projectDefault?: Project, defaultId?: string): Log {
    const duration = Math.round((Math.random() * 8) + 1);
    const start = startOfHour(faker.date.recent());
    const end = addHours(start, duration);
    const project = projectDefault || Faker.generateProject();

    return {
      id: defaultId || uuid(),
      start: format(start, 'YYYY-MM-DD HH:mm:ss'),
      end: format(end, 'YYYY-MM-DD HH:mm:ss'),
      duration,
      project,
      projectId: project.id,
      user: userDefault || Faker.generateUser(),
      note: faker.lorem.sentence(),
      createdAt: format(new Date(), 'ddd MMM DD YYYY HH:mm:ss ZZ'),
      updatedAt: format(new Date(), 'ddd MMM DD YYYY HH:mm:ss ZZ'),
    };
  }

  static generateLogs(count: number, userDefault?: User, projectDefault?: Project): Log[] {
    let n = 1;
    const logs = [];

    while (n <= count) {
      logs.push(Faker.generateLog());
      n++;
    }

    return logs;
  }

  static generateUser(): User {
    return {
      email: faker.internet.email(),
      id: uuid(),
      createdAt: format(new Date(), 'ddd MMM DD YYYY HH:mm:ss ZZ'),
      updatedAt: format(new Date(), 'ddd MMM DD YYYY HH:mm:ss ZZ'),
    };
  }

  static generateUsers(count: number): User[] {
    let n = 1;
    const users = [];

    while (n <= count) {
      users.push(Faker.generateUser());
      n++;
    }

    return users;
  }

  static generateProject(userDefault?: User, clientDefault?: Client, projectDefaults: Partial<Project> = {}): Project {
    return {
      id: uuid(),
      name: projectDefaults.name || faker.internet.domainName(),
      color: projectDefaults.color || faker.internet.color(),
      favorite: projectDefaults.favorite || true,
      client: clientDefault || Faker.generateClient(userDefault || null),
      user: userDefault || Faker.generateUser(),
      createdAt: format(new Date(), 'ddd MMM DD YYYY HH:mm:ss ZZ'),
      updatedAt: format(new Date(), 'ddd MMM DD YYYY HH:mm:ss ZZ'),
    };
  }

  static generateProjects(count: number, userDefault?: User, clientDefault?: Client): Project[] {
    let n = 1;
    const projects = [];

    while (n <= count) {
      projects.push(Faker.generateProject(userDefault, clientDefault, {}));
      n++;
    }

    return projects;
  }

  static generateReport(n: number = 1, defaultUser?: User, defaultObject: Partial<Report> = {}): Report {
    const num = Math.round((Math.random() * 4) + 1);
    const user = defaultUser || Faker.generateUser();
    const logs = defaultObject.logs || Faker.generateLogs(num, user);
    const defaultData = {
        number: defaultObject.data ? defaultObject.data.number : n,
        hours: logs.map(l => l.duration).reduce((a, b) => a + b, 0),
        rate: defaultObject.data ? defaultObject.data.rate : 25,
        itemView: defaultObject.data ? defaultObject.data.itemView : 'project',
      };

    return {
        id: defaultObject.id || uuid(),
        date: defaultObject.date || format(new Date(), 'YYYY-MM-DD'),
        type: defaultObject.type || 'invoice',
        user,
        logs,
        data: defaultData,
        createdAt: format(new Date(), 'ddd MMM DD YYYY HH:mm:ss ZZ'),
        updatedAt: format(new Date(), 'ddd MMM DD YYYY HH:mm:ss ZZ'),
      };
  }

  static generateReports(count: number, user: User = Faker.generateUser()): Report[] {
    let n = 1;
    const reports = [];

    while (n <= count) {
      reports.push(Faker.generateReport(n, user));
      n++;
    }

    return reports;
  }
}