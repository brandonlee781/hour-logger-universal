import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DontBeA } from './dontbea.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DontBeAService {
  constructor(
    @InjectRepository(DontBeA)
    private readonly dontBeARepository: Repository<DontBeA>,
  ) {}

  async findAll(): Promise<DontBeA[]> {
    return await this.dontBeARepository.find();
  }

  async findRand(): Promise<DontBeA> {
    const phrases = await this.dontBeARepository.find();
    const randNum = Math.floor(Math.random() * phrases.length);
    return phrases[randNum];
  }
}
