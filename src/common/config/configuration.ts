import { appConfig } from './app.config';
import { cloudinaryConfig } from './cloudinary.config';
import { databaseConfig } from './database.config';
import { mailConfig } from './mail.config';
import { pusherConfig } from './pusher.config';

export default () => ({
  app: appConfig,
  cloudinary: cloudinaryConfig,
  database: databaseConfig,
  mail: mailConfig,
  pusher: pusherConfig,
});
