import { Query, Resolver, ResolveProperty, Mutation, Parent, Context, Args } from '@nestjs/graphql';
import { Log } from './log.entity';
import { LogService } from './log.service';
import { HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/AuthGuard/AuthGuard.guard';
import { Project } from '../project/project.entity';
import { ProjectService } from '../project/project.service';
import { User, UserService } from '../user';
import { GqlAuthGuard } from '../auth/guards/GqlAuthGuard/GqlAuthGuard.guard';
import { GetUser } from '../user/pipes/GetUser.pipe';
import { QueryOptions } from '../shared/types';

export interface LogInput {
  id?: string;
  name?: string;
  start?: string;
  end?: string;
  project?: string;
  duration?: number;
  note?: string;
  log?: LogInput;
  patch?: LogInput;
}

export interface LogPayload {
  logs?: Log[];
  log?: Log;
}

@Resolver('Log')
@UseGuards(GqlAuthGuard)
export class LogResolver {
  constructor(
    private readonly logService: LogService,
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
  ) {}

  @Query('allLogs')
  async allLogs(
    @Args('options') options: QueryOptions,
    @Context('request', GetUser) user: User,
  ): Promise<LogPayload> {
    const logs = await this.logService.findAll(user, options);
    return { logs };
  }

  @Query('oneLog')
  async oneLog(
    @Args('input') { id }: LogInput,
    @Context('request', GetUser) user: User,
  ): Promise<LogPayload> {
    const log = await this.logService.findOne(id, user);
    return { log };
  }

  @Query('allLogsByProjectName')
  async allLogsByProjectName(
    @Args('input') { name }: LogInput,
    @Args('options') options: QueryOptions,
    @Context('request', GetUser) user: User,
  ): Promise<LogPayload> {
    let logs;

    if (name) {
      logs = await this.logService.findAllByProjectName(name, user, options);
    } else {
      logs = await this.logService.findAll(user, options);
    }
    return { logs };
  }

  @Query('allLogsByProjectId')
  async allLogsByProjectId(
    @Args('input') { id }: LogInput,
    @Args('options') options: QueryOptions,
    @Context('request', GetUser) user: User,
  ): Promise<LogPayload> {
    let logs;

    if (id) {
      logs = await this.logService.findAllByProjectId(id, user, options);
    } else {
      logs = await this.logService.findAll(user, options);
    }
    return { logs };
  }

  @Query('allLogsByDates')
  async allLogsByDates(
    @Args('input') { start, end, project }: LogInput,
    @Args('options') options: QueryOptions,
    @Context('request', GetUser) user: User,
  ): Promise<LogPayload> {
    const logs = await this.logService.findAllByDates(
      start,
      end,
      project,
      user,
      options,
    );
    return { logs };
  }

  @Mutation()
  async createLog(
    @Args('input') { log }: LogInput,
    @Context('request', GetUser) user: User,
  ): Promise<LogPayload> {
    const newLog = await this.logService.createLog(log, user);
    return { log: newLog };
  }

  @Mutation()
  async updateLog(
    @Args('input') { id, patch }: LogInput,
    @Context('request', GetUser) user: User,
  ): Promise<LogPayload> {
    const log = await this.logService.updateLog(id, patch, user);
    return { log };
  }

  @Mutation()
  async deleteLog(
    @Args('input') { id }: LogInput,
    @Context('request', GetUser) user: User,
  ): Promise<LogPayload> {
    const log = await this.logService.deleteLog(id, user);
    return { log };
  }

  @ResolveProperty('project')
  async getProjects(
    @Parent() log,
    @Context('request', GetUser) user: User,
  ): Promise<Project> {
    const project = await this.projectService.findOne(log.projectId, user);
    return project;
  }

  @ResolveProperty('user')
  async getUser(
    @Parent() log: Log,
  ): Promise<User> {
    return await this.userService.findOne(log.userId);
  }
}
