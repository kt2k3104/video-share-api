import * as process from 'process';
import * as dotenv from 'dotenv';

dotenv.config();

const pusherConfig = {
  app_id: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
};

export { pusherConfig };
