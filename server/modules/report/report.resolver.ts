import { Query, Resolver, ResolveProperty, Mutation } from '@nestjs/graphql';
import { HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/AuthGuard/AuthGuard.guard';
import { ReportService } from './report.service';
import { GqlAuthGuard } from '../auth/guards/GqlAuthGuard/GqlAuthGuard.guard';

@Resolver('Report')
@UseGuards(GqlAuthGuard)
export class ReportResolver {
  constructor(private readonly reportService: ReportService) {}

  @Query('allReports')
  async allReports(_, { options }, { user }) {
    const reports = this.reportService.findAll(options, user);
    return { reports };
  }

  @Query('oneReport')
  async oneReport(_, { id }, { user }) {
    const report = this.reportService.findOne(id, user);
    return { report };
  }

  @Query('allReportsByType')
  async allReportsByType(_, { input: { type }, options }, { user }) {
    const reports = this.reportService.findByType(type, options, user);
    return { reports };
  }

  @Mutation()
  async createReport(_, { input: { report } }, { user }) {
    const newReport = this.reportService.create(report, user);
    return { report: newReport };
  }
}
