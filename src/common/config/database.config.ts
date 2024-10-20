import * as dotenv from 'dotenv';
import * as process from 'process';

dotenv.config();

const databaseConfig = {
  postgres: {
    password: process.env.POSTGRES_PASSWORD,
    user: process.env.POSTGRES_USER,
    db: process.env.POSTGRES_DB,
    port: process.env.POSTGRES_PORT,
    host: process.env.POSTGRES_HOST,
  },
};

export { databaseConfig };
