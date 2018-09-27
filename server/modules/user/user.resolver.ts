import { Query, Resolver, ResolveProperty, Mutation, Context, Args } from '@nestjs/graphql';
import { HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/AuthGuard/AuthGuard.guard';
import { UserService } from './user.service';
import { GqlAuthGuard } from '../auth/guards/GqlAuthGuard/GqlAuthGuard.guard';
import { GetUser } from './pipes/GetUser.pipe';
import { User } from './user.entity';

@Resolver('User')
@UseGuards(GqlAuthGuard)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query('getUser')
  getUser(@Context('request', GetUser) user: User) {
    return this.userService.findCurrentUser(user);
  }

  @Mutation()
  async updateUser(
    @Context('request', GetUser) user: User,
    @Args('input') { patch },
  ) {
    const updatedUser = await this.userService.update(user, patch);
    return { user: updatedUser };
  }
}
