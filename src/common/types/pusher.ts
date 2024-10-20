import { ModuleMetadata } from '@nestjs/common';

export class PusherConfig {
  app_id: string;
  key: string;
  secret: string;
  cluster: string;
}

export interface PusherAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useFactory?: (...args: any[]) => Promise<PusherConfig> | PusherConfig;
}

export const PUSHER_CONFIG_TOKEN = 'PUSHER_CONFIG';
