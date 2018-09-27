import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProjectService } from '../project';
import { User, UserService } from '../user';
import { Log } from './log.entity';
import { LogInput } from './log.resolver';
import { QueryOptions } from '../shared/types';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(Log)
    private readonly logRepository: Repository<Log>,
    @Inject(forwardRef(() => ProjectService))
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
  ) {}

  async findAll(
    user: User,
    { limit, offset }: QueryOptions = { limit: 50, offset: 0 }
  ): Promise<Log[]> {
    return await this.logRepository.find({
      where: { user },
      take: limit,
      skip: offset,
      order: {
        start: 'DESC',
      },
    });
  }

  async findOne(id: string, user: User): Promise<Log> {
    return await this.logRepository.findOne({
      where: { id, user },
    });
  }

  async findAllByProjectName(
    name: string,
    user: User,
    { limit, offset }: QueryOptions = {limit: 50, offset: 0},
  ): Promise<Log[]> {
    return await this.logRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.project', 'project')
      .where('project.name = :name', { name })
      .andWhere('log.user_id = :user', { user: user.id })
      .limit(limit)
      .offset(offset)
      .orderBy({
        'log.start': 'DESC',
      })
      .getMany();
  }

  async findAllByProjectId(
    id: string,
    user: User,
    { limit, offset }: QueryOptions = {limit: 50, offset: 0},
  ): Promise<Log[]> {
    return await this.logRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.project', 'project')
      .where('project.id = :id', { id })
      .andWhere('log.user_id = :user', { user: user.id })
      .limit(limit)
      .offset(offset)
      .orderBy({
        'log.start': 'DESC',
      })
      .getMany();
  }

  async findAllByDates(
    start = '1970-01-01',
    end = '2100-12-12',
    projects: string | string[] = [],
    user: User,
    { limit, offset }: QueryOptions = {limit: 50, offset: 0},
  ): Promise<Log[]> {
    const query = this.logRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.project', 'project')
      .where('log.user_id = :user', { user: user.id })
      .andWhere('log.start::date >= :start', { start })
      .andWhere('log.start::date <= :end', { end });

    if (projects && projects.length) {
      query.andWhere('project.id IN (:...projects)', { projects });
    }
    const sql = query.getSql();
    return query
      .orderBy('start', 'ASC')
      .limit(limit)
      .offset(offset)
      .getMany();
  }

  async createLog(newLog: LogInput, userData: User): Promise<Log> {
    const user = await this.userService.findOne(userData.id);
    const project = await this.projectService.findOne(newLog.project, user);

    const log = new Log();
    log.start = newLog.start;
    log.end = newLog.end;
    log.duration = newLog.duration;
    log.project = project;
    log.user = user;
    log.note = newLog.note;

    return await this.logRepository.save(log);
  }

  async updateLog(id: string, patch: LogInput, user: User): Promise<Log> {
    const log = await this.logRepository.findOne({
      where: { id, user },
    });
    const project = await this.projectService.findOne(patch.project, user);

    if (log) {
      log.start = patch.start ? patch.start : log.start;
      log.end = patch.end ? patch.end : log.end;
      log.duration = patch.duration ? patch.duration : log.duration;
      log.project = patch.project ? project : log.project;
      log.note = patch.note ? patch.note : log.note;
      return await this.logRepository.save(log);
    }
    throw new HttpException('Log not found', HttpStatus.NOT_FOUND);
  }

  async deleteLog(id: string, user: User): Promise<Log> {
    const log = await this.logRepository.findOne({
      where: { id, user },
    });

    if (log) {
      return await this.logRepository.remove(log);
    }
    throw new HttpException('Log Not Found', HttpStatus.NOT_FOUND);
  }
}
