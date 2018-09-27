import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Content } from '../shared/Content';
import { Log } from '../log/log.entity';
import { User } from '../user/user.entity';

@Entity()
export class Invoice extends Content {
  @Index({ unique: true })
  @Column()
  number: number;

  @Column() date: string;

  @Column('jsonb') logs: Log[];

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  hours: number;

  @Column() rate: number;

  @ManyToOne(type => User, user => user.invoices)
  @JoinColumn({ name: 'user_id' })
  user?: User;
}
