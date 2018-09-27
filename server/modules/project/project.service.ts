import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ClientService } from '../client/client.service';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { Project } from './project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly userService: UserService,
    private readonly clientService: ClientService,
  ) {}

  async findAll(user: User): Promise<Project[]> {
    return await this.projectRepository.find({
      where: { user },
      order: {
        name: 'ASC',
      },
    });
  }

  async findByClient(client: string, user: User): Promise<Project[]> {
    return await this.projectRepository.find({
      where: {
        user,
        client,
      },
      order: {
        name: 'ASC',
      },
    });
  }

  async findOne(id: string, user: User): Promise<Project> {
    return await this.projectRepository.findOneOrFail({
      where: { id, user },
    });
  }

  async create(projectData: Partial<Project>, clientId: string, userData: Partial<User>): Promise<Project> {
    const user = await this.userService.findOne(userData.id);
    const client = await this.clientService.findOne(clientId, user);
    const newProject = new Project();

    newProject.name = projectData.name;
    newProject.color = projectData.color;
    newProject.user = user;
    newProject.client = client;

    return await this.projectRepository.save(newProject);
  }

  async update(id: string, patch: Partial<Project>, user: User): Promise<Project> {
    const project = await this.projectRepository.findOneOrFail({
      where: { id, user },
    });

    const patched = Object.assign({}, project, patch);

    return await this.projectRepository.save(patched);
  }

  async toggleFavorite(id: string, user: User): Promise<Project> {
    const project = await this.projectRepository.findOneOrFail({
      where: { id, user },
    });
    project.favorite = !project.favorite;

    return await this.projectRepository.save(project);
  }

  async delete(id: string, user: User): Promise<Project> {
    const project = await this.projectRepository.findOneOrFail({
      where: { id, user },
    });

    return await this.projectRepository.remove(project);
  }
}
