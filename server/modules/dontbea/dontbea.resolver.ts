import { Query, Resolver, ResolveProperty, Mutation } from '@nestjs/graphql';
import { DontBeA } from './dontbea.entity';
import { DontBeAService } from './dontbea.service';
import { HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/AuthGuard/AuthGuard.guard';

@Resolver('DontBeA')
export class DontBeAResolver {
  constructor(private readonly dontBeAService: DontBeAService) {}

  @Query('allDontBeAs')
  async allDontBeAs(obj, args, ctx, info) {
    const dontBeAs = this.dontBeAService.findAll();
    return { dontBeAs };
  }

  @Query('randomDontBeA')
  async randomDontBeA(obj, args, ctx, info) {
    const dontBeA = this.dontBeAService.findRand();
    return { dontBeA };
  }
}
