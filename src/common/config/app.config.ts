import * as process from 'process';
import * as dotenv from 'dotenv';

dotenv.config();

const appConfig = {
  port: parseInt(process.env.APP_PORT, 10) || 3000,
  version: process.env.APP_VERSION,
  prefix: process.env.APP_PREFIX,
  name: process.env.APP_NAME,
  domain: process.env.APP_DOMAIN || 'localhost',
  token_expire_time: process.env.TOKEN_EXPIRE_TIME,
  token_refresh_expire_time: process.env.TOKEN_REFRESH_EXPIRE_TIME,
  token_jwt_secret_key: process.env.TOKEN_JWT_SECRET_KEY,
  token_password_reset_expire_time:
    process.env.TOKEN_RESET_PASSWORD_EXPIRE_TIME,
};

export { appConfig };
