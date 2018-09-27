import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report, ReportType, ItemView } from './report.entity';
import { Repository } from 'typeorm';
import { Log } from '../log';
import { User } from '../user';

export interface ReportInput {
  date: string;
  type: ReportType;
  logs: string[];
  data: {
    rate?: number;
    itemView?: ItemView;
  };
}

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    @InjectRepository(Log)
    private readonly logRepository: Repository<Log>,
  ) {}

  async findAll(
    user: User,
    { limit , offset }: { limit: number, offset: number } = { limit: 50, offset: 0 },
  ): Promise<Report[]> {
    return await this.reportRepository.find({
      where: { user },
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: string, user: User): Promise<Report> {
    return await this.reportRepository.findOneOrFail({
      where: { id, user },
    });
  }

  async findByType(
    type: ReportInput['type'],
    user: User,
    { limit , offset }: { limit: number, offset: number } = { limit: 50, offset: 0 },
  ): Promise<Report[]> {
    return await this.reportRepository.find({
      where: {
        user,
        type,
      },
      take: limit,
      skip: offset,
    });
  }

  async create(report: ReportInput, user: User): Promise<Report> {
    const num = await this.reportRepository.count({ type: report.type });
    const logs = await this.logRepository.findByIds(report.logs);
    const newReport = new Report();

    newReport.date = report.date;
    newReport.type = report.type;
    newReport.user = user;
    newReport.logs = logs;
    newReport.data = {
      number: num + 1,
      hours: logs.map(l => +l.duration).reduce((a, b) => a + b, 0),
      rate: report.data.rate,
      itemView: report.data.itemView,
    };

    return await this.reportRepository.save(newReport);
  }

  public async delete(id: string, user: User): Promise<Report> {
    const report: Report = await this.reportRepository.findOneOrFail({
      where: { id, user },
    });

    return this.reportRepository.remove(report);
  }
}