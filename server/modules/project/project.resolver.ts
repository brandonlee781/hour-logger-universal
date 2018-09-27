import { Query, Resolver, ResolveProperty, Mutation, Context, Args, Parent } from '@nestjs/graphql';
import { Project } from './project.entity';
import { ProjectService } from './project.service';
import { HttpException, HttpStatus, UseGuards, Inject, forwardRef } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/AuthGuard/AuthGuard.guard';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { Log, LogService } from '../log';
import { GqlAuthGuard } from '../auth/guards/GqlAuthGuard/GqlAuthGuard.guard';
import { GetUser } from '../user/pipes/GetUser.pipe';
import { ClientService, Client } from '../client';

const genColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16);


interface ProjectPayload {
  projects?: Project[];
  project?: Partial<Project>;
}

@Resolver('Project')
@UseGuards(GqlAuthGuard)
export class ProjectResolver {
  constructor(
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
    @Inject(forwardRef(() => LogService))
    private readonly logService: LogService,
    private readonly clientService: ClientService,
  ) {}

  @Query('allProjects')
  async allProjects(@Context('request', GetUser) user: User): Promise<ProjectPayload> {
    const projects: Project[] = await this.projectService.findAll(user);
    return { projects };
  }

  @Query('oneProject')
  async oneProject(
    @Context('request', GetUser) user: User,
    @Args('input') { id }: { id: string },
  ): Promise<ProjectPayload> {
    const project: Project = await this.projectService.findOne(id, user);
    return { project };
  }

  @Mutation()
  async createProject(
    @Context('request', GetUser) user: User,
    @Args('input') { name, color, client }: { name: string, color: string, client: string },
  ): Promise<ProjectPayload> {
    const project: Project = await this.projectService.create(
      { name, color },
      client,
      user,
    );
    return { project };
  }

  @Mutation()
  async toggleProjectFavorite(
    @Context('request', GetUser) user: User,
    @Args('input') { id }: { id: string },
  ): Promise<ProjectPayload> {
    const project: Project = await this.projectService.toggleFavorite(id, user);
    return { project };
  }

  @Mutation()
  async updateProject(
    @Context('request', GetUser) user: User,
    @Args('input') { id, patch }: { id: string, patch: Partial<Project> },
  ): Promise<ProjectPayload> {
    const project: Project = await this.projectService.update(id, patch, user);
    return { project };
  }

  @Mutation()
  async deleteProject(
    @Context('request', GetUser) user: User,
    @Args('input') { id }: { id: string },
  ): Promise<ProjectPayload> {
    const project: Project = await this.projectService.delete(id, user);
    return { project };
  }

  @ResolveProperty('logs')
  async getLogs(
    @Parent() project: Project,
    @Context('request', GetUser) user: User,
  ): Promise<Log[]> {
    const logs = await this.logService.findAllByProjectId(project.id, user, {});
    return logs;
  }

  @ResolveProperty('client')
  async getClient(
    @Parent() project: Project,
    @Context('request', GetUser) user: User,
  ): Promise<Client> {
    const client = await this.clientService.findOne(project.clientId, user);
    return client;
  }

  @ResolveProperty('user')
  async getUser(
    @Parent() project: Project,
  ): Promise<User> {
    return await this.userService.findOne(project.userId);
  }
}
