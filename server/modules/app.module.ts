import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AngularUniversalModule, applyDomino } from '@nestjs/ng-universal';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as env from 'dotenv';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { Client } from './client/client.entity';
import { ClientModule } from './client/client.module';
import { DontBeA } from './dontbea/dontbea.entity';
import { DontbeaModule } from './dontbea/dontbea.module';
import { Invoice } from './invoice/invoice.entity';
import { InvoiceModule } from './invoice/invoice.module';
import { Log } from './log/log.entity';
import { LogModule } from './log/log.module';
import { Project } from './project';
import { ProjectModule } from './project/project.module';
import { Report } from './report';
import { ReportModule } from './report/report.module';
import { Task } from './task';
import { TaskModule } from './task/task.module';
import { User } from './user';
import { UserModule } from './user/user.module';

env.config();

const BROWSER_DIR = join(process.cwd(), 'dist/browser');
applyDomino(global, join(BROWSER_DIR, 'index.html'));

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [
        Client,
        DontBeA,
        Invoice,
        Log,
        Project,
        Report,
        Task,
        User,
      ],
      // synchronize: true,
      keepConnectionAlive: true
    }),
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      debug: true,
      playground: true,
      tracing: true,
      path: '/api/graphql',
      context: ({ req }) => ({ request: req }),
      rootValue: ({ req }) => ({ req }),
    }),
    AngularUniversalModule.forRoot({
      viewsPath: BROWSER_DIR,
      bundle: require('./../../dist/server/main.js'),
    }),
    AuthModule,
    DontbeaModule,
    InvoiceModule,
    LogModule,
    ProjectModule,
    ReportModule,
    TaskModule,
    UserModule,
    ClientModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  // constructor(private readonly graphQLFactory: GraphQLFactory) {}

  // configure(consumer: MiddlewareConsumer) {
  //   const typeDefs = this.graphQLFactory.mergeTypesByPaths('./**/*.graphql');
  //   const schema = this.graphQLFactory.createSchema({ typeDefs });

  //   consumer
  //     .apply(graphqlExpress(req => ({ schema, rootValue: req, context: req })))
  //     .forRoutes('/api/graphql')
  //     .apply(graphiqlExpress({ endpointURL: '/api/graphql' }))
  //     .forRoutes('/api/graphiql');
  // }
}
