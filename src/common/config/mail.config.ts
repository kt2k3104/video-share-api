import * as process from 'process';
import * as dotenv from 'dotenv';

dotenv.config();

const mailConfig = {
  host: process.env.MAIL_HOST,
  user: process.env.MAIL_USER,
  password: process.env.MAIL_PASSWORD,
  from: process.env.MAIL_FROM,
};

export { mailConfig };
