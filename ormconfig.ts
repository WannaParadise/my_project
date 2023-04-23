import { ConnectionOptions } from 'typeorm';

const connectionOptions: ConnectionOptions = {
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: true,
  logging: false,
  entities: ['src/entity/**/*.ts'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
};

export default connectionOptions;