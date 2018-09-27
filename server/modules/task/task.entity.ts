import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Tree, TreeParent, TreeChildren } from 'typeorm';

import { Project } from '../project/project.entity';
import { Content } from '../shared/Content';
import { User } from '../user/user.entity';

@Entity()
@Tree('materialized-path')
export class Task extends Content {
  @Column()
  text: string;

  @Column({
    default: false,
  })
  completed: boolean;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  estimate: number;

  @Column({ nullable: true })
  priority: number;

  // @ManyToOne(type => Task, task => task.parent)
  // @JoinColumn({ name: 'parent' })
  @TreeParent()
  parent: Task;

  // @OneToMany(type => Task, task => task.parent)
  @TreeChildren()
  children: any;

  @ManyToOne(type => Project, project => project.logs)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(type => User, user => user.logs)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
