import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { genSalt, hash } from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id): Promise<User> {
    return await this.userRepository.findOne(id);
  }

  async findByEmail(email): Promise<User> {
    return await this.userRepository.findOne({
      select: ['id', 'email', 'password'],
      where: { email },
    });
  }

  async findCurrentUser(user): Promise<User> {
    return await this.userRepository.findOne({
      select: ['id', 'email', 'address', 'city', 'state', 'zip'],
      where: { id: user.id, email: user.email },
    });
  }

  async update(userId, patch): Promise<User> {
    const user = await this.userRepository.findOne({ id: userId });

    if (patch.password) {
      const salt = await genSalt(10);
      const hashed = await hash(patch.password, salt);
      user.password = hashed;
    }

    if (user) {
      user.email = patch.email;
      user.address = patch.address;
      user.city = patch.city;
      user.state = patch.state;
      user.zip = patch.zip;
      return this.userRepository.save(user);
    }

    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }
}
