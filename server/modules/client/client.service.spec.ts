import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

import { Faker } from '../shared/Faker';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { Client } from './client.entity';
import { ClientService } from './client.service';

describe('ClientService', () => {
  let service: ClientService;
  const user = Faker.generateUser();
  const mockClients = Faker.generateClients(3, user);

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientService,
        {
          provide: getRepositoryToken(Client),
          useValue: {
            find({ where: { user: userData } }) {
              return mockClients.filter(c => c.user.id === userData.id);
            },
            findOneOrFail({ where: { id, user: userData } }) {
              return mockClients.find(c => c.id === id && c.user.id === userData.id) ||
                new EntityNotFoundError(Client, { id, user: userData });
            },
            save(newClient) {
              if (newClient.id) {
                return newClient;
              }
              return Faker.generateClient(newClient.user, newClient);
            },
            remove(client: Client) {
              const clientIndex = mockClients.findIndex(c => c.id === client.id);

              if (clientIndex >= 0) {
                const copy = Object.assign({}, mockClients[clientIndex]);
                mockClients.splice(clientIndex, 1);
                delete copy.id;
                return copy;
              }
              return client;
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
      ],
    }).compile();
    service = module.get<ClientService>(ClientService);
  }); // end beforeAll

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of all clients', async () => {
      jest.spyOn(service, 'findAll');

      expect(await service.findAll(user)).toEqual(mockClients);
    });

    it('should return an empty array if user has no clients', async () => {
      const newUser = Faker.generateUser();
      jest.spyOn(service, 'findAll');

      expect(await service.findAll(newUser.id)).toEqual([]);
    });
  }); // end findAll

  describe('findOne', () => {
    it('should return a single client object', async () => {
      jest.spyOn(service, 'findOne');

      expect(await service.findOne(mockClients[0].id, mockClients[0].user))
        .toEqual(mockClients[0]);
    });

    it('should return not found error if client does not belong to user', async () => {
      const newUser = Faker.generateUser();
      const error = new EntityNotFoundError(Client, {
        id: mockClients[0].id,
        user: newUser,
      });
      jest.spyOn(service, 'findOne');

      expect(await service.findOne(mockClients[0].id, newUser))
        .toEqual(error);
    });
  }); // end findOne

  describe('create', () => {
    it('should create a new client record', async () => {
      const newClient = Faker.generateClient(user);
      delete newClient.id;
      jest.spyOn(service, 'create');

      expect(await service.create(newClient, user))
        .toMatchObject({
          name: newClient.name,
          address: newClient.address,
          city: newClient.city,
          state: newClient.state,
          zip: newClient.zip,
          user,
        });
    });
  }); // end create

  describe('update', () => {
    it('should update an existing client record', async () => {
      const patch = { name: 'ThisIsATest' };
      const updatedClient = Object.assign({}, mockClients[0], patch);

      jest.spyOn(service, 'update');

      expect(await service.update(mockClients[0].id, patch, user))
        .toEqual(updatedClient);
    });
  }); // end update

  describe('delete', () => {
    it('should delete an existing client record', async () => {
      const clientId = mockClients[0].id;
      const spy = jest.spyOn(service, 'delete');
      const response = await service.delete(clientId, user);

      expect(spy).toBeCalled();
      expect(response.id).toBeUndefined();
      expect(mockClients.find(c => c.id === clientId))
        .toBeUndefined();
    });

    it('should return a not found error for invalid ID', async () => {
      const invalidId = '123456';
      const error = new EntityNotFoundError(Client, {
        id: invalidId,
        user,
      });

      jest.spyOn(service, 'delete');

      expect(await service.delete(invalidId, user))
        .toEqual(error);
    });
  }); // end delete
});
