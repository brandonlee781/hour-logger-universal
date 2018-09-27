import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  RelationId,
} from 'typeorm';
import { Log } from '../log/log.entity';
import { User } from '../user/user.entity';
import { Content } from '../shared/Content';
import { Client } from '../client/client.entity';

@Entity()
export class Project extends Content {
  @Column() name: string;

  @Column() color: string;

  @Column({ default: false }) favorite: boolean;

  @OneToMany(type => Log, log => log.project)
  logs?: Log[];

  @ManyToOne(type => Client, client => client.projects)
  client: Client;

  @ManyToOne(type => User, user => user.projects)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @RelationId((project: Project) => project.client)
  clientId: string;

  @RelationId((project: Project) => project.user)
  userId: string;
}
