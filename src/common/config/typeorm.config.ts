import * as dotenv from 'dotenv';
import * as process from 'process';
import { DataSource } from 'typeorm';

dotenv.config();

export default new DataSource({
  type: 'postgres',
  password: process.env.POSTGRES_PASSWORD,
  username: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  port: +process.env.POSTGRES_PORT,
  host: process.env.POSTGRES_HOST,
  entities: ['dist/**/*.entity.js'],
  migrations: ['./src/migrations/*.ts'],
  migrationsTableName: 'migrations',
});
