import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Repository, getManager } from 'typeorm';
import { Task } from './task.entity';
import { TASK_REPO_TOKEN, PROJECT_REPO_TOKEN } from '../../constants';
import { ProjectService } from '../project/project.service';
import { UserService } from '../user/user.service';
import { User } from '../user';
import { InjectRepository } from '@nestjs/typeorm';

interface TaskInput {
  text: string;
  project: string;
  estimate: number;
  priority: number;
  parent: string;
}

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
  ) {}

  async findAll(user, { limit = 50, offset = 0 }): Promise<Task[]> {
    const tasks = await this.taskRepository.find({
      where: { user, parent: null },
      take: limit,
      skip: offset,
      order: {
        priority: 'DESC',
        createdAt: 'DESC',
      },
    });
    return await Promise.all(tasks.map(t => {
      return getManager().getTreeRepository(Task).findDescendantsTree(t);
    }));
  }

  async findByProject(project: string, user: User, { limit = 50, offset = 0 }): Promise<Task[]> {
    const tasks = await this.taskRepository.find({
      where: { project, user, parent: null },
      take: limit,
      skip: offset,
      order: {
        priority: 'DESC',
        createdAt: 'DESC',
      },
    });
    return await Promise.all(tasks.map(t => {
      return getManager().getTreeRepository(Task).findDescendantsTree(t);
    }));
  }

  async findAllByProject(project: string, user: User, { limit = 50, offset = 0 }): Promise<Task[]> {
    return await this.taskRepository.find({
      where: { project, user },
      take: limit,
      skip: offset,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id, user) {
    const task = await this.taskRepository.findOne({
      where: { id, user },
    });
    return await getManager().getTreeRepository(Task).findDescendantsTree(task);
  }

  async toggleTask(id, user) {
    const task = await this.taskRepository.findOne({
      where: {id, user},
    });
    task.completed = !task.completed;
    return this.taskRepository.save(task);
  }

  async createTask(newTask: TaskInput, user: User): Promise<Task> {
    const project = await this.projectService.findOne(newTask.project, user);
    const parent = await this.taskRepository.findOne({
      where: { user, id: newTask.parent },
    });

    const task = new Task();
    task.text = newTask.text;
    task.project = project;
    task.priority = newTask.priority || 0;
    task.estimate = newTask.estimate || 0;
    task.parent = parent;
    task.user = user;

    return await this.taskRepository.save(task);
  }

  async updateTask(id: string, patch: Partial<Task>, user: User): Promise<Task> {
    let task = await this.taskRepository.findOne({
      where: { id, user },
    });
    if (task) {
      task = Object.assign({}, task, patch);
      await this.taskRepository.save(task);
      return getManager().getTreeRepository(Task).findDescendantsTree(task);
    }
    throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
  }

  async updateParent(id: string, parentId: string, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id, user } });
    const parent = await this.taskRepository.findOne({
      where: { user, id: parentId },
    });

    if (task && parent) {
      task.parent = parent;
      await this.taskRepository.save(task);
      return getManager().getTreeRepository(Task).findDescendantsTree(task);
    }
    throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
  }

  async deleteTask(id: string, user: User): Promise<Task> {
    if (!id || id === '') {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
    const task = await this.taskRepository.findOne({
      where: { id, user },
    });
    const children = await getManager().getTreeRepository(Task).findDescendants(task);

    if (children) {
      await Promise.all(children.slice(1).reverse().map(c => this.taskRepository.remove(c)));
    }

    if (task) {
      return await this.taskRepository.remove(task);
    }
    throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
  }
}
