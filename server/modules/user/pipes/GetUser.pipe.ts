import { PipeTransform, Injectable, ArgumentMetadata, HttpStatus, BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../user.entity';

@Injectable()
export class GetUser implements PipeTransform<any, any> {
  transform(value: Request, metadata: ArgumentMetadata): Partial<User> {
    return value.user;
  }
}
