import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AppletConfigEntity } from './configuration/applet.config.entity';
import { UserEntity } from '@app/common/users/user.entity';
import { ActionEntity } from '@app/common/actions/action.entity';
import { ReactionEntity } from '@app/common/reactions/reaction.entity';

@Entity('applets')
export class AppletEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  is_active: boolean;

  @ManyToOne(() => UserEntity, (user) => user.applets)
  user: UserEntity;

  @ManyToOne(() => ActionEntity, (action) => action.applets)
  action: ActionEntity;

  @ManyToOne(() => ReactionEntity, (reaction) => reaction.applets)
  reaction: ReactionEntity;

  @OneToMany(() => AppletConfigEntity, (appletConfig) => appletConfig.applet)
  applet_configs: AppletConfigEntity[];
}