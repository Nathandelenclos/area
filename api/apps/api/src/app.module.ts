import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@app/common/auth/auth.guard';
import MicroServiceProxy from '@app/common/micro.service.proxy';
import MicroServiceInit from '@app/common/micro.service.init';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscordController } from './controllers/discord.controller';
import { UserEntity } from '@app/common/users/user.entity';
import { ServiceModule } from '@app/common/services/service.module';
import { ActionModule } from '@app/common/actions/action.module';
import { ReactionModule } from '@app/common/reactions/reaction.module';
import { ServiceEntity } from '@app/common/services/service.entity';
import { ReactionEntity } from '@app/common/reactions/reaction.entity';
import { ActionEntity } from '@app/common/actions/action.entity';
import { ServiceController } from './controllers/service.controller';
import { AppletModule } from '@app/common/applets/applet.module';
import { AppletController } from './controllers/applet.controller';
import { AppletEntity } from '@app/common/applets/applet.entity';
import { AppletConfigEntity } from '@app/common/applets/configuration/applet.config.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      global: true,
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '10d' },
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('MYSQL_HOST'),
        port: configService.get('MYSQL_PORT'),
        username: configService.get('MYSQL_USER'),
        password: configService.get('MYSQL_PASSWORD'),
        database: configService.get('MYSQL_DATABASE'),
        entities: [
          ServiceEntity,
          ActionEntity,
          ReactionEntity,
          UserEntity,
          AppletEntity,
          AppletConfigEntity,
        ],
        synchronize: true,
      }),
    }),
    AppletModule,
    ServiceModule,
    ActionModule,
    ReactionModule,
  ],
  controllers: [
    AppController,
    AuthController,
    AppletController,
    DiscordController,
    ServiceController,
  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    MicroServiceInit.init(
      'AUTH_SERVICE',
      MicroServiceProxy.microServiceQueue.AUTH_SERVICE,
    ),
    MicroServiceInit.init(
      'DISCORD_SERVICE',
      MicroServiceProxy.microServiceQueue.DISCORD_SERVICE,
    ),
  ],
})
export class AppModule {}
