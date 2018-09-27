import {
  Controller,
  Post,
  HttpStatus,
  HttpCode,
  Get,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { addHours, getTime } from 'date-fns';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token')
  @HttpCode(HttpStatus.OK)
  public async getToken(@Body() body) {
    const token = await this.authService.createToken(body);
    return {
      token,
      expires: getTime(addHours(new Date(), 2)),
    };
  }
}
