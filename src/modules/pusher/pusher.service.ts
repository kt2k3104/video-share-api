import { Inject, Injectable } from '@nestjs/common';
import * as Pusher from 'pusher';
import { PUSHER_CONFIG_TOKEN, PusherConfig } from 'src/common/types/pusher';

@Injectable()
export class PusherService {
  private pusher: Pusher;

  constructor(@Inject(PUSHER_CONFIG_TOKEN) config: PusherConfig) {
    this.pusher = new Pusher({
      appId: config.app_id,
      key: config.key,
      secret: config.secret,
      cluster: config.cluster,
      useTLS: true,
    });
  }

  trigger(channel: string, event: string, data: any) {
    this.pusher.trigger(channel, event, JSON.stringify(data));
  }
}
