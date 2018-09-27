import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { Content } from '../shared/Content';
import { User } from '../user/user.entity';
import { Project } from '../project/project.entity';

@Entity()
export class Client extends Content {
  @Column()
  name: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ nullable: true })
  zip?: string;

  @ManyToOne(type => User, user => user.client)
  user?: User;

  @OneToMany(type => Project, project => project.client)
  projects?: Project[];
}
