import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './common/config/configuration';
import { AuthModule } from './modules/auth/auth.module';
import { MailerModule, PugAdapter } from '@nest-modules/mailer';
import { join } from 'path';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.postgres.host'),
        port: +configService.get('database.postgres.port'),
        username: configService.get('database.postgres.user'),
        password: configService.get('database.postgres.password'),
        database: configService.get('database.postgres.db', 'ecommerce-db'),
        entities: ['dist/**/*.entity.js'],
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('mail.host'),
          secure: false,
          auth: {
            user: configService.get('mail.user'),
            pass: configService.get('mail.password'),
          },
        },
        defaults: {
          from: `'No Reply' <${configService.get('mail.from')}>`,
        },
        template: {
          dir: join(__dirname, 'common/templates'),
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
