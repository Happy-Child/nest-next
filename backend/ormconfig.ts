import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as Entities from '@libs/entities';

const entities = Object.values(Entities);

console.log(entities);

export default {
  type: 'postgres',
  host: 'localhost',
  port: Number(process.env.POSTGRES_PORT) || 27179,
  username: 'postgres',
  password: 'postgres',
  database: 'nest_next',
  retryAttempts: Number(process.env.POSTGRES_RETRY_ATTEMPTS) || 5,
  retryDelay: Number(process.env.POSTGRES_RETRY_DELAY) || 2000,
  migrationsRun: false,
  migrations: [],
  entities,
  synchronize: true,
} as TypeOrmModuleOptions;
