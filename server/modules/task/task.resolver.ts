import { UseGuards } from '@nestjs/common';
import { Mutation, Query, Resolver, Context, Args } from '@nestjs/graphql';

import { GqlAuthGuard } from '../auth/guards/GqlAuthGuard/GqlAuthGuard.guard';
import { QueryOptions } from '../shared/types';
import { User } from '../user';
import { GetUser } from '../user/pipes/GetUser.pipe';
import { Task } from './task.entity';
import { TaskService } from './task.service';

interface TaskRes {
  task: Task;
}
interface TasksRes {
  tasks: Task[];
}

@Resolver('Task')
@UseGuards(GqlAuthGuard)
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

  @Query('allTasks')
  async allTasks(
    @Context('request', GetUser) user: User,
    @Args('options') options: QueryOptions,
  ): Promise<TasksRes> {
    const tasks = await this.taskService.findAll(user, options);
    return { tasks };
  }

  @Query('projectTasks')
  async projectTasks(
    @Context('request', GetUser) user: User,
    @Args('input') { project, options },
  ): Promise<TasksRes> {
    const tasks = await this.taskService.findByProject(project, user, options);
    return { tasks };
  }
  @Query('allProjectTasks')
  async allProjectTasks(
    @Context('request', GetUser) user: User,
    @Args('input') { project, options },
  ): Promise<TasksRes> {
    const tasks = await this.taskService.findAllByProject(project, user, options);
    return { tasks };
  }

  @Query('oneTask')
  async oneTask(
    @Context('request', GetUser) user: User,
    @Args('input') { id },
  ): Promise<TaskRes> {
    const task = await this.taskService.findOne(id, user);
    return { task };
  }

  @Mutation()
  async createTask(
    @Context('request', GetUser) user: User,
    @Args('input') { task },
  ): Promise<TaskRes> {
    const newTask = await this.taskService.createTask(task, user);
    return { task: newTask };
  }

  @Mutation()
  async toggleTask(
    @Context('request', GetUser) user: User,
    @Args('input') { id },
  ): Promise<TaskRes> {
    const toggledTask = await this.taskService.toggleTask(id, user);
    return { task: toggledTask };
  }

  @Mutation()
  async updateTask(
    @Context('request', GetUser) user: User,
    @Args('input') { id, patch },
  ): Promise<TaskRes> {
    const task = await this.taskService.updateTask(id, patch, user);
    return { task };
  }

  @Mutation()
  async updateTaskParent(
    @Context('request', GetUser) user: User,
    @Args('input') { id, parent },
  ): Promise<TaskRes> {
    const task = await this.taskService.updateParent(id, parent, user);
    return { task };
  }

  @Mutation()
  async deleteTask(
    @Context('request', GetUser) user: User,
    @Args('input') { id },
  ) {
    const task = await this.taskService.deleteTask(id, user);
    return { task };
  }

}
