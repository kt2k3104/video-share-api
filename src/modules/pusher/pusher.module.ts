import { DynamicModule, Global, Module } from '@nestjs/common';
import {
  PUSHER_CONFIG_TOKEN,
  PusherAsyncOptions,
} from 'src/common/types/pusher';
import { PusherService } from './pusher.service';

@Global()
@Module({})
export class PusherModule {
  static registerAsync(pusherOptions: PusherAsyncOptions): DynamicModule {
    return {
      module: PusherModule,
      providers: [
        PusherService,
        {
          provide: PUSHER_CONFIG_TOKEN,
          useFactory: pusherOptions.useFactory,
          inject: pusherOptions.inject,
        },
      ],
      exports: [PusherService],
    };
  }
}
