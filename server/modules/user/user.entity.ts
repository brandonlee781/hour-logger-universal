import { Entity, Column, OneToMany } from 'typeorm';
import { Content } from '../shared/Content';
import { Log } from '../log/log.entity';
import { Project } from '../project/project.entity';
import { Invoice } from '../invoice/invoice.entity';
import { Client } from '../client/client.entity';

@Entity()
export class User extends Content {
  @Column()
  email: string;

  @Column({ select: false })
  password?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ nullable: true })
  zip?: string;

  @OneToMany(type => Log, log => log.user)
  logs?: Log[];

  @OneToMany(type => Project, project => project.user)
  projects?: Project[];

  @OneToMany(type => Invoice, invoice => invoice.user)
  invoices?: Invoice[];

  @OneToMany(type => Client, client => client.user)
  client?: Client[];
}
