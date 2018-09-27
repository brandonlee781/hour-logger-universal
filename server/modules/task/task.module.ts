import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectModule } from '../project/project.module';
import { UserModule } from '../user/user.module';
import { Task } from './task.entity';
import { TaskResolver } from './task.resolver';
import { TaskService } from './task.service';

@Module({
  imports: [ProjectModule, UserModule, TypeOrmModule.forFeature([Task])],
  providers: [TaskService, TaskResolver],
  exports: [TaskService],
})
export class TaskModule {}
