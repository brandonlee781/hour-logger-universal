import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Content } from '../shared/Content';

@Entity('dont_be_a')
export class DontBeA {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column({ nullable: true }) phrase: string;

  @Column({ name: 'episode_no', nullable: true })
  episodeNo: string;

  @Column({ name: 'episode_title', nullable: true })
  episodeTitle: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;
}
