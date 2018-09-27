import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Project, ProjectService } from '.';
import { Faker } from '../shared/Faker';
import { User, UserService } from '../user';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { Client } from '../client/client.entity';
import { ClientService } from '../client/client.service';

describe('ProjectService', () => {
  let service: ProjectService;
  const user: User = Faker.generateUser();
  const client: Client = Faker.generateClient(user);
  const mockProjects: Project[] = Faker.generateProjects(4, user, client);

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: getRepositoryToken(Project),
          useValue: {
            find({ where: { user: userData, client: clientId } }) {
              if (clientId) {
                return mockProjects.filter(p => p.user.id === userData.id && p.client.id === clientId);
              }
              return mockProjects.filter(p => p.user.id === userData.id);
            },
            findOneOrFail({ where: { id, user: userData } }) {
              return mockProjects.find(p => p.id === id && p.user.id === userData.id) ||
                new EntityNotFoundError(Project, { id, user: userData });
            },
            save(newProject) {
              if (newProject.id) {
                return newProject;
              }
              return Faker.generateProject(newProject.user, newProject.client || null, newProject);
            },
            remove(project: Client) {
              const projectIndex = mockProjects.findIndex(p => p.id === project.id);

              if (projectIndex >= 0) {
                const copy = Object.assign({}, mockProjects[projectIndex]);
                mockProjects.splice(projectIndex, 1);
                delete copy.id;
                return copy;
              }
              return project;
            },
          },
        },
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne(userId) {
              return user;
            },
          },
        },
        ClientService,
        {
          provide: getRepositoryToken(Client),
          useValue: {
            findOneOrFail() {
              return client;
            },
          },
        },
      ],
    }).compile();
    service = module.get(ProjectService);

  });

  it('should exist', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of all projects belonging to user', async () => {
      jest.spyOn(service, 'findAll');

      expect(await service.findAll(user)).toEqual(mockProjects);
    });

    it('should return an empty array if user has no projects', async () => {
      const newUser = Faker.generateUser();
      jest.spyOn(service, 'findAll');

      expect(await service.findAll(newUser)).toEqual([]);
    });
  }); // end findAll

  describe('findOne', () => {
    it('should return a single project belonging to the user', async () => {
      jest.spyOn(service, 'findOne');

      expect(await service.findOne(mockProjects[0].id, user)).toEqual(mockProjects[0]);
    });

    it('should return a not found error if the project does not exist', async () => {
      const error = new EntityNotFoundError(Project, {
        id: '12345',
        user,
      });
      jest.spyOn(service, 'findOne');

      expect(await service.findOne('12345', user)).toEqual(error);
    });

    it('should return a not found error if the project does not belong to the user', async () => {
      const newUser = Faker.generateUser();
      const error = new EntityNotFoundError(Project, {
        id: mockProjects[0].id,
        user: newUser,
      });
      jest.spyOn(service, 'findOne');

      expect(await service.findOne(mockProjects[0].id, newUser)).toEqual(error);
    });
  });

  describe('findByClient', () => {
    it('should return an array of all projects belonging to client and user', async () => {
      const copy = mockProjects.slice(0);
      mockProjects.push(Faker.generateProject(user));
      jest.spyOn(service, 'findByClient');

      expect(await service.findByClient(client.id, user)).toEqual(copy);
    });

    it('should return an empty array if client has no projects', async () => {
      const newClient: Client = Faker.generateClient();
      jest.spyOn(service, 'findByClient');

      expect(await service.findByClient(newClient.id, user)).toEqual([]);
    });
  });

  describe('create', () => {
    it('should create a new project with no client', async () => {
      const newProject: Project = Faker.generateProject(user);
      delete newProject.id;
      jest.spyOn(service, 'create');

      expect(await service.create(newProject, null, user))
        .toMatchObject({
          name: newProject.name,
          color: newProject.color,
          favorite: newProject.favorite,
          user,
        });
    });

    it('should create a new project with a client', async () => {
      const newProject: Project = Faker.generateProject(user, client);
      jest.spyOn(service, 'create');
      const response = await service.create(newProject, client.id, user);

      expect(response.client).toEqual(client);
      expect(response)
        .toMatchObject({
          name: newProject.name,
          color: newProject.color,
          favorite: newProject.favorite,
          user,
        });
    });
  }); // end create

  describe('update', () => {
    it('should update an existing client record', async () => {
      const patch = { name: 'ThisIsATest' };
      const updatedProject = Object.assign({}, mockProjects[0], patch);

      jest.spyOn(service, 'update');

      expect(await service.update(mockProjects[0].id, patch, user))
        .toEqual(updatedProject);
    });
  }); // end update

  describe('delete', () => {
    it('should delete an existing client record', async () => {
      const projectId = mockProjects[0].id;
      const spy = jest.spyOn(service, 'delete');
      const response = await service.delete(projectId, user);

      expect(spy).toBeCalled();
      expect(response.id).toBeUndefined();
      expect(mockProjects.find(c => c.id === projectId))
        .toBeUndefined();
    });

    it('should return a not found error for invalid ID', async () => {
      const invalidId = '123456';
      const error = new EntityNotFoundError(Project, {
        id: invalidId,
        user,
      });

      jest.spyOn(service, 'delete');

      expect(await service.delete(invalidId, user))
        .toEqual(error);
    });
  }); // end delete

  describe('toggleFavorite', () => {
    it('should toggle the favorite column of the project', async () => {
      const toggled = Object.assign({}, mockProjects[0], { favorite: !mockProjects[0].favorite });
      jest.spyOn(service, 'toggleFavorite');
      const response = await service.toggleFavorite(mockProjects[0].id, user);

      expect(response.favorite).toEqual(toggled.favorite);
    });
  });
});
