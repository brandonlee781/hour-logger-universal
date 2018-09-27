import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';

import { UserService } from '../user/user.service';
import { JwtPayload } from './interface/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async createToken({email, password}: JwtPayload): Promise<string> {
    const user = await this.userService.findByEmail(email);
    const isValid = await compare(password, user.password);

    if (isValid) {
      return this.jwtService.sign({ id: user.id, email: user.email });
    } else {
      throw new UnauthorizedException();
    }
  }

  async validateUser(payload): Promise<any> {
    const { id, email } = await this.userService.findByEmail(payload.email);
    return { id, email };
  }
}
