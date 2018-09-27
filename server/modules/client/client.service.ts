import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserService } from '../user/user.service';
import { Client } from './client.entity';
import { User } from '../user/user.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    private readonly userService: UserService,
  ) {}

  /**
   * Get an array of all cliets owned by the user
   *
   * @param {string} user The current users ID
   * @returns {Promise<Client[]>}
   */
  public async findAll(user): Promise<Client[]> {
    return this.clientRepository.find({
      where: { user },
    });
  }

  public async findOne(id, user): Promise<Client> {
    return this.clientRepository.findOneOrFail({
      where: { id, user },
    });
  }

  public async create(clientData, userId): Promise<Client> {
    const user = await this.userService.findOne(userId);

    const newClient = new Client();

    newClient.name = clientData.name;
    newClient.address = clientData.address;
    newClient.city = clientData.city;
    newClient.state = clientData.state;
    newClient.zip = clientData.zip;
    newClient.user = user;

    return this.clientRepository.save(newClient);
  }

  public async update(id: string, patch: Partial<Client>, userData: User): Promise<Client> {
    const user = await this.userService.findOne(userData.id);
    const client = await this.clientRepository.findOneOrFail({
      where: { id, user },
    });

    const patched = Object.assign({}, client, patch);

    return await this.clientRepository.save(patched);
  }

  public async delete(id: string, user: User): Promise<Client> {
    const client = await this.clientRepository.findOneOrFail({
      where: { id, user },
    });

    return this.clientRepository.remove(client);
  }
}
